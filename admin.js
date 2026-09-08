const defaults = {
  username:"admin", password:"@Raiyan17",
  whatsapp:"6281295524785", location:"Perum SGC 3 Blok A No. 21",
  prices:{ayamOri:3000,ayamPedas:3000,jando:3000,keju:3000},
  images:{hero:"assets/menu-cireng.jpeg",ayamOri:"assets/menu-cireng.jpeg",ayamPedas:"assets/menu-cireng.jpeg",jando:"assets/menu-cireng.jpeg",keju:"assets/menu-cireng.jpeg"},
  testimonials:[
    {name:"Siti A.",role:"Pelanggan",text:"Enak banget! Kulit cirengnya kenyal dan isiannya banyak. Bakal order lagi 😍",rating:5},
    {name:"Rina P.",role:"Pelanggan",text:"Ayam pedasnya mantap, pedasnya pas dan bikin nagih. Anak-anak juga suka!",rating:5},
    {name:"Dewi K.",role:"Pelanggan",text:"Harga terjangkau tapi rasanya tidak murahan. Jando favorit keluarga!",rating:5}
  ],
  openPO:[]
};
let data = loadData();
function loadData(){try{const s=JSON.parse(localStorage.getItem("cirsiFoodData"));return s?{...defaults,...s,prices:{...defaults.prices,...s.prices},images:{...defaults.images,...s.images},openPO:Array.isArray(s.openPO)?s.openPO:[]}:structuredClone(defaults)}catch(e){return structuredClone(defaults)}}
function persist(){localStorage.setItem("cirsiFoodData",JSON.stringify(data));toast("Berhasil disimpan ✓")}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)}

function logged(){return sessionStorage.getItem("cirsiAdmin")==="true"}
function showDashboard(){document.getElementById("loginPage").classList.add("hidden");document.getElementById("dashboard").classList.remove("hidden");fillForm()}
if(logged()) showDashboard();

document.getElementById("loginForm").addEventListener("submit",e=>{
 e.preventDefault();
 if(document.getElementById("username").value===data.username && document.getElementById("password").value===data.password){sessionStorage.setItem("cirsiAdmin","true");showDashboard();}
 else alert("Username atau password salah!");
});
document.getElementById("logout").onclick=()=>{sessionStorage.removeItem("cirsiAdmin");location.reload()};

function fillForm(){
 document.getElementById("whatsapp").value=data.whatsapp;
 document.getElementById("location").value=data.location;
 document.getElementById("priceAyamOri").value=data.prices.ayamOri;
 document.getElementById("priceAyamPedas").value=data.prices.ayamPedas;
 document.getElementById("priceJando").value=data.prices.jando;
 document.getElementById("priceKeju").value=data.prices.keju;
 ["hero","ayamOri","ayamPedas","jando","keju"].forEach(k=>{
   const id="preview"+k.charAt(0).toUpperCase()+k.slice(1);
   document.getElementById(id).src=data.images[k];
 });
 renderEditors();
 renderOpenPOEditors();
}
function saveGeneral(){data.whatsapp=document.getElementById("whatsapp").value.trim();data.location=document.getElementById("location").value.trim();persist()}
function savePrices(){data.prices.ayamOri=+document.getElementById("priceAyamOri").value;data.prices.ayamPedas=+document.getElementById("priceAyamPedas").value;data.prices.jando=+document.getElementById("priceJando").value;data.prices.keju=+document.getElementById("priceKeju").value;persist()}
function uploadImage(e,key){
 const f=e.target.files[0];if(!f)return;
 const reader=new FileReader();reader.onload=()=>{data.images[key]=reader.result;const id="preview"+key.charAt(0).toUpperCase()+key.slice(1);document.getElementById(id).src=reader.result};reader.readAsDataURL(f);
}
function savePhotos(){persist()}
function renderEditors(){
 const box=document.getElementById("testimonialEditor");
 box.innerHTML=data.testimonials.map((t,i)=>`<div class="testimonial-form" data-index="${i}">
 <div class="row"><label>Nama<input class="t-name" value="${esc(t.name)}"></label><label>Status<input class="t-role" value="${esc(t.role||'Pelanggan')}"></label><label>Rating<input class="t-rating" type="number" min="1" max="5" value="${t.rating||5}"></label></div>
 <label>Testimoni<textarea class="t-text">${esc(t.text)}</textarea></label>
 <button class="delete" onclick="deleteTestimonial(${i})">🗑 Hapus</button></div>`).join("");
}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function addTestimonial(){data.testimonials.push({name:"Pelanggan Baru",role:"Pelanggan",text:"Tulis testimoni di sini...",rating:5});renderEditors()}
function deleteTestimonial(i){if(confirm("Hapus testimoni ini?")){data.testimonials.splice(i,1);renderEditors()}}
function saveTestimonials(){
 document.querySelectorAll(".testimonial-form").forEach((el,i)=>{
  data.testimonials[i]={name:el.querySelector(".t-name").value,role:el.querySelector(".t-role").value,text:el.querySelector(".t-text").value,rating:+el.querySelector(".t-rating").value||5};
 });persist()
}

function renderOpenPOEditors(){
 const box=document.getElementById("openPOEditor");
 if(!box) return;
 box.innerHTML=data.openPO.map((item,i)=>`<div class="testimonial-form po-form" data-index="${i}">
 <div class="row">
   <label>Nama Pelanggan<input class="po-name" value="${esc(item.name||'')}"></label>
   <label>Menu / Pesanan<input class="po-menu" value="${esc(item.menu||'')}"></label>
   <label>Jumlah<input class="po-qty" type="number" min="1" value="${esc(item.qty||1)}"></label>
 </div>
 <button class="delete" onclick="deleteOpenPO(${i})">🗑 Hapus</button>
 </div>`).join("") || '<p class="hint">Belum ada daftar Open PO.</p>';
}
function addOpenPO(){
 data.openPO.push({name:"Pelanggan Baru",menu:"Cireng Isi",qty:1});
 renderOpenPOEditors();
}
function deleteOpenPO(i){
 if(confirm("Hapus pelanggan dari daftar Open PO?")){
  data.openPO.splice(i,1);
  renderOpenPOEditors();
 }
}
function saveOpenPO(){
 document.querySelectorAll(".po-form").forEach((el,i)=>{
  data.openPO[i]={
   name:el.querySelector(".po-name").value.trim() || "Pelanggan",
   menu:el.querySelector(".po-menu").value.trim() || "Cireng Isi",
   qty:+el.querySelector(".po-qty").value || 1
  };
 });
 persist();
}

function resetData(){if(confirm("Yakin ingin menghapus semua perubahan?")){localStorage.removeItem("cirsiFoodData");data=loadData();fillForm();toast("Data berhasil direset")}}