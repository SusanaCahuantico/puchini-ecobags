document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("¡Gracias por tu mensaje! Te contactaremos pronto.");
    form.reset();
  });
});

  document.getElementById('year').textContent = new Date().getFullYear();

    const buttons = document.querySelectorAll('.filter-btn');
  const products = document.querySelectorAll('.product');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      products.forEach(product => {
        if (filter === 'all' || product.dataset.cat === filter) {
          product.classList.remove('hidden');
        } else {
          product.classList.add('hidden');
        }
      });

      buttons.forEach(b => b.classList.remove('bg-[#E91E8A]', 'text-white'));
      btn.classList.add('bg-[#E91E8A]', 'text-white');
    });
  });

  // Menú móvil
const menuBtn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

menuBtn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
});

// Filtros de productos
const filterBtns = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const filter = btn.dataset.filter;

    productCards.forEach(card => {
      if (filter === "all" || card.classList.contains(filter)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    });
  });
});

function sendToWhatsApp() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  const whatsappNumber = "519XXXXXXXX"; // reemplaza con tu número (ej: 51 para Perú)
  const url = `https://wa.me/${whatsappNumber}?text=👤 Nombre: ${name}%0A📧 Correo: ${email}%0A💬 Mensaje: ${message}`;

  window.open(url, "_blank");
}