import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

// Firebase config ของคุณ
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// log function
function log(msg){
  document.getElementById('adminLog').innerHTML += msg + "<br>";
}

// เพิ่มทองผู้เล่น
window.addGold = async function(){
  const player = document.getElementById('adminPlayer').value;
  const gold = parseInt(document.getElementById('adminGold').value);
  if(!player || !gold){ log("กรอกข้อมูลให้ครบ"); return; }

  const playerRef = ref(db, 'players/' + player);
  const snapshot = await get(playerRef);
  let currentGold = snapshot.exists() ? snapshot.val().gold : 0;
  await set(playerRef, { gold: currentGold + gold });
  log(`เพิ่ม ${gold} ทอง ให้ผู้เล่น ${player}`);
}

// รีเซ็ตบอส
window.resetBoss = async function(){
  await set(ref(db,'boss'), { hp:100, stage:1 });
  log("รีเซ็ตบอสเรียบร้อย!");
}

// รีอันดับ leaderboard
window.resetLeaderboard = async function(){
  await set(ref(db,'leaderboard'), {});
  log("รีอันดับ leaderboard เรียบร้อย!");
}

// Test log
console.log("Admin JS loaded");
