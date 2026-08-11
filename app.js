/* ====== APP ====== */
function load(k,f){try{var v=localStorage.getItem(k);return v?JSON.parse(v):f;}catch(e){return f;}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}

/* fecha LOCAL (no UTC) -> evita que se reinicie a media tarde en Florida */
function localDate(){var d=new Date();return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}

let curBlock = load("wp_block","A");
let setState = load("wp_sets_v3",{});   // key: block_day_ex -> [bool]
let altState = load("wp_alts_v1",{});   // key: block_day_ex -> altIndex

/* ---- reinicio automático diario de las series ---- */
(function resetIfNewDay(){
  var today=localDate();
  var last=load("wp_lastday","");
  if(last!==today){
    setState={};
    save("wp_sets_v3",setState);
    save("wp_lastday",today);
  }
})();

const play='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
const swap='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4 3 8l4 4"/><path d="M3 8h13a4 4 0 0 1 4 4"/><path d="m17 20 4-4-4-4"/><path d="M21 16H8a4 4 0 0 1-4-4"/></svg>';
function yt(n){return "https://www.youtube.com/results?search_query="+encodeURIComponent(n+" ejercicio técnica correcta");}
function k(day,i){return curBlock+"_"+day+"_"+i;}
function curAlt(day,i){var idx=altState[k(day,i)]||0; var alts=BLOCKS[curBlock][day].ex[i].alts; return alts[idx%alts.length];}

/* ---- día de hoy -> qué pestaña abrir ---- */
/* getDay(): 0 dom .. 6 sáb */
const DAYMAP={1:"d1",2:"d2",3:"cardio",4:"d3",5:"d4",6:"cardio",0:"semana"};
function todayPanel(){return DAYMAP[new Date().getDay()]||"semana";}

/* ---- render a day ---- */
function renderDay(id){
  const d=BLOCKS[curBlock][id];
  let h=`<div class="day-head"><div class="day-num">${d.title==="Upper A"||d.title==="Upper B"?"Tren superior":"Tren inferior"}</div><div class="day-title">${d.title}</div><div class="day-sub">${d.sub}</div></div>`;
  h+=`<div class="progwrap"><div class="progbar"><i id="pb_${id}"></i></div><span class="progtxt" id="pt_${id}"></span><button class="resetbtn" data-reset="${id}">Reiniciar</button></div>`;
  d.ex.forEach((e,i)=>{
    const a=curAlt(id,i); const n=parseInt(e.sets)||1;
    const st=setState[k(id,i)]||[];
    let dots="";
    for(let s=0;s<n;s++){dots+=`<div class="dot ${st[s]?'on':''}" data-day="${id}" data-ex="${i}" data-s="${s}">${st[s]?'✓':(s+1)}</div>`;}
    const alldone=st.length===n&&st.every(Boolean)&&n>0;
    const cls=e.prio?'prio':(e.core?'core':'');
    const tag=e.prio?'<span class="tag prio">Prioridad</span>':(e.core?'<span class="tag core">Core</span>':'');
    const showSwap=e.alts.length>1;
    h+=`<div class="ex ${cls} ${alldone?'done':''}" id="ex_${id}_${i}">
      <div class="ex-top">
        <div class="ex-main">
          <div class="ex-name" id="nm_${id}_${i}">${a.n}</div>
          <div class="ex-meta"><span class="badge">${e.sets} × ${e.reps}</span>${tag}</div>
        </div>
        <div class="ex-actions">
          <button class="btn" data-gif="${id}" data-exi="${i}">Ver ${play}</button>
          ${showSwap?`<button class="btn" data-swap="${id}" data-exi="${i}">Cambiar ${swap}</button>`:''}
        </div>
      </div>
      <div class="sets">${dots}</div>
    </div>`;
  });
  document.getElementById(id).innerHTML=h;
  updateProg(id);
}
function updateProg(id){
  const d=BLOCKS[curBlock][id]; let total=0,done=0;
  d.ex.forEach((e,i)=>{const n=parseInt(e.sets)||1;total+=n;const st=setState[k(id,i)]||[];done+=st.filter(Boolean).length;});
  const bar=document.getElementById("pb_"+id),txt=document.getElementById("pt_"+id);
  if(bar)bar.style.width=(total?done/total*100:0)+"%";
  if(txt)txt.textContent=done+"/"+total+" series";
}
function renderAllDays(){["d1","d2","d3","d4"].forEach(renderDay);}

/* ---- interactions ---- */
document.addEventListener("click",function(ev){
  const dot=ev.target.closest(".dot");
  if(dot){
    const day=dot.dataset.day,ex=+dot.dataset.ex,s=+dot.dataset.s,key=k(day,ex);
    const n=parseInt(BLOCKS[curBlock][day].ex[ex].sets)||1;
    let arr=setState[key]||new Array(n).fill(false);
    arr[s]=!arr[s];setState[key]=arr;save("wp_sets_v3",setState);
    dot.classList.toggle("on",arr[s]);dot.textContent=arr[s]?'✓':(s+1);
    document.getElementById("ex_"+day+"_"+ex).classList.toggle("done",arr.length===n&&arr.every(Boolean));
    updateProg(day);return;
  }
  const rb=ev.target.closest("[data-reset]");
  if(rb){const id=rb.dataset.reset;BLOCKS[curBlock][id].ex.forEach((e,i)=>{delete setState[k(id,i)];});save("wp_sets_v3",setState);renderDay(id);return;}
  const sw=ev.target.closest("[data-swap]");
  if(sw){
    const day=sw.dataset.swap,i=+sw.dataset.exi,key=k(day,i);
    const alts=BLOCKS[curBlock][day].ex[i].alts;
    altState[key]=((altState[key]||0)+1)%alts.length;save("wp_alts_v1",altState);
    document.getElementById("nm_"+day+"_"+i).textContent=curAlt(day,i).n;return;
  }
  const gf=ev.target.closest("[data-gif]");
  if(gf){openGif(gf.dataset.gif,+gf.dataset.exi);return;}
});

/* ---- block toggle ---- */
function setBlock(b){
  curBlock=b;save("wp_block",b);
  document.querySelectorAll(".blockbar button").forEach(x=>x.classList.toggle("on",x.dataset.block===b));
  renderAllDays();
}

/* ---- GIF preview modal (ExerciseDB + fallback) ---- */
const gifCache={};
async function fetchGif(edb){
  if(gifCache[edb]!==undefined) return gifCache[edb];
  try{
    const r=await fetch(`/api/exercise?name=${encodeURIComponent(edb)}`);
    const data=await r.json();
    const id=(Array.isArray(data)&&data[0]&&data[0].id)?data[0].id:null;
    const url=id?`/api/exercise-image?id=${encodeURIComponent(id)}`:null;
    gifCache[edb]=url;return url;
  }catch(e){gifCache[edb]=null;return null;}
}
async function openGif(day,i){
  const a=curAlt(day,i);
  const m=document.getElementById("modal");
  document.getElementById("mTitle").textContent=a.n;
  document.getElementById("mBody").innerHTML='<div class="spinner"></div>';
  m.classList.add("open");
  const url=await fetchGif(a.e);
  if(url){
    document.getElementById("mBody").innerHTML=`<img src="${url}" alt="${a.n}" onerror="this.parentNode.innerHTML=fallbackHTML('${encodeURIComponent(a.n)}')"><a class="modal-yt" href="${yt(a.n)}" target="_blank" rel="noopener">Ver en video ▶</a>`;
  }else{
    document.getElementById("mBody").innerHTML=fallbackHTML(encodeURIComponent(a.n));
  }
}
function fallbackHTML(encName){
  const name=decodeURIComponent(encName);
  return `<div class="modal-msg">No se encontró el GIF de este ejercicio.<br>Mientras tanto, puedes ver la técnica en video.</div><a class="modal-yt" href="${yt(name)}" target="_blank" rel="noopener">Ver en video ▶</a>`;
}
document.getElementById("mClose").addEventListener("click",()=>document.getElementById("modal").classList.remove("open"));
document.getElementById("modal").addEventListener("click",e=>{if(e.target.id==="modal")e.currentTarget.classList.remove("open");});

/* ====== TIMER DE DESCANSO (sobrevive bloqueo de pantalla) ====== */
/* Cuenta por timestamp: guarda cuándo TERMINA y compara con Date.now().
   Así, aunque el teléfono se bloquee o cambies de app y el JS se congele,
   al volver muestra el tiempo correcto (o "¡Ya!" si ya pasó).
   Wake Lock mantiene la pantalla encendida mientras corre el descanso. */
var rest={endTime:0,remaining:0,running:false,paused:false,tid:null,wake:null,ac:null};
function $(id){return document.getElementById(id);}

function ensureAudio(){
  try{
    if(!rest.ac){var AC=window.AudioContext||window.webkitAudioContext; if(AC) rest.ac=new AC();}
    if(rest.ac&&rest.ac.state==="suspended") rest.ac.resume();
  }catch(e){}
}
function beep(){
  try{
    ensureAudio(); var ac=rest.ac; if(!ac)return; var t=ac.currentTime;
    [0,0.20,0.40].forEach(function(off){
      var o=ac.createOscillator(),g=ac.createGain();
      o.type="sine"; o.frequency.value=880;
      o.connect(g); g.connect(ac.destination);
      g.gain.setValueAtTime(0.0001,t+off);
      g.gain.exponentialRampToValueAtTime(0.45,t+off+0.02);
      g.gain.exponentialRampToValueAtTime(0.0001,t+off+0.18);
      o.start(t+off); o.stop(t+off+0.19);
    });
  }catch(e){}
}
async function wakeOn(){ try{ if("wakeLock" in navigator && !rest.wake){ rest.wake=await navigator.wakeLock.request("screen"); rest.wake.addEventListener("release",function(){rest.wake=null;}); } }catch(e){} }
function wakeOff(){ try{ if(rest.wake){ rest.wake.release(); rest.wake=null; } }catch(e){} }
function fmt(s){ s=Math.max(0,Math.ceil(s)); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); }

function restStart(sec){
  ensureAudio();                 // el toque del usuario desbloquea el audio en iOS
  rest.running=true; rest.paused=false;
  rest.endTime=Date.now()+sec*1000;
  $("restIdle").hidden=true; $("restRun").hidden=false;
  $("restToggle").textContent="Pausa";
  $("restBar").classList.remove("done");
  wakeOn(); restTick();
}
function restTick(){
  if(!rest.running) return;
  var rem=(rest.endTime-Date.now())/1000;
  $("restTime").textContent=fmt(rem);
  $("restBar").classList.toggle("warn", rem<=5 && rem>0);
  if(rem<=0){ restDone(); return; }
  rest.tid=setTimeout(restTick,200);
}
function restDone(){
  rest.running=false;
  if(rest.tid) clearTimeout(rest.tid);
  $("restTime").textContent="¡Ya!";
  $("restBar").classList.remove("warn"); $("restBar").classList.add("done");
  beep(); try{ if(navigator.vibrate) navigator.vibrate([220,120,220]); }catch(e){}
  wakeOff();
  setTimeout(restReset,1600);
}
function restReset(){
  rest.running=false; rest.paused=false;
  if(rest.tid) clearTimeout(rest.tid);
  $("restRun").hidden=true; $("restIdle").hidden=false;
  $("restBar").classList.remove("warn","done");
  wakeOff();
}
function restToggle(){
  if(rest.paused){
    rest.paused=false; rest.running=true;
    rest.endTime=Date.now()+rest.remaining*1000;
    $("restToggle").textContent="Pausa";
    wakeOn(); restTick();
  }else if(rest.running){
    rest.paused=true; rest.running=false;
    rest.remaining=(rest.endTime-Date.now())/1000;
    if(rest.tid) clearTimeout(rest.tid);
    $("restToggle").textContent="Seguir";
    wakeOff();
  }
}
document.querySelectorAll(".rest-preset").forEach(function(b){ b.addEventListener("click",function(){ restStart(+b.dataset.sec); }); });
$("restAdd").addEventListener("click",function(){ if(rest.running){ rest.endTime+=30000; } else if(rest.paused){ rest.remaining+=30; $("restTime").textContent=fmt(rest.remaining); } });
$("restToggle").addEventListener("click",restToggle);
$("restStop").addEventListener("click",restReset);
/* al volver de segundo plano: recalcula y re-adquiere el wake lock (se suelta solo al salir) */
document.addEventListener("visibilitychange",function(){
  if(!document.hidden && rest.running){ wakeOn(); restTick(); }
});
/* mostrar la barra de descanso solo en los días de entrenamiento */
function updateRestBar(pid){
  var show=(pid==="d1"||pid==="d2"||pid==="d3"||pid==="d4");
  $("restBar").hidden=!show;
  document.body.classList.toggle("has-rest",show);
}

/* ---- week grid (marca la fila de HOY) ---- */
var todayRow=(new Date().getDay()+6)%7; // 0=Lun..6=Dom
document.getElementById("weekGrid").innerHTML=WEEK.map(function(r,idx){
  return `<div class="wrow ${r[2]?'':'rest'} ${idx===todayRow?'today':''}"><span class="d">${r[0]}${idx===todayRow?' <em>hoy</em>':''}</span><span class="w">${r[1]}</span></div>`;
}).join("");

/* ---- nutrition ---- */
function todayKey(){return "wp_food_"+localDate();}
let log=load(todayKey(),[]);
document.getElementById("foodBtns").innerHTML=FOODS.map((f,i)=>`<button class="food" data-f="${i}"><div class="fn">${f.n}</div><div class="fm">${f.p}g · ${f.c} cal</div></button>`).join("");
function renderLog(){
  const el=document.getElementById("logged");
  el.innerHTML=log.length?log.map((it,i)=>`<div class="logitem"><span>${it.n}</span><span><span class="lm">${it.p}g · ${it.c}cal</span> <span class="x" data-del="${i}">×</span></span></div>`).join(""):'<div class="empty">Nada registrado hoy todavía.</div>';
  const tp=log.reduce((a,b)=>a+(+b.p||0),0),tc=log.reduce((a,b)=>a+(+b.c||0),0);
  document.getElementById("pVal").innerHTML=tp+'<small> / '+CONFIG.PRO_TARGET+' g</small>';
  document.getElementById("cVal").innerHTML=tc+'<small> / '+CONFIG.CAL_TARGET+'</small>';
  document.getElementById("pBar").style.width=Math.min(100,tp/CONFIG.PRO_TARGET*100)+"%";
  document.getElementById("cBar").style.width=Math.min(100,tc/CONFIG.CAL_TARGET*100)+"%";
}
document.getElementById("comida").addEventListener("click",function(ev){
  const fb=ev.target.closest(".food");
  if(fb){const f=FOODS[+fb.dataset.f];log.push({n:f.n,p:f.p,c:f.c});save(todayKey(),log);renderLog();return;}
  const del=ev.target.closest("[data-del]");
  if(del){log.splice(+del.dataset.del,1);save(todayKey(),log);renderLog();}
});
document.getElementById("mAdd").addEventListener("click",function(){
  const name=document.getElementById("mName").value.trim()||"Alimento";
  const p=+document.getElementById("mPro").value||0,c=+document.getElementById("mCal").value||0;
  if(!p&&!c)return;
  log.push({n:name,p:p,c:c});save(todayKey(),log);renderLog();
  document.getElementById("mName").value="";document.getElementById("mPro").value="";document.getElementById("mCal").value="";
});

/* ---- tabs ---- */
const tabs=document.querySelectorAll('.tab');
function activate(pid){
  tabs.forEach(x=>x.setAttribute('aria-selected', x.dataset.p===pid?'true':'false'));
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('active',p.id===pid));
  updateRestBar(pid);
}
tabs.forEach(t=>t.addEventListener('click',()=>{
  activate(t.dataset.p);
  window.scrollTo({top:0,behavior:'smooth'});
}));
document.querySelectorAll(".blockbar button").forEach(b=>b.addEventListener("click",()=>setBlock(b.dataset.block)));

/* marca visualmente la pestaña de HOY con un puntito */
(function markTodayTab(){
  var pid=todayPanel();
  tabs.forEach(function(t){ if(t.dataset.p===pid) t.classList.add("today"); });
})();

/* ---- init ---- */
setBlock(curBlock);
renderLog();
activate(todayPanel());   // abre automáticamente el día de hoy
