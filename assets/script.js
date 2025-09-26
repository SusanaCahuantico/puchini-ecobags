document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js inicializado ✅");

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("¡Gracias por tu mensaje! Te contactaremos pronto.");
      form.reset();
    });
  }

  const year = new Date().getFullYear();
  if (document.getElementById("year")) document.getElementById("year").textContent = year;
  if (document.getElementById("y")) document.getElementById("y").textContent = year;

  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
 async function loadPartial(id, file) {
    const el = document.getElementById(id);
    if (el) {
      try {
        const res = await fetch(`/${file}`);
        if (!res.ok) throw new Error(`Error al cargar ${file}`);
        el.innerHTML = await res.text();
      } catch (error) {
        console.error("No se pudo cargar el parcial:", error);
      }
    }
  }

  loadPartial("header", "header.html");
  loadPartial("footer", "footer.html");

  let productosGlobal = [];
  let productosMostrados = 0;
  const productosPorPagina = 12;

  async function cargarProductos() {
    try {
      const res = await fetch("assets/products.json");
      productosGlobal = await res.json();
      renderizarProductos();
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  }

  function renderizarProductos() {
    const grid = document.getElementById("destacados-grid");
    if (!grid) return;

    const productos = productosGlobal.slice(
      productosMostrados,
      productosMostrados + productosPorPagina
    );

    productos.forEach((p) => {
      const medidasHTML = p.medidas
        .map(
          (m) =>
            `<span class="px-3 py-1 text-xs bg-white border rounded-full text-gray-700 shadow-sm">${m}</span>`
        )
        .join("");

      const card = `
        <article class="group rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-lg transition product flex flex-col" data-cat="${p.categoria}">
          <div class="relative">
            <a href="product.html?id=${p.id}">
              <div class="aspect-[4/4] overflow-hidden rounded-t-2xl">
                <img src="${p.imagen}" alt="${p.nombre}"
                  class="w-full object-cover transition-transform duration-500 group-hover:scale-105 rounded-t-2xl">
                <div class="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
              </div>
              <span class="absolute left-3 top-3 inline-flex items-center rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs font-medium shadow">
                ${p.etiqueta}
              </span>
            </a>
          </div>

          <div class="flex-1 flex flex-col justify-between p-4">
            <div>
              <h3 class="text-lg font-semibold text-[#333333] group-hover:text-[#6C2E8C] transition">${p.nombre}</h3>
              <p class="mt-1 text-sm text-gray-600">${p.descripcionCorta}</p>
            </div>

      ${p.medidasTrue
        ? `
          <div class="mt-4 bg-[#FAFAFA] p-3 rounded-lg border">
            <h4 class="text-sm font-semibold text-gray-800 flex items-center space-x-2">
              <span></span><span>${p.medidasTrue}</span>
            </h4>
            <div class="mt-2 flex flex-wrap gap-2">
              ${medidasHTML}
            </div>
          </div>
        `
        : ""
      }
            <div class="mt-4">
              <p class="text-xl font-bold text-[#E91E8A]">Desde S/${p.precioMin}</p>
              <p class="text-sm text-gray-500">Hasta S/${p.precioMax} según cantidad</p>
            </div>
          </div>

          <div class="p-4 border-t">
            <a href="product.html?id=${p.id}"
              class="w-full inline-flex justify-center items-center rounded-lg bg-gradient-to-r from-[#6C2E8C] to-[#E91E8A] text-white font-medium py-2.5 shadow hover:opacity-90 transition">
              🛒 Cotizar ahora
            </a>
          </div>
        </article>
      `;

      grid.innerHTML += card;
    });

    productosMostrados += productosPorPagina;

    if (productosMostrados >= productosGlobal.length) {
      const btnVerMas = document.getElementById("ver-mas");
      if (btnVerMas) btnVerMas.classList.add("hidden");
    }
  }


  async function cargarProducto() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    try {
      const res = await fetch("assets/products.json");
      const productos = await res.json();
      const producto = productos.find((p) => p.id == id);
      if (!producto) return;

      document.title = `Puchini - ${producto.nombre}`;
      document.getElementById("producto-nombre").textContent = producto.nombre;
      document.getElementById("producto-descripcion").textContent =
        producto.descripcionCorta;
      document.getElementById("producto-precio").textContent = `Desde S/${producto.precioMin}`;
      document.getElementById("producto-hero-imagen").src = producto.imagen;

      document.getElementById("producto-imagen").src = producto.imagen;
      document.getElementById("producto-detalles").textContent =
        producto.descripcionLarga || producto.descripcionCorta;

      const medidasDiv = document.getElementById("producto-medidas");
      medidasDiv.innerHTML = producto.medidas
        .map(
          (m) =>
            `<span class="px-4 py-1.5 text-sm bg-white border border-[#e0d4f1] rounded-full shadow-sm">${m}</span>`
        )
        .join("");

      // Precios
      document.getElementById("producto-precio-min").textContent = `Desde S/${producto.precioMin}`;
      document.getElementById("producto-precio-max").textContent = `Hasta S/${producto.precioMax} según cantidad`;
    } catch (error) {
      console.error("Error cargando producto:", error);
    }
  }

  const path = window.location.pathname;

  if (path.includes("index.html") || path === "/" || path.endsWith("/")) {
    cargarProductos();
    const btnVerMas = document.getElementById("ver-mas");
    if (btnVerMas) {
      btnVerMas.addEventListener("click", renderizarProductos);
    }
  }

  if (path.includes("product.html")) {
    cargarProducto();
  }
});

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('sliderTrack');
    const slides = Array.from(track ? track.querySelectorAll('.slide') : []);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');
    const sliderWrapper = document.getElementById('productsSlider');

    if (!track || slides.length === 0) {
      console.warn('Slider: elementos no encontrados (sliderTrack o .slide). Revisa el HTML y los IDs.');
      return;
    }

    let slidesCount = slides.length;
    let slidesPerView = getSlidesPerView();
    let currentIndex = 0; // index de la "página"
    let autoplayTimer = null;
    let isHovered = false;

    function getSlidesPerView() {
      const w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 768) return 2;
      return 1;
    }

    function calcPages() {
      slidesPerView = Math.min(getSlidesPerView(), slidesCount);
      return Math.max(1, slidesCount - slidesPerView + 1);
    }

    function updateSlider() {
      const slideWidth = slides[0].getBoundingClientRect().width;
      const translateX = -currentIndex * slideWidth;
      track.style.transform = `translateX(${translateX}px)`;
      updateActiveDot();
    }

    function next() {
      const pages = calcPages();
      currentIndex = (currentIndex + 1) % pages;
      updateSlider();
    }

    function prev() {
      const pages = calcPages();
      currentIndex = (currentIndex - 1 + pages) % pages;
      updateSlider();
    }

    function goTo(index) {
      const pages = calcPages();
      currentIndex = Math.min(Math.max(0, index), pages - 1);
      updateSlider();
    }

    function renderDots() {
      const pages = calcPages();
      dotsContainer.innerHTML = '';
      for (let i = 0; i < pages; i++) {
        const btn = document.createElement('button');
        btn.className = 'w-3 h-3 rounded-full bg-gray-300/80 hover:bg-[#6C2E8C] transition';
        btn.setAttribute('aria-label', `Ir a la página ${i + 1}`);
        btn.dataset.index = i;
        btn.addEventListener('click', () => {
          goTo(i);
          restartAutoplay();
        });
        dotsContainer.appendChild(btn);
      }
      updateActiveDot();
    }

    function updateActiveDot() {
      const pages = calcPages();
      const dots = Array.from(dotsContainer.children);
      dots.forEach((d, i) => {
        if (i === currentIndex) {
          d.classList.remove('bg-gray-300/80'); d.classList.add('bg-[#6C2E8C]');
        } else {
          d.classList.remove('bg-[#6C2E8C]'); d.classList.add('bg-gray-300/80');
        }
      });
    }

    function startAutoplay() {
      stopAutoplay();
      autoplayTimer = setInterval(() => {
        if (!isHovered) next();
      }, 3500);
    }
    function stopAutoplay() { if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; } }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });
    prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });

    sliderWrapper.addEventListener('mouseenter', () => { isHovered = true; });
    sliderWrapper.addEventListener('mouseleave', () => { isHovered = false; });

    let startX = 0, isDragging = false;
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true; isHovered = true;
    });
    track.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - startX;
      track.style.transition = 'none';
      track.style.transform = `translateX(${ -currentIndex * slides[0].getBoundingClientRect().width + dx }px)`;
    });
    track.addEventListener('touchend', (e) => {
      track.style.transition = '';
      isDragging = false; isHovered = false;
      const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
      const dx = endX - startX;
      const threshold = 50;
      if (dx < -threshold) { next(); } else if (dx > threshold) { prev(); } else { updateSlider(); }
      restartAutoplay();
    });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const pages = calcPages();
        if (currentIndex > pages - 1) currentIndex = Math.max(0, pages - 1);
        renderDots();
        updateSlider();
      }, 150);
    });

    renderDots();
    updateSlider();
    startAutoplay();

    window._puchiniSlider = { next, prev, goTo };
  });
})();

window.sendToWhatsApp = function () {
  const nameEl = document.getElementById("name");
  const emailEl = document.getElementById("email");
  // const messageEl = document.getElementById("message");

  const name = nameEl ? nameEl.value.trim() : "";
  const email = emailEl ? emailEl.value.trim() : "";

  if (!name && !email) {
    alert("Por favor completa al menos un dato antes de enviar.");
    return;
  }

  const text = `👤 Nombre: ${encodeURIComponent(name)}%0A📧 Email: ${encodeURIComponent(email)}%0A💬`;
  const url = `https://wa.me/51951938417?text=${text}`;

  window.open(url, "_blank");
};

