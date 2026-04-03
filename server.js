const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' },
  // Render.com などのリバースプロキシ対応
  transports: ['websocket', 'polling'],
});

// Render.com は process.env.PORT を使用
const PORT = process.env.PORT || 3001;

// ─── ランクシステム ───────────────────────────────────────────
const RANKS = [
  { name: 'ブロンズ',   color: '#CD7F32', minRP: 0    },
  { name: 'シルバー',   color: '#C0C0C0', minRP: 1000 },
  { name: 'ゴールド',   color: '#FFD700', minRP: 2500 },
  { name: 'プラチナ',   color: '#00CED1', minRP: 5000 },
  { name: 'ダイヤ',     color: '#B9F2FF', minRP: 8000 },
];

function getRank(rp) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (rp >= RANKS[i].minRP) return RANKS[i];
  }
  return RANKS[0];
}

// ─── ルーム管理 ───────────────────────────────────────────────
const rooms = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// 正解判定
function isCorrectAnswer(submitted, correct, isMulti) {
  if (isMulti && Array.isArray(correct)) {
    if (!Array.isArray(submitted)) return false;
    const sortedSub = [...submitted].map(Number).sort();
    const sortedCor = [...correct].map(Number).sort();
    return JSON.stringify(sortedSub) === JSON.stringify(sortedCor);
  }
  return Number(submitted) === Number(correct);
}

// ─── Socket.io ───────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log('接続:', socket.id);

  // ─── ルーム作成 ───────────────────────────────────────────
  socket.on('create-room', ({ hostName }) => {
    let code;
    do { code = generateRoomCode(); } while (rooms.has(code));

    const room = {
      code,
      hostId: socket.id,
      hostName: hostName || 'ホスト',
      players: new Map(),
      state: 'waiting',
      questions: [],
      currentIndex: 0,
      currentBuzzer: null,
      pendingRP: new Map(),
      settings: { chapters: [], difficulty: 1 },
    };
    rooms.set(code, room);
    socket.join(code);
    console.log(`ルーム作成: ${code} by ${hostName}`);
    socket.emit('room-created', { code });
  });

  // ─── ルーム参加 ───────────────────────────────────────────
  socket.on('join-room', ({ code, playerName, avatarId, rp }) => {
    const room = rooms.get(code);
    if (!room) {
      socket.emit('join-result', { success: false, error: 'ルームが見つかりません' });
      return;
    }
    if (room.state !== 'waiting') {
      socket.emit('join-result', { success: false, error: 'クイズがすでに始まっています' });
      return;
    }
    const player = {
      id: socket.id,
      name: playerName,
      avatarId: avatarId || 0,
      rp: rp || 500,
      score: 0,
      correct: 0,
      wrong: 0,
    };
    room.players.set(socket.id, player);
    socket.join(code);
    socket.data.roomCode = code;
    socket.data.playerName = playerName;

    const players = [...room.players.values()].map(p => ({
      id: p.id, name: p.name, avatarId: p.avatarId, rp: p.rp, rank: getRank(p.rp), score: p.score
    }));
    io.to(code).emit('room-update', { players });
    socket.emit('join-result', { success: true, players });
    console.log(`参加: ${playerName} → ${code}`);
  });

  // ─── クイズ設定 ───────────────────────────────────────────
  socket.on('set-questions', ({ code, questions, settings }) => {
    const room = rooms.get(code);
    if (!room || room.hostId !== socket.id) return;
    room.questions = questions;
    room.settings = settings;
    room.currentIndex = 0;
    room.pendingRP = new Map();
    [...room.players.values()].forEach(p => { p.score = 0; p.correct = 0; p.wrong = 0; });
    socket.emit('questions-set', { total: questions.length });
  });

  // ─── クイズ開始 ───────────────────────────────────────────
  socket.on('start-quiz', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.hostId !== socket.id) return;
    room.state = 'waiting';
    room.currentIndex = 0;
    io.to(code).emit('quiz-started', { total: room.questions.length });
  });

  // ─── カットイン ───────────────────────────────────────────
  socket.on('show-cutin', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.hostId !== socket.id) return;
    room.state = 'cutin';
    const qNum = room.currentIndex + 1;
    io.to(code).emit('cutin', { questionNumber: qNum, total: room.questions.length });
  });

  // ─── 問題表示 ─────────────────────────────────────────────
  socket.on('show-question', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.hostId !== socket.id) return;
    const q = room.questions[room.currentIndex];
    if (!q) return;
    room.state = 'question';
    room.currentBuzzer = null;
    io.to(code).emit('question', {
      index: room.currentIndex,
      total: room.questions.length,
      question: q.question,
      choices: q.choices,
      multi: q.multi || false,
    });
  });

  // ─── 早押し ───────────────────────────────────────────────
  socket.on('buzz-in', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.state !== 'question') return;
    const player = room.players.get(socket.id);
    if (!player) return;
    if (!room.currentBuzzer) {
      room.currentBuzzer = socket.id;
      room.state = 'judging';
      io.to(code).emit('buzzed', { playerId: socket.id, playerName: player.name, avatarId: player.avatarId });
    }
  });

  // ─── 回答提出 ─────────────────────────────────────────────
  socket.on('submit-answer', ({ code, answer }) => {
    const room = rooms.get(code);
    if (!room || room.state !== 'judging') return;
    if (room.currentBuzzer !== socket.id) return;
    const player = room.players.get(socket.id);
    if (!player) return;
    const q = room.questions[room.currentIndex];
    const correct = isCorrectAnswer(answer, q.correct, q.multi);

    const RP_CORRECT = 30;
    const RP_WRONG = -15;
    const delta = correct ? RP_CORRECT : RP_WRONG;
    const prev = room.pendingRP.get(player.name) || 0;
    room.pendingRP.set(player.name, prev + delta);

    if (correct) { player.score += 1; player.correct += 1; }
    else { player.wrong += 1; }
    room.state = 'result';

    const players = [...room.players.values()].map(p => ({
      id: p.id, name: p.name, avatarId: p.avatarId, rp: p.rp, rank: getRank(p.rp),
      score: p.score, correct: p.correct, wrong: p.wrong,
    }));

    io.to(code).emit('answer-result', {
      playerId: socket.id,
      playerName: player.name,
      correct,
      correctAnswer: q.correct,
      explanation: q.explanation || '',
      players,
      rpDelta: delta,
    });
  });

  // ─── 次の問題 ─────────────────────────────────────────────
  socket.on('next-question', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.hostId !== socket.id) return;
    room.currentIndex++;
    if (room.currentIndex >= room.questions.length) {
      socket.emit('no-more-questions');
    } else {
      room.state = 'waiting';
      socket.emit('ready-for-next', { index: room.currentIndex });
    }
  });

  // ─── クイズ終了（RPはクライアント側で保存） ──────────────────
  socket.on('end-quiz', ({ code }) => {
    const room = rooms.get(code);
    if (!room || room.hostId !== socket.id) return;
    room.state = 'finished';

    const rpSummary = [];
    room.players.forEach((player) => {
      const delta = room.pendingRP.get(player.name) || 0;
      const oldRp = player.rp || 500;
      const newRp = Math.max(0, oldRp + delta);
      const oldRank = getRank(oldRp);
      const newRank = getRank(newRp);
      rpSummary.push({
        name: player.name,
        delta,
        oldRP: oldRp,
        newRP: newRp,
        oldRank: oldRank.name,
        newRank: newRank.name,
        rankChanged: oldRank.name !== newRank.name,
        rankUp: newRp >= oldRp,
      });
    });

    const finalPlayers = [...room.players.values()].map(p => ({
      id: p.id, name: p.name, avatarId: p.avatarId, score: p.score, correct: p.correct, wrong: p.wrong,
    }));

    io.to(code).emit('quiz-finished', { players: finalPlayers, rpSummary });
  });

  // ─── 切断 ─────────────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log('切断:', socket.id);
    const code = socket.data.roomCode;
    if (!code) return;
    const room = rooms.get(code);
    if (!room) return;
    if (room.hostId === socket.id) {
      io.to(code).emit('host-disconnected');
      rooms.delete(code);
    } else {
      room.players.delete(socket.id);
      const players = [...room.players.values()].map(p => ({
        id: p.id, name: p.name, avatarId: p.avatarId, rp: p.rp, rank: getRank(p.rp), score: p.score
      }));
      io.to(code).emit('room-update', { players });
    }
  });
});

// ─── 静的ファイル配信 ─────────────────────────────────────────
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));
app.get('*', (req, res) => res.sendFile(path.join(publicDir, 'index.html')));

server.listen(PORT, () => {
  console.log(`サーバー起動: http://localhost:${PORT}`);
});
