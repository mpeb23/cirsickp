import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { firebaseConfig } from "./firebase-config.js";

const app=initializeApp(firebaseConfig), db=getFirestore(app), auth=getAuth(app);
let orders=[];
const $=id=>document.getElementById(id);
const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

function render(){
 const term=$("adminSearch").value.toLowerCase();
 const data=orders.filter(o=>[o.name,o.menu,o.phone].join(" ").toLowerCase().includes(term));
 $("adminCustomers").textContent=orders.length;
 $("adminQty").textContent=orders.reduce((a,o)=>a+Number(o.quantity||0),0);
 $("adminWaiting").textContent=orders.filter(o=>o.status==="Menunggu").length;
 $("adminOrderList").innerHTML=data.length?data.map(o=>`<tr><td><b>${esc(o.name)}</b></td><td>${esc(o.phone)}</td><td>${esc(o.menu)}</td><td>${esc(o.quantity)} PCS</td><td><span class="badge ${esc(o.status)}">${esc(o.status)}</span></td><td>${esc(o.note||"-")}</td><td><button class="btn secondary edit" data-id="${o.id}">Edit</button> <button class="btn danger del" data-id="${o.id}">Hapus</button></td></tr>`).join(""):`<tr><td colspan="7" class="empty">Belum ada data.</td></tr>`;
 document.querySelectorAll(".edit").forEach(b=>b.onclick=()=>editOrder(b.dataset.id));
 document.querySelectorAll(".del").forEach(b=>b.onclick=()=>removeOrder(b.dataset.id));
}
$("adminSearch").addEventListener("input",render);

function editOrder(id){
 const o=orders.find(x=>x.id===id); if(!o)return;
 $("orderId").value=id;$("name").value=o.name||"";$("phone").value=o.phone||"";$("menu").value=o.menu||"";$("quantity").value=o.quantity||1;$("status").value=o.status||"Menunggu";$("note").value=o.note||"";
 $("formTitle").textContent="Edit Pesanan";$("cancelEdit").hidden=false;window.scrollTo({top:0,behavior:"smooth"});
}
async function removeOrder(id){if(confirm("Hapus pesanan ini?")) await deleteDoc(doc(db,"orders",id));}
$("cancelEdit").onclick=()=>{$("orderForm").reset();$("orderId").value="";$("formTitle").textContent="Tambah Pesanan";$("cancelEdit").hidden=true;};

$("orderForm").addEventListener("submit",async e=>{
 e.preventDefault(); const id=$("orderId").value;
 const data={name:$("name").value.trim(),phone:$("phone").value.trim(),menu:$("menu").value,quantity:Number($("quantity").value),status:$("status").value,note:$("note").value.trim()};
 try{
  if(id) await updateDoc(doc(db,"orders",id),data);
  else await addDoc(collection(db,"orders"),{...data,createdAt:serverTimestamp()});
  $("formMessage").textContent="✓ Pesanan berhasil disimpan."; $("orderForm").reset();$("orderId").value="";$("formTitle").textContent="Tambah Pesanan";$("cancelEdit").hidden=true;
 }catch(err){$("formMessage").textContent="Gagal menyimpan: "+err.message;}
});

$("loginForm").addEventListener("submit",async e=>{e.preventDefault();try{await signInWithEmailAndPassword(auth,$("email").value,$("password").value);$("loginMessage").textContent="";}catch(err){$("loginMessage").textContent="Login gagal: "+err.message;}});
$("logoutBtn").onclick=()=>signOut(auth);

onAuthStateChanged(auth,user=>{
 $("loginSection").hidden=!!user;$("adminSection").hidden=!user;$("logoutBtn").style.display=user?"inline-block":"none";
 if(user) onSnapshot(query(collection(db,"orders"),orderBy("createdAt","desc")),snap=>{orders=snap.docs.map(d=>({id:d.id,...d.data()}));render();},err=>console.error(err));
});