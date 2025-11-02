// -----------------------------

// ตัวแปรผู้เล่น

// -----------------------------

let playerName = "";

while(!playerName){

  playerName = prompt("กรุณากรอกชื่อผู้เล่น:","ผู้กล้า");

  if(!playerName) alert("ต้องกรอกชื่อก่อนเริ่มเกม!");

}

const state={gold:60,hp:100,maxhp:100,bossStage:1,bossHP:0,bossMax:0,buffs:{sword:0},inFight:false,log:[],timeStart:0};

const goldEl=document.getElementById('gold'),

      hpHeroBar=document.getElementById('hpHeroBar'),

      hpHeroText=document.getElementById('hpHeroText'),

      hpBossBar=document.getElementById('hpBossBar'),

      hpBossText=document.getElementById('hpBossText'),

      buffsEl=document.getElementById('buffs'),

      bossStageEl=document.getElementById('bossStage'),

      logEl=document.getElementById('log'),

      qPanel=document.getElementById('questionPanel'),

      qText=document.getElementById('qText'),

      qChoices=document.getElementById('qChoices'),

      c=document.getElementById('c'),

      ctx=c.getContext('2d'),

      leaderboardEl=document.getElementById('leaderboard');

// -----------------------------

// Firebase Config

// -----------------------------

const firebaseConfig = {

  apiKey: "YOUR_API_KEY",

  authDomain: "YOUR_PROJECT.firebaseapp.com",

  databaseURL: "https://YOUR_PROJECT-default-rtdb.asia-southeast1.firebasedatabase.app",

  projectId: "YOUR_PROJECT",

  storageBucket: "YOUR_PROJECT.appspot.com",

  messagingSenderId: "YOUR_ID",

  appId: "YOUR_APP_ID"

};

const app = firebase.initializeApp(firebaseConfig);

const db = firebase.database();

// -----------------------------

// ฟังก์ชัน Leaderboard ออนไลน์

// -----------------------------

function saveScore(name, time){

  db.ref("leaderboard").push({name, time});

}

function loadLeaderboard(){

  db.ref("leaderboard").once("value").then(snapshot=>{

    const data = snapshot.val();

    let html = '';

    if(data){

      const arr = Object.values(data).sort((a,b)=>a.time-b.time);

      arr.forEach((p,i)=>{

        html += `${i+1}. ${p.name} - ${p.time}s<br>`;

      });

    }else{

      html = '-';

    }

    leaderboardEl.innerHTML = html;

  });

}

// -----------------------------

// ฟังก์ชันเกม

// -----------------------------

function addLog(t){state.log.unshift(t);if(state.log.length>50)state.log.pop();renderLog();}

function renderLog(){logEl.innerHTML = state.log.map(s=>'<div>'+s+'</div>').join('');}

function victory(){

  addLog('Victory! 🎆');

  document.getElementById('victory').style.display='flex';

  state.inFight=false;

  const elapsed = Math.round((Date.now() - state.timeStart)/1000);

  // ส่งออนไลน์

  saveScore(playerName, elapsed);

  loadLeaderboard();

  setTimeout(()=>{document.getElementById('victory').style.display='none';},2000);

}

// -----------------------------

// ปุ่มเริ่มและยอมแพ้

// -----------------------------

document.getElementById('startFight').onclick=()=>{

  if(!state.inFight){

    state.inFight=true;

    state.bossMax=500;

    state.bossHP=state.bossMax;

    state.timeStart=Date.now();

    addLog('บอสปรากฏแล้ว! ต่อสู้ให้ชนะ!');

  }

};

document.getElementById('endFight').onclick=()=>{

  if(state.inFight){state