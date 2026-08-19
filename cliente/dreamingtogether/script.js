// Catálogo real tomado de dreamingtogethergt.com — actualízalo cuando cambien productos/precios.
const PRODUCTS = [
  { title: "Cepillo masajeador", price: 15.00, img: "https://dreamingtogethergt.com/cdn/shop/files/5354E8AB-03CC-4D88-BAD6-513C4022E383.jpg?v=1772868603&width=600", url: "https://dreamingtogethergt.com/products/cepillo-masajeador" },
  { title: "Cosmetiquera con luz led", price: 190.00, img: "https://dreamingtogethergt.com/cdn/shop/files/3540F25A-7BF9-4073-869E-2678F0B3A8A7.jpg?v=1773210044&width=600", url: "https://dreamingtogethergt.com/products/cosmetiquera-con-luz-led" },
  { title: "Cosmetiquera organizadora", price: 45.00, img: "https://dreamingtogethergt.com/cdn/shop/files/11945335-8EF3-4805-95CE-5C5BC093E466.jpg?v=1773384921&width=600", url: "https://dreamingtogethergt.com/products/cosmetiquera-organizadora" },
  { title: "Dupe Sol de Janeiro 250ml", price: 55.00, img: "https://dreamingtogethergt.com/cdn/shop/files/B5F0EB93-101E-454F-9581-73CCB8F4AB81.jpg?v=1772867426&width=600", url: "https://dreamingtogethergt.com/products/dupe-sol-de-janeiro-250ml" },
  { title: "Karseel dúo", price: 95.00, img: "https://dreamingtogethergt.com/cdn/shop/files/41381F25-2280-424A-BC7A-6D6C8E2C3E62.jpg?v=1773208154&width=600", url: "https://dreamingtogethergt.com/products/karseel-duo" },
  { title: "Karseel kit profesional", price: 225.00, img: "https://dreamingtogethergt.com/cdn/shop/files/0C5FFD60-1DBD-4DBD-8F00-179A688DF86F.jpg?v=1773207947&width=600", url: "https://dreamingtogethergt.com/products/karseel-kit-profesional" },
  { title: "Kit blanqueador", price: 75.00, img: "https://dreamingtogethergt.com/cdn/shop/files/D0EF5085-5B2A-4BCF-9095-95A1B653F04D.jpg?v=1773209618&width=600", url: "https://dreamingtogethergt.com/products/kit-blanqueador", soldOut: true },
  { title: "Kit dupe Sol de Janeiro", price: 80.00, img: "https://dreamingtogethergt.com/cdn/shop/files/9900EC6A-C823-48BC-B64B-4CCB4640152F.jpg?v=1773207767&width=600", url: "https://dreamingtogethergt.com/products/kit-dupe-sol-de-janeiro" },
  { title: "Kit skin care arroz Bioaqua", price: 125.00, img: "https://dreamingtogethergt.com/cdn/shop/files/1132DDCF-CD3F-45D3-9AF0-34EC583DAB74.jpg?v=1781584318&width=600", url: "https://dreamingtogethergt.com/products/kit-skin-care-arroz-bioaqua" },
  { title: "Masajeador con luz led", price: 90.00, img: "https://dreamingtogethergt.com/cdn/shop/files/08BCBD82-740B-4118-9852-4BAC9A209531.jpg?v=1773126217&width=600", url: "https://dreamingtogethergt.com/products/masajeador-con-luz-led" },
  { title: "Organizador giratorio", price: 90.00, img: "https://dreamingtogethergt.com/cdn/shop/files/6607DC0A-A7B4-409E-8FD0-EAE7DB46E162.jpg?v=1773385462&width=600", url: "https://dreamingtogethergt.com/products/organizador-giratorio" },
  { title: "Protector solar Aclarador Dr. Rashel", price: 45.00, img: "https://dreamingtogethergt.com/cdn/shop/files/F80EB34A-F776-40FC-8C94-7DAE005CD23B.png?v=1773036655&width=600", url: "https://dreamingtogethergt.com/products/protector-solar-aclarador-dr-rashel" },
  { title: "Protector solar en spray Dr. Rashel", price: 50.00, img: "https://dreamingtogethergt.com/cdn/shop/files/D37A7197-583A-4A1D-8931-A5581D3285FC.png?v=1773036262&width=600", url: "https://dreamingtogethergt.com/products/protector-solar-en-spray-dr-rashel" },
  { title: "Protector solar vitamina C Dr. Rashel", price: 45.00, img: "https://dreamingtogethergt.com/cdn/shop/files/DB50A6DF-6D74-40B6-88E2-656F9EA92F2A.png?v=1773036533&width=600", url: "https://dreamingtogethergt.com/products/protector-solar-vitamina-c-dr-rashel" },
  { title: "Rizado para pestañas", price: 85.00, img: "https://dreamingtogethergt.com/cdn/shop/files/5893CCE4-B981-44ED-9D3B-A5365AC3357D.jpg?v=1781584979&width=600", url: "https://dreamingtogethergt.com/products/rizado-para-pestanas" },
  { title: "Set curling ondas sin calor", price: 45.00, img: "https://dreamingtogethergt.com/cdn/shop/files/E70D0252-DE3A-49E1-8FED-EFFF3AE162CC.png?v=1781585603&width=600", url: "https://dreamingtogethergt.com/products/set-curling-ondas-sin-calor" },
  { title: "Set lociones batido", price: 35.00, img: "https://dreamingtogethergt.com/cdn/shop/files/20EF03E2-8691-445B-B8A0-9340A5A89F63.jpg?v=1781586483&width=600", url: "https://dreamingtogethergt.com/products/set-lociones-batido" },
  { title: "Set lociones pastelito", price: 35.00, img: "https://dreamingtogethergt.com/cdn/shop/files/EAAB515B-FC66-4CFA-BBA6-0A09C058575D.jpg?v=1781586094&width=600", url: "https://dreamingtogethergt.com/products/set-lociones-pastelito" },
  { title: "Skin care íntimo", price: 75.00, img: "https://dreamingtogethergt.com/cdn/shop/files/9716DDA7-401F-4029-8572-C09898FE6DF4.png?v=1773125949&width=600", url: "https://dreamingtogethergt.com/products/skin-care-intimo" },
  { title: "Yara dupe 100ml", price: 70.00, img: "https://dreamingtogethergt.com/cdn/shop/files/3FFC9608-C345-498B-8105-6B851FEF2F75.jpg?v=1773208285&width=600", url: "https://dreamingtogethergt.com/products/yara-dupe-100ml", soldOut: true },
];

function formatGTQ(n) {
  return n.toFixed(2) + " GTQ";
}

function renderProducts() {
  const grid = document.getElementById("productGrid");
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map(p => `
    <a class="product-card" href="${p.url}" target="_blank" rel="noopener">
      <div class="product-card__media">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
        <span class="product-card__quick">${p.soldOut ? "Agotado" : "Comprar"}</span>
      </div>
      <div class="product-card__body">
        <p class="product-card__title">${p.title}</p>
        <p class="product-card__price ${p.soldOut ? "product-card__price--sold" : ""}">${formatGTQ(p.price)}</p>
      </div>
    </a>
  `).join("");
}

function setupNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => nav.classList.toggle("main-nav--open"));
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  setupNavToggle();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
