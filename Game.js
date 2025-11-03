import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, set, get, update } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "AIzaSyC4a9DrCeSN_HQFIHXWJhnzN4Jn376CdIc",
  authDomain: "hero-4ebbe.firebaseapp.com",
  databaseURL: "https://hero-4ebbe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hero-4ebbe",
  storageBucket: "hero-4ebbe.firebasestorage.app",
  messagingSenderId: "868857385644",
  appId: "1:868857385644:web:d5366bee7f5d7b11e60509",
  measurementId: "G-2DE96HJN7Z"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ===== ตัวแปรเกม =====
let playerName = "";
let gold = 0;
let hp = 100;
const maxHp = 100;
const bossRef = ref(db, 'boss');
const logDiv = document.getElementById('log');

// ===== ฟังก์ชัน log =====
function log(msg){
  logDiv.innerHTML += msg + "<br>";
  logDiv.scrollTop = logDiv.scrollHeight;
}

// ===== ระบบล็อกอิน =====
window.login = async function(){
  const input = document.getElementById('playerNameInput').value.trim();
  if(!input){ document.getElementById('loginMsg').innerText="กรุณากรอกชื่อ!"; return; }
  playerName = input;

  const playerRef = ref(db, 'players/' + playerName);
  const snapshot = await get(playerRef);
  if(!snapshot.exists()){
    // สมัครผู้เล่นใหม่
    await set(playerRef, { gold: 50, hp: maxHp });
  }

  // โหลดข้อมูลผู้เล่น
  const data = await get(playerRef);
  gold = data.val().gold || 50;
  hp = data.val().hp || maxHp;

  // แสดงหน้าเกม
  document.getElementById('loginScreen').style.display='none';
  document.getElementById('gameScreen').style.display='flex';
  document.getElementById('playerNameDisplay').innerText = playerName;
  document.getElementById('goldDisplay').innerText = gold;
  document.getElementById('hpDisplay').innerText = hp;

  log("เข้าสู่เกมเรียบร้อย!");
}

// ===== ต่อสู้บอส =====
window.fightBoss = async function(){
  // โหลดบอสจาก DB
  let bossSnap = await get(bossRef);
  let bossHp = bossSnap.exists() ? bossSnap.val().hp : 100;

  const damage = Math.floor(Math.random()*20)+5;
  bossHp -= damage;
  if(bossHp<0) bossHp=0;

  // ลด HP ผู้เล่นแบบสุ่ม
  const damageToPlayer = Math.floor(Math.random()*10)+1;
  hp -= damageToPlayer;
  if(hp<0) hp=0;

  log(`โจมตีบอส ${damage} dmg | ตัวเองเสีย HP ${damageToPlayer}`);
  document.getElementById('hpDisplay').innerText = hp;

  // อัปเดตบอส
  await set(bossRef, { hp: bossHp });

  // อัปเดตผู้เล่น
  await update(ref(db, 'players/' + playerName), { gold, hp });

  if(bossHp<=0) log("บอสถูกทำลายแล้ว!");
  if(hp<=0) log("คุณพ่ายแพ้! HP 0");
}
