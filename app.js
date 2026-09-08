const defaults = {
  whatsapp: "6281295524785",
  location: "Perum SGC 3 Blok A No. 21",
  prices: { ayamOri: 3000, ayamPedas: 3000, jando: 3000, keju: 3000 },
  images: {
    hero: "assets/menu-cireng.jpeg",
    ayamOri: "assets/menu-cireng.jpeg",
    ayamPedas: "assets/menu-cireng.jpeg",
    jando: "assets/menu-cireng.jpeg",
    keju: "assets/menu-cireng.jpeg"
  },
  testimonials: [
    {name:"Siti A.", role:"Pelanggan", text:"Enak banget! Kulit cirengnya kenyal dan isiannya banyak. Bakal order lagi 😍", rating:5},
    {name:"Rina P.", role:"Pelanggan", text:"Ayam pedasnya mantap, pedasnya pas dan bikin nagih. Anak-anak juga suka!", rating:5},
    {name:"Dewi K.", role:"Pelanggan", text:"Harga terjangkau tapi rasanya tidak murahan. Jando favorit keluarga!", rating:5}
  ],
  openPO: [],
  orders: []
};

function getData(){
  try{
    const saved = JSON.parse(localStorage.getItem("cirsiFoodData"));
    return saved ? {...defaults, ...saved, prices:{...defaults.prices,...saved.prices}, images:{...defaults.images,...saved.images}, testimonials:Array.isArray(saved.testimonials)?saved.testimonials:defaults.testimonials, openPO:Array.isArray(saved.openPO)?saved.openPO:[], orders:Array.isArray(saved.orders)?saved.orders:[]} : defaults;
  }catch(e){ return defaults; }
}
function rupiah(n){ return "Rp " + Number(n).toLocaleString("id-ID"); }
const data = getData();

function saveWebsiteData(){
  localStorage.setItem("cirsiFoodData", JSON.stringify(data));
}

document.querySelectorAll("[data-price]").forEach(el => {
  el.textContent = rupiah(data.prices[el.dataset.price]);
});
function setImage(id, src){
  const el = document.getElementById(id);
  if(el && src) el.src = src;
}
setImage("heroImage", data.images.hero);
setImage("aboutImage", data.images.hero);
setImage("imgAyamOri", data.images.ayamOri);
setImage("imgAyamPedas", data.images.ayamPedas);
setImage("imgJando", data.images.jando);
setImage("imgKeju", data.images.keju);

const locationText = document.getElementById("locationText");
if(locationText) locationText.textContent = data.location;

function waLink(message){
  return `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`;
}
const generalMessage = "Halo CIRSI FOOD, saya ingin pesan cireng isi 😊";

// Gunakan pengecekan elemen agar JavaScript tidak berhenti jika tombol tertentu tidak ada.
const waButton = document.getElementById("waButton");
if(waButton) waButton.href = waLink(generalMessage);

const floatingWa = document.getElementById("floatingWa");
if(floatingWa) floatingWa.href = waLink(generalMessage);
function orderMenu(menu){
  const select = document.getElementById("orderMenuSelect");
  const customWrap = document.getElementById("customMenuWrap");
  const customInput = document.getElementById("customMenu");
  if(select) select.value = menu;
  if(customWrap) customWrap.style.display = "none";
  if(customInput) {
    customInput.required = false;
    customInput.value = "";
  }
  const orderSection = document.getElementById("order");
  if(orderSection) orderSection.scrollIntoView({behavior:"smooth", block:"start"});
}

function renderTestimonials(){
  const box = document.getElementById("testimonialList");
  if(!box) return;
  box.innerHTML = data.testimonials.map((t,i)=>`
    <article class="testimonial reveal show">
      <div class="stars">${"★".repeat(Math.min(5,Math.max(1,Number(t.rating)||5)))}</div>
      <p>"${escapeHtml(t.text)}"</p>
      <div class="person"><div class="avatar">${escapeHtml(t.name.charAt(0).toUpperCase())}</div>
      <div><b>${escapeHtml(t.name)}</b><small>${escapeHtml(t.role || "Pelanggan")}</small></div></div>
    </article>`).join("");
}
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
}
renderTestimonials();

const publicTestimonialForm = document.getElementById("publicTestimonialForm");
if(publicTestimonialForm){
  publicTestimonialForm.addEventListener("submit", function(e){
    e.preventDefault();
    const name = document.getElementById("publicName").value.trim();
    const rating = Math.max(1, Math.min(5, Number(document.getElementById("publicRating").value) || 5));
    const text = document.getElementById("publicText").value.trim();
    if(!name || !text) return;

    data.testimonials.unshift({
      name: name,
      role: "Pelanggan",
      text: text,
      rating: rating
    });

    localStorage.setItem("cirsiFoodData", JSON.stringify(data));
    renderTestimonials();
    publicTestimonialForm.reset();

    const success = document.getElementById("testimonialSuccess");
    success.textContent = "Terima kasih! Testimoni kamu berhasil ditambahkan 🎉";
    setTimeout(()=>success.textContent="", 4000);
  });
}

function renderOpenPO(){
  const list = document.getElementById("poList");
  const empty = document.getElementById("emptyPo");
  const count = document.getElementById("poCount");
  if(!list || !empty || !count) return;
  const po = Array.isArray(data.openPO) ? data.openPO : [];
  count.textContent = po.length;
  if(!po.length){
    list.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";
  list.innerHTML = po.map((item,i)=>`
    <div class="po-item">
      <div class="po-avatar">${escapeHtml(String(item.name||"P").charAt(0).toUpperCase())}</div>
      <div class="po-person"><b>${escapeHtml(item.name||"Pelanggan")}</b><small>${escapeHtml(Array.isArray(item.items)&&item.items.length ? item.items.map(x=>`${x.menu||"Pesanan Cireng"} • ${x.qty||1} pcs`).join(" | ") : `${item.menu||"Pesanan Cireng"}${item.qty ? " • "+item.qty+" pcs" : ""}`)}</small></div>
      <div class="po-status">✓ Sudah PO</div>
    </div>`).join("");
}
renderOpenPO();



const menuPrices = {
  "Ayam Ori":"ayamOri",
  "Ayam Pedas":"ayamPedas",
  "Jando":"jando",
  "Keju Parut":"keju"
};

const orderItemsBox = document.getElementById("orderItems");
const addOrderItemButton = document.getElementById("addOrderItem");

function updateOrderItemNumbers(){
  if(!orderItemsBox) return;
  const items = orderItemsBox.querySelectorAll(".order-item");
  items.forEach((item,index)=>{
    const number = item.querySelector(".order-item-number");
    if(number) number.textContent = index + 1;
    const removeButton = item.querySelector(".remove-item-btn");
    if(removeButton) removeButton.style.display = items.length > 1 ? "block" : "none";
  });
}

function createOrderItem(){
  const item = document.createElement("div");
  item.className = "order-item";
  item.innerHTML = `
    <div class="order-item-number"></div>
    <label>Pilih Menu *
      <select class="order-menu" required>
        <option value="">-- Pilih Menu --</option>
        <option value="Ayam Ori">🍗 Ayam Ori</option>
        <option value="Ayam Pedas">🌶️ Ayam Pedas</option>
        <option value="Jando">🥩 Jando</option>
        <option value="Keju Parut">🧀 Keju Parut</option>
      </select>
    </label>
    <label>Jumlah (PCS) *
      <input type="number" class="order-qty" min="1" value="1" required>
    </label>
    <button type="button" class="remove-item-btn" title="Hapus menu">🗑</button>
  `;
  return item;
}

if(addOrderItemButton && orderItemsBox){
  addOrderItemButton.addEventListener("click", ()=>{
    orderItemsBox.appendChild(createOrderItem());
    updateOrderItemNumbers();
  });

  orderItemsBox.addEventListener("click", (e)=>{
    const button = e.target.closest(".remove-item-btn");
    if(!button) return;
    const item = button.closest(".order-item");
    if(item && orderItemsBox.querySelectorAll(".order-item").length > 1){
      item.remove();
      updateOrderItemNumbers();
    }
  });

  updateOrderItemNumbers();
}

const orderForm = document.getElementById("orderForm");
if(orderForm){
  orderForm.addEventListener("submit", function(e){
    e.preventDefault();

    const name = document.getElementById("orderName").value.trim();
    const phone = document.getElementById("orderPhone").value.trim();
    const admin = document.getElementById("orderAdmin").value;
    const address = document.getElementById("orderAddress").value.trim();
    const note = document.getElementById("orderNote").value.trim();

    const itemElements = document.querySelectorAll(".order-item");
    const orders = [];
    let grandTotal = 0;

    for(const item of itemElements){
      const menu = item.querySelector(".order-menu")?.value || "";
      const qty = Number(item.querySelector(".order-qty")?.value) || 0;

      if(!menu || qty < 1){
        alert("Silakan pilih menu dan isi jumlah untuk semua pesanan.");
        return;
      }

      const priceKey = menuPrices[menu];
      const unitPrice = data.prices[priceKey] || 0;
      const total = unitPrice * qty;
      grandTotal += total;

      orders.push({menu, qty, unitPrice, total});
    }

    let orderText = "";
    orders.forEach((item,index)=>{
      orderText += `\n${index + 1}. *${item.menu}*\n   Jumlah: ${item.qty} pcs\n   Harga: ${rupiah(item.unitPrice)} x ${item.qty}\n   Subtotal: *${rupiah(item.total)}*\n`;
    });

    const message = `*🍘 PESANAN BARU CIRSI FOOD 🍘*

👤 *Nama:* ${name}
📱 *No. WhatsApp:* ${phone}

*🛒 DETAIL PESANAN:*
${orderText}
💵 *TOTAL KESELURUHAN: ${rupiah(grandTotal)}*

📍 *Alamat/Lokasi:*
${address}

📝 *Catatan:*
${note || "-"}

Terima kasih 🙏`;

    // Catat pesanan saat pelanggan menekan tombol Kirim Pesanan.
    // Catatan: website statis tidak bisa mengetahui apakah pesan benar-benar
    // sudah dikirim dari aplikasi WhatsApp, jadi status awal dibuat "Menunggu Konfirmasi".
    data.orders = Array.isArray(data.orders) ? data.orders : [];
    data.orders.unshift({
      id: "ORD-" + Date.now(),
      name,
      phone,
      orders,
      address,
      note: note || "-",
      admin,
      total: grandTotal,
      createdAt: new Date().toLocaleString("id-ID"),
      status: "Menunggu Konfirmasi"
    });
    saveWebsiteData();

    window.open(`https://wa.me/${admin}?text=${encodeURIComponent(message)}`, "_blank");
  });
}

function orderMenu(menu){
  const firstMenu = document.querySelector(".order-item .order-menu");
  if(firstMenu) firstMenu.value = menu;
  const orderSection = document.getElementById("order");
  if(orderSection) orderSection.scrollIntoView({behavior:"smooth", block:"start"});
}

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting) entry.target.classList.add("show");});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

const mobileMenu = document.querySelector(".mobile-menu");
if(mobileMenu){
  mobileMenu.addEventListener("click",()=>{
    const nav=document.querySelector(".navbar nav");
    if(!nav) return;
    nav.style.display=nav.style.display==="flex"?"none":"flex";
    if(nav.style.display==="flex"){
      Object.assign(nav.style,{position:"absolute",top:"76px",left:"0",width:"100%",background:"#2e160b",padding:"20px",flexDirection:"column"});
    }
  });
}