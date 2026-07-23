const session=Math.random().toString(16).slice(2,10).toUpperCase();
document.getElementById("session").textContent=session;

const lines=[
  "> initializing secure environment...",
  "> loading network map...",
  "> establishing encrypted tunnel...",
  "> routing through anonymous nodes...",
  "> verifying signal integrity...",
  "> access granted."
];
const bootText=document.getElementById("bootText");
const progress=document.getElementById("progress");
let li=0;
function bootStep(){
  if(li<lines.length){
    bootText.textContent+=(li?"\n":"")+lines[li];
    progress.style.width=((li+1)/lines.length*100)+"%";
    li++;
    setTimeout(bootStep,380);
  }else{
    setTimeout(()=>document.getElementById("boot").classList.add("hidden"),650);
  }
}
bootStep();

const terminalLines=[
  "> connecting to flock network...",
  "> handshake complete",
  "> encryption enabled",
  "> routing through secure nodes",
  "> anonymity confirmed",
  "> welcome to the flock"
];
const typed=document.getElementById("typed");
let ti=0,ci=0;
function typeLoop(){
  if(ti>=terminalLines.length)return;
  const current=terminalLines[ti];
  typed.textContent+=current[ci]||"";
  ci++;
  if(ci>current.length){
    typed.textContent+="\n";
    ti++;ci=0;
    setTimeout(typeLoop,420);
  }else setTimeout(typeLoop,32);
}
setTimeout(typeLoop,2500);

setInterval(()=>{
  const el=document.getElementById("nodeCount");
  const n=parseInt(el.textContent,10);
  el.textContent=n+(Math.random()>.55?1:0);
},4500);

const canvas=document.getElementById("network");
const ctx=canvas.getContext("2d");
let nodes=[];
function resize(){
  canvas.width=innerWidth*devicePixelRatio;
  canvas.height=innerHeight*devicePixelRatio;
  canvas.style.width=innerWidth+"px";
  canvas.style.height=innerHeight+"px";
  ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  nodes=Array.from({length:Math.min(70,Math.floor(innerWidth/18))},()=>({
    x:Math.random()*innerWidth,y:Math.random()*innerHeight,
    vx:(Math.random()-.5)*.18,vy:(Math.random()-.5)*.18
  }));
}
addEventListener("resize",resize);resize();
function draw(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const n of nodes){
    n.x+=n.vx;n.y+=n.vy;
    if(n.x<0||n.x>innerWidth)n.vx*=-1;
    if(n.y<0||n.y>innerHeight)n.vy*=-1;
  }
  for(let i=0;i<nodes.length;i++){
    for(let j=i+1;j<nodes.length;j++){
      const a=nodes[i],b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
      if(d<120){
        ctx.strokeStyle=`rgba(88,255,82,${(1-d/120)*.13})`;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
      }
    }
  }
  for(const n of nodes){
    ctx.fillStyle="rgba(88,255,82,.32)";
    ctx.beginPath();ctx.arc(n.x,n.y,1.4,0,Math.PI*2);ctx.fill();
  }
  requestAnimationFrame(draw);
}
draw();

let audioOn=false,audioCtx;
const soundBtn=document.getElementById("soundBtn");
soundBtn.addEventListener("click",e=>{
  e.stopPropagation();
  audioOn=!audioOn;
  soundBtn.textContent="SOUND: "+(audioOn?"ON":"OFF");
  if(audioOn&&!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();
  beep(520,.07);
});
function beep(freq=440,dur=.06){
  if(!audioOn||!audioCtx)return;
  const o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.type="square";o.frequency.value=freq;g.gain.value=.025;
  o.connect(g);g.connect(audioCtx.destination);o.start();
  g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur);
  o.stop(audioCtx.currentTime+dur);
}
document.getElementById("signalBtn").addEventListener("click",e=>{
  e.stopPropagation();
  beep(720,.08);setTimeout(()=>beep(910,.07),100);
  e.currentTarget.textContent="SIGNAL CONFIRMED";
  setTimeout(()=>e.currentTarget.textContent="PING NETWORK",1100);
});

let taps=0,timer;
const zone=document.getElementById("tapZone");
zone.addEventListener("click",()=>{
  taps++;beep(300+taps*25,.035);
  clearTimeout(timer);
  timer=setTimeout(()=>taps=0,2600);
  if(taps===3)showEgg("egg3");
  if(taps===5)showEgg("egg5");
  if(taps===10){showEgg("egg10");taps=0}
});
function showEgg(id){
  document.getElementById(id).classList.add("show");
  if(navigator.vibrate)navigator.vibrate([70,35,110]);
}
function closeEgg(id){document.getElementById(id).classList.remove("show")}
