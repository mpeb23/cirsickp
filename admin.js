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
  openPO:[],
  orders:[]
};
let data = loadData();
function loadData(){try{const s=JSON.parse(localStorage.getItem("cirsiFoodData"));return s?{...defaults,...s,prices:{...defaults.prices,...s.prices},images:{...defaults.images,...s.images},openPO:Array.isArray(s.openPO)?s.openPO:[],orders:Array.isArray(s.orders)?s.orders:[]}:structuredClone(defaults)}catch(e){return structuredClone(defaults)}}
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
 updateDashboardStats();
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

function menuOptions(selected=""){
 const menus=["Ayam Ori","Ayam Pedas","Jando","Keju Parut"];
 return '<option value="">-- Pilih Menu --</option>'+menus.map(menu=>`<option value="${menu}" ${menu===selected?"selected":""}>${menu}</option>`).join("");
}
function normalizePOItems(item){
 if(Array.isArray(item.items) && item.items.length) return item.items;
 if(item.menu) return [{menu:item.menu,qty:item.qty||1}];
 return [{menu:"",qty:1}];
}
function poItemRow(menu="",qty=1,index=1,canRemove=false){
 return `<div class="po-order-item">
   <div class="po-order-number">${index}</div>
   <label>Pilih Menu *<select class="po-menu">${menuOptions(menu)}</select></label>
   <label>Jumlah (PCS) *<input class="po-qty" type="number" min="1" value="${esc(qty||1)}"></label>
   ${canRemove?'<button type="button" class="po-remove-item" onclick="this.closest(\'.po-order-item\').remove(); renumberPOItems(this.closest(\'.po-form\'))" title="Hapus menu">🗑</button>':''}
 </div>`;
}
function renderOpenPOEditors(){
 const box=document.getElementById("openPOEditor");
 if(!box) return;
 if(!data.openPO.length){
   box.innerHTML='<div class="empty-po">📋<b>Belum ada pelanggan Open PO</b><small>Klik tombol <b>+ Tambah Open PO</b> untuk menambahkan pelanggan dan item pesanannya.</small></div>';
   updateDashboardStats();
   return;
 }
 box.innerHTML=data.openPO.map((item,i)=>{
   const items=normalizePOItems(item);
   return `<div class="testimonial-form po-form" data-index="${i}">
     <div class="row"><label>👤 Nama Pelanggan<input class="po-name" value="${esc(item.name||'')}" placeholder="Contoh: Budi Santoso"></label></div>
     <div class="po-items-head"><div><b>🛒 Pilih Menu & Jumlah</b><small>Tambahkan semua jenis cireng yang dipesan pelanggan.</small></div><button type="button" class="po-add-item" onclick="addPOItem(${i})">＋ Tambah Item</button></div>
     <div class="po-items">${items.map((x,n)=>poItemRow(x.menu,x.qty,n+1,n>0)).join('')}</div>
     <button class="delete" type="button" onclick="deleteOpenPO(${i})">🗑 Hapus Pelanggan</button>
   </div>`;
 }).join("");
 updateDashboardStats();
}
function addOpenPO(){data.openPO.push({name:"",items:[{menu:"",qty:1}]});renderOpenPOEditors()}
function addPOItem(i){
 const form=document.querySelectorAll('.po-form')[i]; if(!form) return;
 const box=form.querySelector('.po-items');
 const n=box.querySelectorAll('.po-order-item').length+1;
 box.insertAdjacentHTML('beforeend',poItemRow('',1,n,true));
}
function renumberPOItems(form){
 if(!form) return;
 form.querySelectorAll('.po-order-item').forEach((row,n)=>row.querySelector('.po-order-number').textContent=n+1);
}
function deleteOpenPO(i){if(confirm("Hapus pelanggan dari daftar Open PO?")){data.openPO.splice(i,1);renderOpenPOEditors()}}
function saveOpenPO(){
 document.querySelectorAll('.po-form').forEach((el,i)=>{
  const items=[...el.querySelectorAll('.po-order-item')].map(row=>({menu:row.querySelector('.po-menu').value,qty:+row.querySelector('.po-qty').value||1})).filter(x=>x.menu);
  data.openPO[i]={name:el.querySelector('.po-name').value.trim()||"Pelanggan",items:items.length?items:[{menu:"Pesanan Cireng",qty:1}]};
 });
 persist();
 updateDashboardStats();
}


function refreshOrders(){
  data=loadData();
  renderOrders();
  updateOrderCount();
  toast("Data pesanan diperbarui ✓");
}
function updateOrderCount(){
  const count=document.getElementById("orderCount");
  if(count) count.textContent=(Array.isArray(data.orders)?data.orders.length:0);
}
function renderOrders(){
  const box=document.getElementById("ordersEditor");
  if(!box) return;
  const orders=Array.isArray(data.orders)?data.orders:[];
  if(!orders.length){
    box.innerHTML='<div class="empty-orders">🛒<br><b>Belum ada pesanan masuk.</b><br><small>Pesanan akan tercatat setelah tombol Kirim Pesanan via WhatsApp diklik.</small></div>';
    return;
  }
  box.innerHTML=orders.map((o,i)=>{
    const items=(o.orders||[]).map((x,n)=>`<div>${n+1}. <b>${esc(x.menu)}</b> — ${x.qty} pcs • ${rupiah(x.total||0)}</div>`).join("");
    return `<div class="order-card">
      <div class="order-card-head">
        <div><h3>${esc(o.name||"Pelanggan")}</h3><div class="order-id">${esc(o.id||"-")} • ${esc(o.createdAt||"-")}</div></div>
        <span class="order-status">${esc(o.status||"Menunggu Konfirmasi")}</span>
      </div>
      <div class="order-meta">
        <div><b>WhatsApp</b>${esc(o.phone||"-")}</div>
        <div><b>Admin Tujuan</b>${esc(o.admin||"-")}</div>
        <div><b>Alamat</b>${esc(o.address||"-")}</div>
      </div>
      <div class="order-items-list"><strong>🛒 Detail Pesanan</strong>${items}</div>
      <div class="order-total">Total: ${rupiah(o.total||0)}</div>
      ${o.note&&o.note!=="-"?`<div class="order-id">Catatan: ${esc(o.note)}</div>`:""}
      <div class="order-card-actions">
        <button class="order-confirm" onclick="confirmOrder(${i})">✓ Tandai Dikonfirmasi</button>
        <button class="order-remove" onclick="deleteOrder(${i})">🗑 Hapus</button>
      </div>
    </div>`;
  }).join("");
}
function confirmOrder(i){
  if(!data.orders?.[i]) return;
  data.orders[i].status="Dikonfirmasi";
  persist();
  renderOrders(); updateOrderCount();
}
function deleteOrder(i){
  if(confirm("Hapus pesanan ini?")){
    data.orders.splice(i,1);
    persist();
    renderOrders(); updateOrderCount();
  }
}
function clearOrders(){
  if(confirm("Hapus semua pesanan masuk?")){
    data.orders=[];
    persist();
    renderOrders(); updateOrderCount();
  }
}

function updateDashboardStats(){
 const t=document.getElementById("statTestimonials");
 const p=document.getElementById("statOpenPO");
 if(t) t.textContent=(data.testimonials||[]).length;
 if(p) p.textContent=(data.openPO||[]).length;
}

function resetData(){if(confirm("Yakin ingin menghapus semua perubahan?")){localStorage.removeItem("cirsiFoodData");data=loadData();fillForm();toast("Data berhasil direset")}}