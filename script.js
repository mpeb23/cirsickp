import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app=initializeApp(firebaseConfig);
const db=getFirestore(app);
let orders=[];

const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
function render(){
 const term=document.getElementById("searchInput").value.toLowerCase();
 const data=orders.filter(o=>(o.name||"").toLowerCase().includes(term));
 document.getElementById("totalCustomers").textContent=orders.length;
 document.getElementById("totalQty").textContent=orders.reduce((a,o)=>a+Number(o.quantity||0),0);
 document.getElementById("totalProcessing").textContent=orders.filter(o=>o.status==="Diproses").length;
 document.getElementById("orderList").innerHTML=data.length?data.map((o,i)=>`<tr><td>${i+1}</td><td><b>${esc(o.name)}</b></td><td>${esc(o.menu)}</td><td>${esc(o.quantity)} PCS</td><td><span class="badge ${esc(o.status)}">${esc(o.status)}</span></td></tr>`).join(""):`<tr><td colspan="5" class="empty">Belum ada pesanan.</td></tr>`;
}
document.getElementById("searchInput").addEventListener("input",render);
onSnapshot(query(collection(db,"orders"),orderBy("createdAt","desc")),(snap)=>{orders=snap.docs.map(d=>({id:d.id,...d.data()}));render();},err=>{document.getElementById("orderList").innerHTML=`<tr><td colspan="5" class="empty">Gagal memuat data. Periksa konfigurasi Firebase.</td></tr>`;console.error(err);});