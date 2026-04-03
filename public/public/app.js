// ═══════════════════════════════════════════════════
//  理科クイズ 早押し app.js  (vanilla JS)
// ═══════════════════════════════════════════════════

// ─── ランク設定 ──────────────────────────────────────
const RANKS = [
  { name:'ブロンズ', color:'#CD7F32', icon:'🥉', minRP:0    },
  { name:'シルバー', color:'#C0C0C0', icon:'🥈', minRP:1000 },
  { name:'ゴールド', color:'#FFD700', icon:'🥇', minRP:2500 },
  { name:'プラチナ', color:'#00E5FF', icon:'💎', minRP:5000 },
  { name:'ダイヤ',   color:'#B9F2FF', icon:'✨', minRP:8000 },
];
const AVATARS = [
  {id:0,e:'🐶'},{id:1,e:'🐱'},{id:2,e:'🐭'},{id:3,e:'🐻'},
  {id:4,e:'🐼'},{id:5,e:'🐸'},{id:6,e:'🦊'},{id:7,e:'🐯'},
  {id:8,e:'🦁'},{id:9,e:'🐧'},{id:10,e:'🦄'},{id:11,e:'🐲'},
];
function av(id){ return (AVATARS[id]||AVATARS[0]).e; }
function getRank(rp){ for(let i=RANKS.length-1;i>=0;i--) if(rp>=RANKS[i].minRP) return RANKS[i]; return RANKS[0]; }
function getRankPct(rp){ const r=getRank(rp), idx=RANKS.indexOf(r), n=RANKS[idx+1]; if(!n) return 100; return Math.min(100,Math.floor((rp-r.minRP)/(n.minRP-r.minRP)*100)); }

// ─── 問題バンク ──────────────────────────────────────
const QB = {
 '1年':{
  '生物':{
   '植物の生活と種類':{
    1:[
     {q:'光合成で植物が取り込む気体は？',c:['酸素','二酸化炭素','窒素','水素'],a:1,e:'植物は光合成で二酸化炭素を吸収し酸素を放出する。'},
     {q:'植物の気体の出入り口を何というか？',c:['葉脈','葉緑体','気孔','細胞壁'],a:2,e:'気孔は葉の表面にある開閉する穴。'},
     {q:'光合成が行われる細胞の緑色の粒は？',c:['液胞','ミトコンドリア','葉緑体','核'],a:2,e:'葉緑体にクロロフィルが含まれ光合成を行う。'},
     {q:'胚珠が子房に包まれている植物は？',c:['裸子植物','被子植物','シダ植物','コケ植物'],a:1,e:'被子植物は胚珠が子房に包まれる。'},
     {q:'根から水を吸収する細い毛状の構造は？',c:['根毛','側根','主根','仮根'],a:0,e:'根毛は表面積を広げ水分吸収を助ける。'},
    ],
    2:[
     {q:'蒸散が最も盛んに行われる場所は？',c:['根','茎','葉の裏側','葉の表側'],a:2,e:'気孔は葉の裏側に多く蒸散の大部分が起こる。'},
     {q:'光合成の材料をすべて選べ。',c:['水','酸素','二酸化炭素','デンプン'],a:[0,2],m:true,e:'光合成は水とCO₂を原料にする。'},
     {q:'植物の茎で水を運ぶ管は？',c:['師管','道管','仮道管','細胞壁'],a:1,e:'道管は根から葉へ水と無機塩類を運ぶ。'},
     {q:'次のうち裸子植物はどれか？',c:['イチョウ','サクラ','アサガオ','タンポポ'],a:0,e:'イチョウ・マツ・スギは裸子植物。'},
    ],
    3:[
     {q:'コケとシダの共通点は？',c:['種子で増える','維管束がある','花が咲く','胞子で増える'],a:3,e:'コケもシダも胞子で増える。'},
     {q:'道管と師管の正しい説明は？',c:['師管は水を運ぶ','道管は栄養を運ぶ','道管と師管はセットで存在','茎では師管が内側'],a:2,e:'道管と師管は一緒に維管束を形成する。'},
    ],
   },
   '動物の生活と種類':{
    1:[
     {q:'消化管の正しい順番は？',c:['口→食道→胃→小腸→大腸→肛門','口→胃→食道→小腸→大腸→肛門','口→食道→小腸→胃→大腸→肛門','口→食道→胃→大腸→小腸→肛門'],a:0,e:'消化管は口から肛門まで一本の管。'},
     {q:'背骨を持つ動物の総称は？',c:['無脊椎動物','節足動物','脊椎動物','軟体動物'],a:2,e:'脊椎動物は魚類・両生類・爬虫類・鳥類・哺乳類。'},
     {q:'哺乳類の特徴は？',c:['変温動物','えらで呼吸','子を乳で育てる','卵を産む'],a:2,e:'哺乳類は恒温動物で子を乳で育てる。'},
     {q:'魚類の呼吸器官は？',c:['肺','皮膚','気管','えら'],a:3,e:'魚類は水中でえらを使って酸素を取り込む。'},
    ],
    2:[
     {q:'デンプンを分解する消化酵素は？',c:['ペプシン','アミラーゼ','リパーゼ','トリプシン'],a:1,e:'アミラーゼは唾液・膵液に含まれデンプンを分解。'},
     {q:'恒温動物をすべて選べ。',c:['魚類','両生類','鳥類','哺乳類'],a:[2,3],m:true,e:'鳥類と哺乳類は恒温動物。'},
     {q:'小腸の内壁の突起の名前は？',c:['毛細血管','柔毛','リンパ管','絨毛'],a:3,e:'絨毛は小腸の表面積を大きくし栄養吸収を高める。'},
    ],
    3:[
     {q:'正しい組み合わせをすべて選べ。',c:['カエル－両生類','ヤモリ－両生類','イルカ－哺乳類','コウモリ－鳥類'],a:[0,2],m:true,e:'カエルは両生類、イルカは哺乳類。ヤモリは爬虫類。'},
    ],
   },
  },
  '化学':{
   '物質のすがた':{
    1:[
     {q:'純物質はどれか？',c:['食塩水','空気','蒸留水','牛乳'],a:2,e:'蒸留水はH₂Oのみの純物質。'},
     {q:'有機物を燃やすと必ず発生する気体は？',c:['酸素','水素','二酸化炭素','窒素'],a:2,e:'有機物は炭素を含むためCO₂が必ず発生する。'},
     {q:'金属の共通の性質は？',c:['電気を通さない','水に溶ける','磁石に引きつけられる','光沢がある'],a:3,e:'金属は光沢・電気熱伝導・展性延性が共通性質。'},
     {q:'水の電気分解で陰極に発生する気体は？',c:['酸素','水素','二酸化炭素','塩素'],a:1,e:'陰極→水素（2倍）、陽極→酸素（1倍）。'},
    ],
    2:[
     {q:'沸点の差を利用して混合物を分離する方法は？',c:['ろ過','蒸留','再結晶','昇華'],a:1,e:'蒸留は沸点の違いを利用して成分を分離。'},
     {q:'金属でないものをすべて選べ。',c:['硫黄','炭素','鉄','アルミニウム'],a:[0,1],m:true,e:'硫黄と炭素は非金属。'},
    ],
    3:[
     {q:'水の状態変化で正しいのは？',c:['融解：固体→液体','蒸発：液体→固体','凝縮：気体→液体','凝固：液体→気体'],a:0,e:'融解:固→液、凝縮:気→液、凝固:液→固。'},
    ],
   },
   '水溶液':{
    1:[
     {q:'質量パーセント濃度の式は？',c:['溶質÷溶液×100','溶液÷溶質×100','溶媒÷溶液×100','溶質÷溶媒×100'],a:0,e:'質量パーセント濃度=溶質÷溶液×100。'},
     {q:'食塩水で食塩は何と呼ばれる？',c:['溶媒','溶液','溶質','懸濁液'],a:2,e:'溶かされる物質が溶質、溶かす液体が溶媒。'},
    ],
    2:[
     {q:'溶解度について正しいものをすべて選べ。',c:['温度が上がると気体の溶解度は下がる','温度上昇で固体は多くの場合溶けやすくなる','溶解度は溶媒の量に依存しない','溶解度は物質によって異なる'],a:[0,1,3],m:true,e:'気体は温度上昇で溶けにくく、固体は溶けやすくなることが多い。'},
    ],
   },
  },
  '物理':{
   '光と音':{
    1:[
     {q:'光が屈折する現象の名前は？',c:['反射','屈折','回折','散乱'],a:1,e:'光が異なる媒質の境界で曲がる現象を屈折という。'},
     {q:'音速は空気中でおよそ何m/s？',c:['34m/s','340m/s','3400m/s','34000m/s'],a:1,e:'音速は空気中で約340m/s（15℃）。'},
     {q:'振動数が大きいほど音はどうなる？',c:['低くなる','変わらない','高くなる','うるさくなる'],a:2,e:'振動数（Hz）が大きいほど高い音になる。'},
     {q:'光の反射の法則は？',c:['入射角＞反射角','入射角＝反射角','入射角＜反射角','角度は無関係'],a:1,e:'反射の法則：入射角＝反射角。'},
    ],
    2:[
     {q:'音の三要素をすべて選べ。',c:['大きさ','高さ','音色','速さ'],a:[0,1,2],m:true,e:'音の三要素は大きさ・高さ・音色。'},
    ],
   },
   '力と圧力':{
    1:[
     {q:'力の単位は？',c:['Pa','N','J','W'],a:1,e:'力の単位はN（ニュートン）。'},
     {q:'圧力の公式は？',c:['圧力＝力×面積','圧力＝力÷面積','圧力＝面積÷力','圧力＝力²÷面積'],a:1,e:'圧力（Pa）＝力（N）÷面積（m²）。'},
     {q:'水中の物体にはたらく水による圧力は？',c:['大気圧','気圧','水圧','浮力'],a:2,e:'水圧は深いほど大きく全方向にはたらく。'},
    ],
    2:[
     {q:'2力のつり合いの条件をすべて選べ。',c:['同じ大きさ','逆向き','同一直線上','直角に交わる'],a:[0,1,2],m:true,e:'2力のつり合い：同じ大きさ・逆向き・同一直線上。'},
    ],
   },
  },
  '地学':{
   '大地の変化':{
    1:[
     {q:'地震が発生した地下の場所は？',c:['震央','震源','震度','マグニチュード'],a:1,e:'震源は地震発生点、震央はその真上の地表点。'},
     {q:'火山岩と深成岩の違いを決めるのは？',c:['成分','冷え固まる速さ','噴出時期','鉱物'],a:1,e:'火山岩は急冷（斑状組織）、深成岩はゆっくり冷える（等粒状）。'},
     {q:'P波の後に来る大きな揺れは？',c:['初期微動','主要動','余震','前震'],a:1,e:'P波（縦波）が先に届き初期微動、S波（横波）が主要動。'},
     {q:'中生代の示準化石は？',c:['シジミ','サンゴ','アンモナイト','スギ'],a:2,e:'アンモナイトは中生代の代表的な示準化石。'},
    ],
    2:[
     {q:'マグマの粘性が火山の形を決める。高粘性のマグマでできる形は？',c:['盾状火山','溶岩台地','溶岩ドーム','カルデラ'],a:2,e:'粘性が高い→溶岩ドーム。低い→盾状火山。'},
    ],
   },
  },
 },
 '2年':{
  '化学':{
   '化学変化と原子・分子':{
    1:[
     {q:'物質を構成する最小の粒子は？',c:['分子','原子','イオン','電子'],a:1,e:'原子はそれ以上化学的に分割できない最小粒子。'},
     {q:'水素の元素記号は？',c:['He','H','Ho','Hg'],a:1,e:'水素はH。He=ヘリウム、Hg=水銀。'},
     {q:'化学変化の前後で質量が変わらない法則は？',c:['定比例の法則','質量保存の法則','倍数比例の法則','ボイルの法則'],a:1,e:'質量保存の法則：化学変化前後で全体の質量は変化しない。'},
     {q:'物質が酸素と化合する変化は？',c:['還元','酸化','中和','電離'],a:1,e:'酸化は酸素との化合。還元は酸素を失う変化。'},
     {q:'酸化銅を炭素で加熱すると何が発生？',c:['酸素','水素','二酸化炭素','水'],a:2,e:'CuO+C→Cu+CO₂。炭素が酸素を奪う還元反応。'},
    ],
    2:[
     {q:'H₂Oについて正しいものをすべて選べ。',c:['水素原子が2個','酸素原子が1個','1種類の元素','2種類の元素'],a:[0,1,3],m:true,e:'H₂Oは水素2個・酸素1個の2種類の元素からなる化合物。'},
    ],
   },
  },
  '物理':{
   '電流とその利用':{
    1:[
     {q:'電流の単位は？',c:['V（ボルト）','A（アンペア）','Ω（オーム）','W（ワット）'],a:1,e:'電流はA（アンペア）。電圧はV、抵抗はΩ。'},
     {q:'オームの法則の式は？',c:['V＝R÷I','V＝I×R','I＝V×R','R＝V×I'],a:1,e:'V（V）＝I（A）×R（Ω）。'},
     {q:'並列回路で各抵抗の電圧の関係は？',c:['抵抗によって異なる','すべて同じ','合計が電源電圧','抵抗に比例'],a:1,e:'並列回路では各抵抗の電圧は電源電圧と同じ。'},
     {q:'電流が磁界から受ける力の向きを決める法則は？',c:['フレミング左手','フレミング右手','アンペール','レンツ'],a:0,e:'フレミングの左手の法則：電流・磁界→力（モーター原理）。'},
    ],
    2:[
     {q:'直列回路について正しいものをすべて選べ。',c:['各抵抗に流れる電流は同じ','全抵抗は各抵抗の和','各電圧の和が電源電圧','断線すると全部消える'],a:[0,1,2,3],m:true,e:'直列回路：電流同じ・全抵抗=和・電圧分圧・断線で全消灯。'},
    ],
   },
  },
  '生物':{
   '生物の体のつくり':{
    1:[
     {q:'細胞の核にある遺伝情報の物質は？',c:['RNA','DNA','タンパク質','脂質'],a:1,e:'DNAは遺伝情報を持つ2本鎖の核酸。'},
     {q:'植物細胞にあって動物細胞にないものは？',c:['核','細胞膜','細胞壁','ミトコンドリア'],a:2,e:'細胞壁と葉緑体は植物細胞に特有。'},
     {q:'赤血球の主な役割は？',c:['免疫','止血','酸素の運搬','栄養の運搬'],a:2,e:'赤血球はヘモグロビンで酸素を運搬。'},
    ],
   },
  },
  '地学':{
   '気象とその変化':{
    1:[
     {q:'中心気圧が周囲より高いのは？',c:['低気圧','高気圧','前線','気団'],a:1,e:'高気圧：中心が周囲より気圧が高い。北半球では時計回りに風が吹き出す。'},
     {q:'日本の天気が西から東へ移り変わる原因は？',c:['モンスーン','偏西風','貿易風','季節風'],a:1,e:'偏西風（ジェット気流）が低気圧・高気圧を東へ運ぶ。'},
     {q:'雲の発生の仕組みとして正しいのは？',c:['空気が冷やされ水蒸気が凝結','空気が暖められ水蒸気が蒸発','高気圧中心で上昇気流','地表の水が直接雲になる'],a:0,e:'上昇した空気が膨張・冷却され露点以下になると雲が発生。'},
    ],
   },
  },
 },
 '3年':{
  '物理':{
   '運動とエネルギー':{
    1:[
     {q:'仕事の公式は？',c:['仕事＝力×時間','仕事＝力×距離','仕事＝質量×速さ','仕事＝力²÷距離'],a:1,e:'仕事（J）＝力（N）×距離（m）。'},
     {q:'運動している物体が持つエネルギーは？',c:['位置エネルギー','熱エネルギー','運動エネルギー','弾性エネルギー'],a:2,e:'運動エネルギー＝½mv²。'},
     {q:'等速直線運動をする物体の合力は？',c:['0N','1N','重力と同じ','速さに比例'],a:0,e:'等速直線運動：合力＝0N（慣性の法則）。'},
     {q:'力学的エネルギーが保存される条件は？',c:['摩擦力がはたらく','空気抵抗がある','摩擦・空気抵抗が無視できる','外力が常にはたらく'],a:2,e:'摩擦・空気抵抗がなければ力学的エネルギーは保存。'},
    ],
    2:[
     {q:'作用・反作用の法則で正しいものをすべて選べ。',c:['2力は同じ大きさ','2力は逆向き','異なる物体にはたらく','2力はつり合う'],a:[0,1,2],m:true,e:'作用反作用：同じ大きさ・逆向き・異なる物体。つり合いとは異なる。'},
    ],
   },
  },
  '化学':{
   '化学変化とイオン':{
    1:[
     {q:'原子が電子を失った粒子は？',c:['陰イオン','陽イオン','中性原子','分子'],a:1,e:'電子を失う→正の電荷→陽イオン。'},
     {q:'酸とは何か（アレニウスの定義）？',c:['水中でOH⁻を出す','水中でH⁺を出す','電子を受け取る','電子を与える'],a:1,e:'酸は水溶液中でH⁺（水素イオン）を出す物質。'},
     {q:'NaClが水に溶けると？',c:['NaとClに分解','Na⁺とCl⁻に電離','NaClのまま溶ける','水素が発生'],a:1,e:'NaCl→Na⁺＋Cl⁻。電解質はイオンに電離する。'},
     {q:'中和反応で生成するものは？',c:['酸と塩基','水と塩','水素と酸素','酸素と水'],a:1,e:'中和：酸＋塩基→塩＋水。'},
     {q:'pH7より小さい水溶液の性質は？',c:['塩基性','中性','酸性','アルカリ性'],a:2,e:'pH<7：酸性、pH=7：中性、pH>7：塩基性。'},
    ],
   },
  },
  '生物':{
   '生命の連続性':{
    1:[
     {q:'有性生殖の特徴は？',c:['親と全く同じ子','遺伝子の組み合わせが多様','栄養生殖はこれにあたる','分裂によって増える'],a:1,e:'有性生殖：受精により多様な遺伝子の組み合わせが生まれる。'},
     {q:'生殖細胞の染色体数は体細胞と比べて？',c:['2倍','同数','半分','決まりなし'],a:2,e:'減数分裂により生殖細胞の染色体数は体細胞の半分（n）。'},
     {q:'DNA塩基の正しい対合は？',c:['AとG','TとC','AとT','GとT'],a:2,e:'DNA塩基対：AとT、GとC。'},
    ],
   },
  },
  '地学':{
   '地球と宇宙':{
    1:[
     {q:'地球から最も近い恒星は？',c:['シリウス','太陽','ベテルギウス','プロキシマ'],a:1,e:'最も近い恒星は太陽（約1.5億km）。'},
     {q:'月の公転周期は約何日？',c:['7日','14日','27日','365日'],a:2,e:'月の公転周期は約27.3日（恒星月）。'},
     {q:'地球型惑星はどれか？',c:['木星','土星','火星','天王星'],a:2,e:'地球型惑星（岩石質）：水星・金星・地球・火星。'},
     {q:'日食が起こるのはいつ？',c:['満月','新月','上弦の月','下弦の月'],a:1,e:'日食：新月のとき月が太陽を隠す。'},
    ],
   },
  },
 },
};

function getGrades(){ return Object.keys(QB); }
function getSubjects(g){ return Object.keys(QB[g]||{}); }
function getChapters(g,s){ return Object.keys((QB[g]||{})[s]||{}); }
function getQuestions(chapters, diff){
  const qs=[];
  for(const {g,s,ch} of chapters){
    const pool=(((QB[g]||{})[s]||{})[ch]||{})[diff]||[];
    qs.push(...pool);
  }
  for(let i=qs.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [qs[i],qs[j]]=[qs[j],qs[i]]; }
  // サーバーが期待するプロパティ名に変換（q→question, c→choices, a→correct, m→multi, e→explanation）
  return qs.map(item=>({
    question: item.q,
    choices: item.c,
    correct: item.a,
    multi: item.m||false,
    explanation: item.e||'',
  }));
}

// ─── 音声 ────────────────────────────────────────────
let actx=null;
function getACtx(){ if(!actx) actx=new(window.AudioContext||window.webkitAudioContext)(); if(actx.state==='suspended') actx.resume(); return actx; }
function tone(freq,type,dur,vol=0.3,t0=0){
  try{ const c=getACtx(),o=c.createOscillator(),g=c.createGain();
    o.connect(g);g.connect(c.destination);o.type=type;o.frequency.value=freq;
    g.gain.setValueAtTime(vol,c.currentTime+t0);
    g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+t0+dur);
    o.start(c.currentTime+t0);o.stop(c.currentTime+t0+dur+0.05);
  }catch(e){}
}
function playDeden(){ tone(220,'sawtooth',0.15,0.3,0);tone(277,'sawtooth',0.15,0.3,0.12);tone(330,'sawtooth',0.3,0.3,0.24); }
function playBuzz(){ tone(660,'sine',0.2,0.4); }
function playOK(){ tone(880,'sine',0.4,0.3); }
function playNG(){ tone(150,'square',0.4,0.3); }
document.addEventListener('touchstart',()=>getACtx(),{once:true});

// ─── アカウント管理 ──────────────────────────────────
const AKEY='rika_quiz_acc_v2';
function loadAcc(){ try{ const r=localStorage.getItem(AKEY); return r?JSON.parse(r):null; }catch{return null;} }
function saveAcc(a){ const {rank,...rest}=a; localStorage.setItem(AKEY,JSON.stringify(rest)); }

// ─── Socket ──────────────────────────────────────────
const socket=io({path:'/socket.io',transports:['websocket','polling']});

// ─── グローバル状態 ──────────────────────────────────
const S={
  screen:'home',
  account:null,
  // ホスト
  grade:'', subject:'', pendingCh:[], diff:1,
  roomCode:'', questions:[], players:[],
  qIndex:0, quizPhase:'idle', buzzer:null, answerResult:null,
  // プレイヤー
  joinCode:'', joinName:'', joinAvatar:0,
  pPhase:'wait', pQuestion:null, pBuzzer:null,
  pMyAnswer:null, pAnswerResult:null,
  pMyScore:0, pFinalData:null, pCutin:null,
};

// ─── レンダリング ────────────────────────────────────
const app=document.getElementById('app');
function render(){ app.innerHTML=''; build(); }

function build(){
  switch(S.screen){
    case 'home':     renderHome();     break;
    case 'login':    renderLogin();    break;
    case 'register': renderRegister(); break;
    case 'profile':  renderProfile();  break;
    case 'host':     renderHost();     break;
    case 'player':   renderPlayer();   break;
  }
}

// ─── ユーティリティ DOM ──────────────────────────────
function el(tag,cls,html=''){
  const e=document.createElement(tag);
  if(cls) e.className=cls;
  if(html) e.innerHTML=html;
  return e;
}
function btn(label,cls,cb){
  const b=el('button','btn '+cls,label);
  b.onclick=cb; return b;
}
function backBtn(to){ return btn('← 戻る','btn-ghost btn-sm',()=>{S.screen=to;render()}); }
function gap(h=12){ const d=document.createElement('div'); d.style.height=h+'px'; return d; }

// ─── ホーム ──────────────────────────────────────────
function renderHome(){
  const d=el('div','page');
  d.append(el('div','home-logo','🔬'));
  const t=el('div'); t.innerHTML='<h1 class="home-title">中学<span>理科</span>クイズ</h1><p style="text-align:center;color:var(--sub);margin-top:6px">早押しバトル！</p>';
  d.append(t);

  S.account=loadAcc();
  if(S.account){
    const r=getRank(S.account.rp??500);
    const bar=el('button','acc-bar');
    bar.innerHTML=`<span style="font-size:1.6rem">${av(S.account.avatarId)}</span><div style="flex:1"><b>${S.account.name}</b><div style="font-size:.8rem;color:var(--sub)">${r.name} • ${S.account.rp??500} RP</div></div><span style="color:var(--sub);font-size:.8rem">プロフィール ▶</span>`;
    bar.onclick=()=>{S.screen='profile';render();}; d.append(bar);
  } else {
    const row=el('div','',`<div style="display:flex;gap:10px;width:100%">`);
    const r=el('div','');
    r.style.display='flex'; r.style.gap='10px'; r.style.width='100%';
    r.append(btn('ログイン','btn-ghost',()=>{S.screen='login';render();}));
    r.append(btn('アカウント作成','btn-blue',()=>{S.screen='register';render();}));
    d.append(r);
  }

  const bw=el('div','');
  bw.style.cssText='display:flex;flex-direction:column;gap:14px;width:100%;max-width:320px';
  const hb=btn('📋 先生（ホスト）として開始','btn-blue btn-lg',()=>{S.screen='host';S.grade='';S.subject='';S.pendingCh=[];S.diff=1;render();});
  const pb=btn('🎮 生徒（プレイヤー）として参加','btn-green btn-lg',()=>{S.screen='player';render();});
  bw.append(hb,pb); d.append(bw);
  app.append(d);
}

// ─── ログイン ────────────────────────────────────────
function renderLogin(){
  const d=el('div','page');
  d.append(backBtn('home'), el('h2','page-title','ログイン'));
  const card=el('div','card'); card.style.width='100%'; card.style.maxWidth='360px';
  card.innerHTML=`
    <div style="display:flex;flex-direction:column;gap:14px">
      <div><label>名前</label><input id="ln" type="text" placeholder="登録した名前" maxlength="10"></div>
      <div><label>PIN（4桁）</label><input id="lp" type="password" placeholder="0000" inputmode="numeric"></div>
      <div id="lerr" class="err"></div>
    </div>`;
  const lb=btn('ログイン','btn-blue',()=>{
    const name=card.querySelector('#ln').value.trim();
    const pin=card.querySelector('#lp').value;
    if(!name||pin.length!==4){card.querySelector('#lerr').textContent='名前とPIN（4桁）を入力してください';return;}
    const saved=loadAcc();
    if(!saved||saved.name!==name){card.querySelector('#lerr').textContent='このデバイスにアカウントが見つかりません';return;}
    if(saved.pin!==pin){card.querySelector('#lerr').textContent='PINが違います';return;}
    S.account=saved; S.screen='home'; render();
  });
  card.append(lb); d.append(card); app.append(d);
  card.querySelector('#lp').addEventListener('input',e=>{ e.target.value=e.target.value.replace(/\D/g,'').slice(0,4); });
}

// ─── アカウント登録 ──────────────────────────────────
function renderRegister(){
  let selAv=0;
  const d=el('div','page');
  d.append(backBtn('home'), el('h2','page-title','アカウント作成'));
  const card=el('div','card'); card.style.width='100%'; card.style.maxWidth='360px';
  card.innerHTML=`
    <div style="display:flex;flex-direction:column;gap:14px">
      <div><label>名前（1〜10文字）</label><input id="rn" type="text" placeholder="例：山田太郎" maxlength="10"></div>
      <div><label>PIN（4桁）</label><input id="rp" type="password" placeholder="0000" inputmode="numeric"></div>
      <div>
        <label>アバター選択</label>
        <div class="avatar-grid" id="avgrid">${AVATARS.map(a=>`<div class="av-item${a.id===0?' sel':''}" data-id="${a.id}">${a.e}</div>`).join('')}</div>
      </div>
      <div id="rerr" class="err"></div>
    </div>`;
  card.querySelector('#avgrid').addEventListener('click',e=>{
    const item=e.target.closest('.av-item'); if(!item) return;
    selAv=+item.dataset.id;
    card.querySelectorAll('.av-item').forEach(i=>i.classList.toggle('sel',+i.dataset.id===selAv));
  });
  const rb=btn('アカウント作成','btn-blue',()=>{
    const name=card.querySelector('#rn').value.trim();
    const pin=card.querySelector('#rp').value;
    if(!name||name.length>10){card.querySelector('#rerr').textContent='名前は1〜10文字で入力してください';return;}
    if(pin.length!==4){card.querySelector('#rerr').textContent='PINは4桁で入力してください';return;}
    const acc={name,pin,avatarId:selAv,rp:500};
    saveAcc(acc); S.account={...acc,rank:getRank(500)};
    S.screen='home'; render();
  });
  card.append(rb); d.append(card); app.append(d);
  card.querySelector('#rp').addEventListener('input',e=>{ e.target.value=e.target.value.replace(/\D/g,'').slice(0,4); });
}

// ─── プロフィール ────────────────────────────────────
function renderProfile(){
  const acc=S.account||loadAcc(); if(!acc){S.screen='home';render();return;}
  const rp=acc.rp??500, r=getRank(rp), pct=getRankPct(rp);
  const nxt=RANKS[RANKS.indexOf(r)+1];
  const d=el('div','page');
  d.append(backBtn('home'));
  d.innerHTML+=`
    <div style="font-size:5rem">${av(acc.avatarId)}</div>
    <div style="font-size:1.8rem;font-weight:800">${acc.name}</div>
    <div class="rank-badge" style="color:${r.color};border-color:${r.color}">${r.icon} ${r.name}</div>
    <div style="font-size:1.5rem;font-weight:700">${rp} RP</div>
    <div style="width:100%;max-width:320px">
      <div style="display:flex;justify-content:space-between;font-size:.85rem;color:var(--sub);margin-bottom:6px">
        <span>${r.name}</span><span>${nxt?`${nxt.name} まで ${nxt.minRP-rp} RP`:'MAX RANK'}</span>
      </div>
      <div class="rp-bar-bg"><div class="rp-bar-fill" style="width:${pct}%;background:${r.color}"></div></div>
    </div>
    <div style="color:var(--sub);font-size:.9rem">正解: +30RP ／ 不正解: -15RP</div>`;
  d.append(btn('ログアウト','btn-red btn-sm',()=>{localStorage.removeItem(AKEY);S.account=null;S.screen='home';render();}));
  app.append(d);
}

// ═══════════════════════════════════════════════════
//  ホスト
// ═══════════════════════════════════════════════════
function renderHost(){
  if(!S.roomCode) renderHostSetup();
  else if(S.quizPhase==='lobby') renderHostLobby();
  else if(S.quizPhase==='finished') renderHostFinal();
  else renderHostQuiz();
}

function renderHostSetup(){
  const d=el('div','page');
  d.append(backBtn('home'), el('h2','page-title','📋 クイズ設定'));
  // 学年
  const gc=el('div','card'); gc.style.width='100%';
  gc.append(el('div','',`<div style="font-size:.85rem;color:var(--sub);text-transform:uppercase;font-weight:700;margin-bottom:10px">① 学年</div>`));
  const gt=el('div','tabs');
  getGrades().forEach(g=>{
    const t=el('button',`tab${S.grade===g?' on':''}`,g);
    t.onclick=()=>{S.grade=g;S.subject='';S.pendingCh=[];render();};
    gt.append(t);
  }); gc.append(gt); d.append(gc);

  // 教科
  if(S.grade){
    const sc=el('div','card'); sc.style.width='100%';
    sc.append(el('div','',`<div style="font-size:.85rem;color:var(--sub);text-transform:uppercase;font-weight:700;margin-bottom:10px">② 教科</div>`));
    const st=el('div','tabs');
    getSubjects(S.grade).forEach(s=>{
      const t=el('button',`tab${S.subject===s?' on':''}`,s);
      t.onclick=()=>{S.subject=s;render();};
      st.append(t);
    }); sc.append(st); d.append(sc);
  }

  // 章
  if(S.grade&&S.subject){
    const cc=el('div','card'); cc.style.width='100%';
    cc.append(el('div','',`<div style="font-size:.85rem;color:var(--sub);text-transform:uppercase;font-weight:700;margin-bottom:10px">③ 章（複数選択可）</div>`));
    getChapters(S.grade,S.subject).forEach(ch=>{
      const key=`${S.grade}|${S.subject}|${ch}`;
      const isSel=S.pendingCh.some(x=>x.key===key);
      const item=el('div',`ch-item${isSel?' sel':''}`,`<div class="ch-check">${isSel?'✓':''}</div><span style="font-size:.92rem">${ch}</span>`);
      item.onclick=()=>{
        const idx=S.pendingCh.findIndex(x=>x.key===key);
        if(idx>=0) S.pendingCh.splice(idx,1);
        else S.pendingCh.push({key,g:S.grade,s:S.subject,ch});
        render();
      }; cc.append(item);
    });
    if(S.pendingCh.length) cc.append(el('p','',`<p style="font-size:.85rem;color:var(--sub);margin-top:10px">選択中: ${S.pendingCh.length} 章</p>`));
    d.append(cc);
  }

  // 難易度
  if(S.pendingCh.length){
    const dc=el('div','card'); dc.style.width='100%';
    dc.append(el('div','',`<div style="font-size:.85rem;color:var(--sub);text-transform:uppercase;font-weight:700;margin-bottom:10px">④ 難易度</div>`));
    const dt=el('div','tabs');
    [[1,'⭐ 初級'],[2,'⭐⭐ 中級'],[3,'⭐⭐⭐ 上級']].forEach(([v,l])=>{
      const t=el('button',`tab${S.diff===v?' on':''}`,l);
      t.onclick=()=>{S.diff=v;render();}; dt.append(t);
    }); dc.append(dt); d.append(dc);

    const qs=getQuestions(S.pendingCh,S.diff);
    const rc=el('div','card'); rc.style.cssText='width:100%;text-align:center';
    rc.append(el('p','',`<p style="color:var(--sub);margin-bottom:14px">選択問題数: <strong style="color:var(--accent);font-size:1.2rem">${qs.length}</strong> 問</p>`));
    const rb=btn('🚪 ルームを作成する','btn-blue btn-lg',()=>{
      if(qs.length===0){alert('この範囲に問題がありません。');return;}
      S.questions=getQuestions(S.pendingCh,S.diff);
      createRoom();
    }); rb.disabled=qs.length===0;
    rc.append(rb); d.append(rc);
  }
  app.append(d);
}

function createRoom(){
  socket.emit('create-room',{hostName:S.account?.name||'ホスト'});
  socket.once('room-created',({code})=>{
    S.roomCode=code; S.quizPhase='lobby'; S.qIndex=0; S.players=[];
    socket.emit('set-questions',{code,questions:S.questions,settings:{diff:S.diff}});
    socket.once('questions-set',()=>render());
  });
}

function renderHostLobby(){
  const d=el('div','page');
  d.append(el('h2','page-title','⏳ 待機室'));
  d.append(el('div','room-code',S.roomCode));
  const url=window.location.origin;
  d.append(el('div','card',`<p style="font-size:.88rem;color:var(--sub);text-align:center">タブレットでアクセス</p><p style="font-family:monospace;font-size:.9rem;word-break:break-all;text-align:center;margin-top:8px;color:var(--accent)">${url}</p>`));

  const pc=el('div','card'); pc.style.width='100%';
  pc.append(el('div','',`<div style="font-size:.85rem;color:var(--sub);margin-bottom:10px">参加中のプレイヤー (${S.players.length}人)</div>`));
  if(S.players.length===0) pc.append(el('p','',`<p style="color:var(--sub);text-align:center">まだ誰も参加していません</p>`));
  else{ const pl=el('div','player-list'); S.players.forEach(p=>{ pl.append(el('div','pl-card',`<span style="font-size:1.4rem">${av(p.avatarId)}</span> ${p.name}`)); }); pc.append(pl); }
  d.append(pc);
  d.append(el('p','',`<p style="color:var(--sub);font-size:.88rem">問題数: ${S.questions.length}問 ／ 難易度: ${'⭐'.repeat(S.diff)}</p>`));
  const sb=btn('🎯 クイズスタート！','btn-blue btn-lg',()=>{
    socket.emit('start-quiz',{code:S.roomCode});
    S.quizPhase='idle'; S.qIndex=0; render();
  }); sb.disabled=S.players.length===0;
  d.append(sb);
  d.append(btn('ホームに戻る','btn-ghost',()=>{S.roomCode='';S.screen='home';render();}));
  app.append(d);
}

function renderHostQuiz(){
  const d=el('div','page');
  const hdr=el('div','',`<div style="display:flex;justify-content:space-between;align-items:center;width:100%;flex-wrap:wrap;gap:8px"><span style="color:var(--sub);font-size:.9rem">${S.roomCode} ｜ ${S.qIndex+1}/${S.questions.length}問</span></div>`);
  d.append(hdr);
  const pl=el('div','player-list');
  S.players.forEach(p=>{ pl.append(el('div','pl-card',`<span style="font-size:1.3rem">${av(p.avatarId)}</span> ${p.name} <span style="color:var(--green);font-weight:700;margin-left:4px">${p.score??0}正</span>`)); });
  d.append(pl);
  const q=S.questions[S.qIndex];

  if(S.quizPhase==='idle'){
    const ib=btn(`🎬 第${S.qIndex+1}問 カットイン → 表示`,'btn-blue btn-lg',()=>{
      socket.emit('show-cutin',{code:S.roomCode}); S.quizPhase='cutin'; render();
      setTimeout(()=>{ socket.emit('show-question',{code:S.roomCode}); S.quizPhase='question'; S.buzzer=null; S.answerResult=null; render(); },2100);
    }); d.append(ib);
  }

  if(['question','judging','result'].includes(S.quizPhase)&&q){
    const qb=el('div','q-box');
    qb.innerHTML=`<div class="q-num">第${S.qIndex+1}問</div><div class="q-text">${q.question}</div>`;
    const cg=el('div','choices');
    q.choices.forEach((c,i)=>{
      const corr=Array.isArray(q.correct)?q.correct.includes(i):q.correct===i;
      const cls='c-item'+(S.quizPhase==='result'&&corr?' ok':'');
      cg.append(el('div',cls,`<strong>${i+1}.</strong> ${c}`));
    }); qb.append(cg); d.append(qb);
  }

  if(S.quizPhase==='question')
    d.append(el('div','',`<div style="text-align:center;color:var(--sub);padding:20px;font-size:1rem">⚡ 早押し待機中...</div>`));

  if(S.quizPhase==='judging'&&S.buzzer)
    d.append(el('div','buzzer-box',`<span style="font-size:3rem">${av(S.buzzer.avatarId)}</span><div><div style="font-size:.85rem;color:var(--sub)">早押し！</div><div style="font-size:1.4rem;font-weight:800">${S.buzzer.playerName}</div><div style="font-size:.85rem;color:var(--sub);margin-top:4px">回答中...</div></div>`));

  if(S.quizPhase==='result'&&S.answerResult){
    const ok=S.answerResult.correct;
    const rb=el('div',`result-box result-${ok?'ok':'ng'}`);
    rb.innerHTML=`<div class="result-icon">${ok?'⭕':'❌'}</div><div class="result-text">${S.answerResult.playerName}さん：${ok?'正解！':'不正解...'}</div>`;
    if(S.answerResult.explanation) rb.innerHTML+=`<div class="expl">💡 ${S.answerResult.explanation}</div>`;
    d.append(rb);
    const nxtBtn = S.qIndex+1<S.questions.length
      ? btn('次の問題へ →','btn-blue btn-lg',()=>{ socket.emit('next-question',{code:S.roomCode}); })
      : btn('🏁 集計して終了','btn-red btn-lg',()=>{ endQuiz(); });
    d.append(nxtBtn);
  }

  app.append(d);
  // カットイン表示
  if(S.quizPhase==='cutin'){
    const ov=el('div','cutin');
    ov.innerHTML=`<div style="text-align:center"><div style="font-size:1.2rem;color:var(--sub)">第</div><div class="cutin-n">${S.qIndex+1}</div><div style="font-size:2.5rem;font-weight:700;color:var(--text)">問！</div></div>`;
    app.append(ov); playDeden();
  }
}

function endQuiz(){
  socket.emit('end-quiz',{code:S.roomCode});
  socket.once('quiz-finished',({players,rpSummary})=>{
    S.players=players; S.quizPhase='finished'; S.answerResult={rpSummary}; render();
  });
}

function renderHostFinal(){
  const sorted=[...S.players].sort((a,b)=>b.score-a.score);
  const rps=S.answerResult?.rpSummary||[];
  const d=el('div','page');
  d.append(el('h2','page-title','🏆 最終結果'));
  sorted.forEach((p,i)=>{
    const rp=rps.find(r=>r.name===p.name);
    const row=el('div','rank-row');
    const pos=['🥇','🥈','🥉'][i]||`${i+1}`;
    row.innerHTML=`<span style="font-size:1.4rem;min-width:32px">${pos}</span><span style="font-size:1.5rem">${av(p.avatarId)}</span><div style="flex:1"><div style="font-weight:600">${p.name}</div>${rp?`<div style="font-size:.82rem;color:${rp.delta>=0?'var(--green)':'var(--red)'}">${rp.delta>=0?'+':''}${rp.delta} RP${rp.rankChanged?` → ${rp.newRank}`:''}</div>`:''}
    </div><span style="font-size:1.3rem;font-weight:800;color:var(--green)">${p.score}問</span>`;
    d.append(row);
  });
  d.append(btn('ホームに戻る','btn-blue btn-lg',()=>{S.roomCode='';S.quizPhase='idle';S.screen='home';render();}));
  app.append(d);
}

// ═══════════════════════════════════════════════════
//  プレイヤー
// ═══════════════════════════════════════════════════
function renderPlayer(){
  if(!S.joinCode||S.pPhase==='joining') renderPlayerJoin();
  else if(S.pPhase==='lobby') renderPlayerLobby();
  else if(S.pPhase==='finished') renderPlayerFinal();
  else renderPlayerQuiz();
}

function renderPlayerJoin(){
  const d=el('div','page');
  d.append(backBtn('home'), el('h2','page-title','🎮 ルームに参加'));
  const card=el('div','card'); card.style.cssText='width:100%;max-width:360px';
  const acc=loadAcc();
  card.innerHTML=`<div style="display:flex;flex-direction:column;gap:14px">
    <div><label>ルームコード</label><input id="jc" type="text" placeholder="XXXXXX" maxlength="6" style="text-transform:uppercase;font-family:monospace;font-size:1.4rem;letter-spacing:.15em;text-align:center"></div>
    ${!acc?`
    <div><label>名前</label><input id="jn" type="text" placeholder="あなたの名前" maxlength="10"></div>
    <div><label>アバター</label><div class="avatar-grid" id="javgrid">${AVATARS.map(a=>`<div class="av-item${a.id===0?' sel':''}" data-id="${a.id}">${a.e}</div>`).join('')}</div></div>
    `:`<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--surface2);border-radius:8px"><span style="font-size:1.8rem">${av(acc.avatarId)}</span><div><b>${acc.name}</b><div style="font-size:.8rem;color:var(--sub)">${getRank(acc.rp??500).name} • ${acc.rp??500} RP</div></div></div>`}
    <div id="jerr" class="err"></div>
  </div>`;
  let selAv=0;
  if(!acc) card.querySelector('#javgrid')?.addEventListener('click',e=>{
    const item=e.target.closest('.av-item'); if(!item) return;
    selAv=+item.dataset.id;
    card.querySelectorAll('.av-item').forEach(i=>i.classList.toggle('sel',+i.dataset.id===selAv));
  });
  const jb=btn('🎮 参加する','btn-green btn-lg',()=>{
    const code=card.querySelector('#jc').value.toUpperCase().trim();
    const name=acc?acc.name:(card.querySelector('#jn')?.value.trim()||'');
    const ava=acc?acc.avatarId:selAv;
    const rp=acc?acc.rp??500:500;
    if(code.length<4){card.querySelector('#jerr').textContent='ルームコードを入力してください';return;}
    if(!name){card.querySelector('#jerr').textContent='名前を入力してください';return;}
    S.joinCode=code; S.joinName=name; S.joinAvatar=ava;
    socket.emit('join-room',{code,playerName:name,avatarId:ava,rp});
    socket.once('join-result',(res)=>{
      if(res.success){S.players=res.players;S.pPhase='lobby';render();}
      else{card.querySelector('#jerr').textContent=res.error;S.joinCode='';}
    });
  });
  card.append(jb); d.append(card); app.append(d);
  card.querySelector('#jc').addEventListener('input',e=>{ e.target.value=e.target.value.toUpperCase(); });
}

function renderPlayerLobby(){
  const d=el('div','page');
  d.append(el('h2','page-title','⏳ 待機中...'));
  d.append(el('div','spinner'));
  d.append(el('p','',`<p style="color:var(--sub)">先生がクイズを開始するまでお待ちください</p>`));
  const pc=el('div','card'); pc.style.cssText='width:100%;max-width:400px';
  pc.append(el('div','',`<div style="font-size:.85rem;color:var(--sub);margin-bottom:10px">参加者 (${S.players.length}人)</div>`));
  const pl=el('div','player-list');
  S.players.forEach(p=>{ pl.append(el('div','pl-card',`<span style="font-size:1.4rem">${av(p.avatarId)}</span> ${p.name}${p.id===socket.id?' (あなた)':''}`)); });
  pc.append(pl); d.append(pc);
  app.append(d);
}

function renderPlayerQuiz(){
  const d=el('div','page');
  const acc=loadAcc();
  const name=acc?.name||S.joinName;
  // ヘッダー
  const hdr=el('div','');
  hdr.style.cssText='display:flex;justify-content:space-between;align-items:center;width:100%;';
  hdr.innerHTML=`<div style="display:flex;align-items:center;gap:8px"><span style="font-size:1.8rem">${av(acc?.avatarId||S.joinAvatar)}</span><div><b>${name}</b><div style="font-size:.75rem;color:var(--sub)">${getRank(acc?.rp??500).name}</div></div></div><div style="font-size:1.4rem;font-weight:800;color:var(--green)">${S.pMyScore} 正解</div>`;
  d.append(hdr);

  if(!S.pQuestion&&S.pPhase==='wait'){
    d.append(gap(40));
    const wd=el('div',''); wd.style.textAlign='center';
    wd.append(el('div','spinner')); wd.style.display='flex'; wd.style.justifyContent='center'; wd.style.marginBottom='16px';
    d.append(wd);
    d.append(el('p','',`<p style="color:var(--sub);text-align:center">次の問題を待っています...</p>`));
  }

  if(S.pQuestion&&S.pPhase==='buzzable'){
    const qb=el('div','q-box');
    qb.innerHTML=`<div class="q-num">第${S.pQuestion.index+1}問 / ${S.pQuestion.total}問</div><div class="q-text">${S.pQuestion.question}</div>`;
    d.append(qb);
    const bb=el('button','buzz-btn','⚡ 早押し！');
    bb.onclick=()=>{ getACtx(); playBuzz(); socket.emit('buzz-in',{code:S.joinCode}); };
    d.append(bb);
  }

  if(S.pQuestion&&S.pPhase==='buzzed_other'&&S.pBuzzer){
    const qb=el('div','q-box');
    qb.innerHTML=`<div class="q-num">第${S.pQuestion.index+1}問 / ${S.pQuestion.total}問</div><div class="q-text">${S.pQuestion.question}</div>`;
    d.append(qb);
    d.append(el('div','buzzer-box',`<span style="font-size:2.5rem">${av(S.pBuzzer.avatarId)}</span><div><div style="color:var(--sub);font-size:.85rem">早押し！</div><div style="font-size:1.3rem;font-weight:800">${S.pBuzzer.playerName}</div><div style="color:var(--sub);font-size:.85rem;margin-top:4px">回答中...</div></div>`));
  }

  if(S.pQuestion&&S.pPhase==='answering'){
    const qb=el('div','q-box');
    const isMulti=S.pQuestion.multi;
    qb.innerHTML=`<div class="q-num">第${S.pQuestion.index+1}問 ― あなたが回答！</div><div class="q-text">${S.pQuestion.question}</div>${isMulti?'<div style="font-size:.82rem;color:var(--warn);margin-top:6px">※複数選択して「決定」を押してください</div>':''}`;
    d.append(qb);
    if(isMulti){
      // 複数選択モード
      let sel=[];
      S.pQuestion.choices.forEach((c,i)=>{
        const cb=el('button','c-btn');
        cb.innerHTML=`<span class="c-idx" id="cidx${i}">${i+1}</span>${c}`;
        cb.onclick=()=>{
          if(S.pMyAnswer!==null) return;
          const idx=sel.indexOf(i);
          if(idx>=0){ sel.splice(idx,1); cb.style.borderColor=''; cb.style.background=''; }
          else{ sel.push(i); cb.style.borderColor='var(--accent)'; cb.style.background='rgba(88,166,255,.12)'; }
        };
        d.append(cb);
      });
      const sb=btn('✅ 決定','btn-blue',()=>{
        if(S.pMyAnswer!==null||sel.length===0) return;
        S.pMyAnswer=sel.slice();
        socket.emit('submit-answer',{code:S.joinCode,answer:sel.slice().sort()});
        document.querySelectorAll('.c-btn').forEach(b=>b.disabled=true);
        sb.disabled=true;
      });
      d.append(sb);
    } else {
      // 単一選択モード
      S.pQuestion.choices.forEach((c,i)=>{
        const cb=el('button','c-btn');
        cb.innerHTML=`<span class="c-idx">${i+1}</span>${c}`;
        cb.onclick=()=>{
          if(S.pMyAnswer!==null) return;
          S.pMyAnswer=i;
          socket.emit('submit-answer',{code:S.joinCode,answer:i});
          cb.classList.add('ok'); document.querySelectorAll('.c-btn').forEach(b=>b.disabled=true);
        };
        d.append(cb);
      });
    }
  }

  if(S.pPhase==='result'&&S.pAnswerResult){
    const ar=S.pAnswerResult;
    const q=S.pQuestion;
    if(q){
      const qb=el('div','q-box');
      qb.innerHTML=`<div class="q-num">第${q.index+1}問</div><div class="q-text">${q.question}</div>`;
      d.append(qb);
      q.choices.forEach((c,i)=>{
        const corr=Array.isArray(ar.correctAnswer)?ar.correctAnswer.includes(i):ar.correctAnswer===i;
        const cb=el('div','c-btn'+(corr?' ok':''));
        cb.innerHTML=`<span class="c-idx">${i+1}</span>${c}${corr?'<span style="margin-left:auto;color:var(--green);font-weight:700">✓</span>':''}`;
        cb.style.cursor='default'; d.append(cb);
      });
    }
    const isMe=ar.playerId===socket.id;
    if(isMe){
      const rb=el('div',`result-box result-${ar.correct?'ok':'ng'}`);
      rb.innerHTML=`<div class="result-icon">${ar.correct?'⭕':'❌'}</div><div class="result-text">${ar.correct?'正解！':'不正解...'}</div>`;
      if(ar.explanation) rb.innerHTML+=`<div class="expl">💡 ${ar.explanation}</div>`;
      d.append(rb);
    } else {
      d.append(el('div','result-box',`<div class="result-icon">${ar.correct?'⭕':'❌'}</div><div class="result-text">${ar.playerName}さんが${ar.correct?'正解！':'不正解'}</div>${ar.explanation?`<div class="expl">💡 ${ar.explanation}</div>`:''}`));
    }
    d.append(el('p','',`<p style="color:var(--sub);font-size:.88rem;text-align:center;margin-top:8px">先生が次の問題へ進めます</p>`));
  }

  app.append(d);

  // カットインオーバーレイ
  if(S.pCutin){
    const ov=el('div','cutin');
    ov.innerHTML=`<div style="text-align:center"><div style="font-size:1.2rem;color:var(--sub)">第</div><div class="cutin-n">${S.pCutin.questionNumber}</div><div style="font-size:2.5rem;font-weight:700;color:var(--text)">問！</div></div>`;
    app.append(ov); playDeden();
  }
}

function renderPlayerFinal(){
  const fd=S.pFinalData; if(!fd){S.screen='home';render();return;}
  const acc=loadAcc();
  const myName=acc?.name||S.joinName;
  const sorted=[...fd.players].sort((a,b)=>b.score-a.score);
  const myrp=fd.rpSummary?.find(r=>r.name===myName);
  const d=el('div','page');
  d.append(el('h2','page-title','🏆 最終結果'));
  if(myrp){
    const mc=el('div','card'); mc.style.cssText='text-align:center;width:100%;max-width:400px';
    mc.innerHTML=`<p style="color:var(--sub);margin-bottom:8px">あなたの結果</p>
      <p style="font-size:2rem;font-weight:900;color:${myrp.delta>=0?'var(--green)':'var(--red)'}">${myrp.delta>=0?'+':''}${myrp.delta} RP</p>
      <p style="color:var(--sub);font-size:.9rem">${myrp.oldRP} → ${myrp.newRP} RP</p>
      ${myrp.rankChanged?`<p style="color:var(--warn);font-weight:700;margin-top:6px">${myrp.newRank} に${myrp.rankUp?'昇格！🎉':'降格...'}</p>`:''}`;
    d.append(mc);
  }
  sorted.forEach((p,i)=>{
    const isMe=p.name===myName;
    const row=el('div','rank-row'); if(isMe) row.style.cssText='border-color:var(--accent);background:rgba(88,166,255,.08)';
    row.innerHTML=`<span style="font-size:1.4rem;min-width:32px">${['🥇','🥈','🥉'][i]||i+1}</span><span style="font-size:1.5rem">${av(p.avatarId)}</span><div style="flex:1"><b>${p.name}${isMe?' ← あなた':''}</b><div style="font-size:.8rem;color:var(--sub)">正解${p.correct} / 不正解${p.wrong}</div></div><span style="font-size:1.3rem;font-weight:800;color:var(--green)">${p.score}問</span>`;
    d.append(row);
  });
  d.append(btn('ホームに戻る','btn-blue btn-lg',()=>{S.joinCode='';S.pPhase='wait';S.screen='home';render();}));
  app.append(d);
}

// ═══════════════════════════════════════════════════
//  Socket.io イベント
// ═══════════════════════════════════════════════════
socket.on('room-update',({players})=>{
  S.players=players;
  if(S.roomCode&&S.quizPhase==='lobby') renderHostLobby();
  if(S.joinCode&&S.pPhase==='lobby') renderPlayerLobby();
});

socket.on('quiz-started',()=>{
  S.pPhase='wait'; S.pMyScore=0; S.pQuestion=null; S.pCutin=null;
  render();
});

socket.on('cutin',({questionNumber,total})=>{
  S.pCutin={questionNumber,total};
  S.pQuestion=null; S.pBuzzer=null; S.pMyAnswer=null; S.pAnswerResult=null;
  S.pPhase='wait';
  render();
  setTimeout(()=>{ S.pCutin=null; render(); },2100);
});

socket.on('question',(data)=>{
  S.pQuestion=data; S.pBuzzer=null; S.pMyAnswer=null; S.pAnswerResult=null;
  S.pPhase='buzzable'; render();
});

socket.on('buzzed',({playerId,playerName,avatarId})=>{
  // プレイヤー側
  S.pBuzzer={playerId,playerName,avatarId};
  if(playerId===socket.id){ S.pPhase='answering'; }
  else { S.pPhase='buzzed_other'; }
  // ホスト側
  if(S.roomCode){ S.buzzer={playerId,playerName,avatarId}; S.quizPhase='judging'; }
  render();
});

socket.on('answer-result',(data)=>{
  S.pAnswerResult=data; S.pPhase='result';
  if(data.playerId===socket.id){
    if(data.correct){ playOK(); S.pMyScore++; }
    else { playNG(); }
    // RPをlocalStorageに保存（ゲーム終了前の暫定）
  }
  // ホスト側更新
  if(S.roomCode){
    S.answerResult=data; S.quizPhase='result';
    S.players=data.players||S.players;
    if(data.correct) playOK(); else playNG();
  }
  render();
});

socket.on('ready-for-next',({index})=>{
  S.qIndex=index; S.quizPhase='idle'; S.buzzer=null; S.answerResult=null; render();
});

socket.on('no-more-questions',()=>{
  S.quizPhase='end'; render();
});

socket.on('quiz-finished',({players,rpSummary})=>{
  // プレイヤー側
  S.pFinalData={players,rpSummary}; S.pPhase='finished';
  const acc=loadAcc();
  if(acc){
    const mine=rpSummary?.find(r=>r.name===acc.name);
    if(mine){ acc.rp=mine.newRP; saveAcc(acc); }
  }
  // ホスト側
  if(S.roomCode){ S.players=players; S.quizPhase='finished'; S.answerResult={rpSummary}; }
  render();
});

socket.on('host-disconnected',()=>{
  alert('ホストが切断しました');
  S.joinCode=''; S.pPhase='wait'; S.screen='home'; render();
});

// ─── 起動 ────────────────────────────────────────────
render();
