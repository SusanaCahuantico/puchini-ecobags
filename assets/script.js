document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js inicializado ✅");

  // ====== FORM ======
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("¡Gracias por tu mensaje! Te contactaremos pronto.");
      form.reset();
    });
  }

  // ====== FOOTER YEAR ======
  const year = new Date().getFullYear();
  if (document.getElementById("year")) document.getElementById("year").textContent = year;
  if (document.getElementById("y")) document.getElementById("y").textContent = year;

  // ====== MENU MOBILE ======
  const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }

  // ====== SMOOTH SCROLL ======
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

  // ====== LOAD PARTIALS ======
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

  // ====== PRODUCTOS ======
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

            <div class="mt-4 bg-[#FAFAFA] p-3 rounded-lg border">
              <h4 class="text-sm font-semibold text-gray-800 flex items-center space-x-2">
                <span>📏</span><span>Medidas disponibles</span>
              </h4>
              <div class="mt-2 flex flex-wrap gap-2">
                ${medidasHTML}
              </div>
            </div>

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

  // ====== DETALLE PRODUCTO ======
  async function cargarProducto() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) return;

    try {
      const res = await fetch("assets/products.json");
      const productos = await res.json();
      const producto = productos.find((p) => p.id == id);
      if (!producto) return;

      // Hero
      document.title = `Puchini - ${producto.nombre}`;
      document.getElementById("producto-nombre").textContent = producto.nombre;
      document.getElementById("producto-descripcion").textContent =
        producto.descripcionCorta;
      document.getElementById("producto-precio").textContent = `Desde S/${producto.precioMin}`;
      document.getElementById("producto-hero-imagen").src = producto.imagen;

      // Main
      document.getElementById("producto-imagen").src = producto.imagen;
      document.getElementById("producto-detalles").textContent =
        producto.descripcionLarga || producto.descripcionCorta;

      // Medidas
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

  // ====== RUTAS ======
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
