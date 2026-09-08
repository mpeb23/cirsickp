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
  openPO: []
};

function getData(){
  try{
    const saved = JSON.parse(localStorage.getItem("cirsiFoodData"));
    return saved ? {...defaults, ...saved, prices:{...defaults.prices,...saved.prices}, images:{...defaults.images,...saved.images}, testimonials:Array.isArray(saved.testimonials)?saved.testimonials:defaults.testimonials, openPO:Array.isArray(saved.openPO)?saved.openPO:[]} : defaults;
  }catch(e){ return defaults; }
}
function rupiah(n){ return "Rp " + Number(n).toLocaleString("id-ID"); }
const data = getData();

document.querySelectorAll("[data-price]").forEach(el => {
  el.textContent = rupiah(data.prices[el.dataset.price]);
});
document.getElementById("heroImage").src = data.images.hero;
document.getElementById("aboutImage").src = data.images.hero;
document.getElementById("imgAyamOri").src = data.images.ayamOri;
document.getElementById("imgAyamPedas").src = data.images.ayamPedas;
document.getElementById("imgJando").src = data.images.jando;
document.getElementById("imgKeju").src = data.images.keju;
document.getElementById("locationText").textContent = data.location;

function waLink(message){
  return `https://wa.me/${data.whatsapp}?text=${encodeURIComponent(message)}`;
}
const generalMessage = "Halo CIRSI FOOD, saya ingin pesan cireng isi 😊";
document.getElementById("waButton").href = waLink(generalMessage);
document.getElementById("floatingWa").href = waLink(generalMessage);
function orderMenu(menu){
  const select = document.getElementById("orderMenuSelect");
  if(select) select.value = menu;
  document.getElementById("order").scrollIntoView({behavior:"smooth", block:"start"});
}

function renderTestimonials(){
  const box = document.getElementById("testimonialList");
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
  const po = Array.isArray(data.openPO) ? data.openPO : [];
  document.getElementById("poCount").textContent = po.length;
  if(!po.length){
    list.innerHTML = "";
    empty.style.display = "block";
    return;
  }
  empty.style.display = "none";
  list.innerHTML = po.map((item,i)=>`
    <div class="po-item">
      <div class="po-avatar">${escapeHtml(String(item.name||"P").charAt(0).toUpperCase())}</div>
      <div class="po-person"><b>${escapeHtml(item.name||"Pelanggan")}</b><small>${escapeHtml(item.menu||"Pesanan Cireng")}${item.qty ? " • "+escapeHtml(String(item.qty))+" pcs" : ""}</small></div>
      <div class="po-status">✓ Sudah PO</div>
    </div>`).join("");
}
renderOpenPO();



const orderForm = document.getElementById("orderForm");
if(orderForm){
  orderForm.addEventListener("submit", function(e){
    e.preventDefault();

    const name = document.getElementById("orderName").value.trim();
    const phone = document.getElementById("orderPhone").value.trim();
    const menu = document.getElementById("orderMenuSelect").value;
    const qty = Number(document.getElementById("orderQty").value) || 1;
    const spicy = document.getElementById("orderSpicy").value;
    const admin = document.getElementById("orderAdmin").value;
    const address = document.getElementById("orderAddress").value.trim();
    const note = document.getElementById("orderNote").value.trim();

    const priceKey = {
      "Ayam Ori":"ayamOri",
      "Ayam Pedas":"ayamPedas",
      "Jando":"jando",
      "Keju Parut":"keju"
    }[menu];

    const unitPrice = data.prices[priceKey] || 0;
    const total = unitPrice * qty;

    const message = `*🍘 PESANAN BARU CIRSI FOOD 🍘*

👤 *Nama:* ${name}
📱 *No. WhatsApp:* ${phone}

🛒 *Pesanan:* ${menu}
🔢 *Jumlah:* ${qty} pcs
🌶️ *Level Pedas:* ${spicy}
💰 *Harga Satuan:* ${rupiah(unitPrice)}
💵 *Total:* ${rupiah(total)}

📍 *Alamat/Lokasi:*
${address}

📝 *Catatan:*
${note || "-"}

Terima kasih 🙏`;

    window.open(`https://wa.me/${admin}?text=${encodeURIComponent(message)}`, "_blank");
  });
}

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting) entry.target.classList.add("show");});
},{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

document.querySelector(".mobile-menu").addEventListener("click",()=>{
  const nav=document.querySelector(".navbar nav");
  nav.style.display=nav.style.display==="flex"?"none":"flex";
  if(nav.style.display==="flex"){
    Object.assign(nav.style,{position:"absolute",top:"76px",left:"0",width:"100%",background:"#2e160b",padding:"20px",flexDirection:"column"});
  }
});