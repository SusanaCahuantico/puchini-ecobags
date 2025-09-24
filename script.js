/* assets/js/main.js
   Consolidado: form, year, menu, filtros, smooth scroll, whatsapp y slider nativo.
   Asegúrate de incluir <script src="assets/js/main.js" defer></script> en tu HTML.
*/

document.addEventListener('DOMContentLoaded', () => {
  console.log('main.js inicializado');

  /* -------------------- Formulario contacto -------------------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Puedes reemplazar el alert por un modal o notificación más elegante
      alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
      form.reset();
    });
  }

  /* -------------------- Año en footer (soporta id="year" o id="y") -------------------- */
  const year = new Date().getFullYear();
  const elYear = document.getElementById('year');
  const elY = document.getElementById('y');
  if (elYear) elYear.textContent = year;
  if (elY) elY.textContent = year;

  /* -------------------- Menú móvil toggle -------------------- */
  const menuBtn = document.getElementById('menu-btn');
  const menu = document.getElementById('menu');
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  window.sendToWhatsApp = function sendToWhatsApp() {
    const get = id => (document.getElementById(id) ? document.getElementById(id).value.trim() : '');
    const name = get('name');
    const email = get('email');
    const message = get('message');

    if (!name || !email || !message) {
      alert('Por favor completa todos los campos antes de enviar por WhatsApp.');
      return;
    }

    const whatsappNumber = '51951938417';
    const text = `👤 Nombre: ${encodeURIComponent(name)}%0A📧 Correo: ${encodeURIComponent(email)}%0A💬 Mensaje: ${encodeURIComponent(message)}`;
    const url = `https://wa.me/${whatsappNumber}?text=${text}`;
    window.open(url, '_blank');

    const formEl = document.getElementById('contactForm');
    if (formEl) formEl.reset();
  };

  (function initFilters() {
    const filterButtons = Array.from(document.querySelectorAll('.filter-btn, [data-filter]'));
    const products = Array.from(document.querySelectorAll('.product, .product-card, .card, .product-item'));

    if (filterButtons.length === 0 || products.length === 0) {
      return;
    }

    function resetFilterVisuals() {
      filterButtons.forEach(b => {
        b.style.background = '';
        b.style.color = '';
        b.classList.remove('active-filter');
      });
    }

    filterButtons.forEach(btn => {
      const filter = btn.dataset.filter || btn.getAttribute('data-filter');
      if (!filter) return;
      btn.addEventListener('click', () => {
        products.forEach(p => {
          const cat = p.dataset.cat || p.getAttribute('data-cat') || '';
          if (filter === 'all' || cat === filter) {
            p.classList.remove('hidden');
            p.style.display = '';
          } else {
            p.classList.add('hidden');
            p.style.display = 'none';
          }
        });

        resetFilterVisuals();
        btn.style.background = '#E91E8A';
        btn.style.color = '#ffffff';
        btn.classList.add('active-filter');
      });
    });
  })();

  (function initSlider() {
    const track = document.getElementById('sliderTrack');
    const sliderWrapper = document.getElementById('productsSlider');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('sliderDots');

    if (!track || !sliderWrapper) {
      return;
    }

    const slides = Array.from(track.querySelectorAll('.slide'));
    if (slides.length === 0) {
      return;
    }

    let slidesCount = slides.length;
    let slidesPerView = getSlidesPerView();
    let currentIndex = 0;
    let autoplayTimer = null;
    let isHovered = false;

    function getSlidesPerView() {
      const w = window.innerWidth;
      if (w >= 1024) return 4;
      if (w >= 768) return 3;
      return 2;
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
      if (!dotsContainer) return;
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
      if (!dotsContainer) return;
      const dots = Array.from(dotsContainer.children);
      dots.forEach((d, i) => {
        if (i === currentIndex) {
          d.classList.remove('bg-gray-300/80');
          d.classList.add('bg-[#6C2E8C]');
        } else {
          d.classList.remove('bg-[#6C2E8C]');
          d.classList.add('bg-gray-300/80');
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

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); restartAutoplay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); restartAutoplay(); });

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
  })();

});

async function loadPartial(id, file) {
  const el = document.getElementById(id);
  if (el) {
    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`Error al cargar ${file}`);
      el.innerHTML = await res.text();
    } catch (error) {
      console.error("No se pudo cargar el parcial:", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadPartial("header", "./header.html");
  loadPartial("footer", "./footer.html");
});