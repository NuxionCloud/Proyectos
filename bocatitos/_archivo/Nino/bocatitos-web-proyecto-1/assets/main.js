/* ============================================================
   BOCATITOS — JS común
   Maneja: fondo animado, nav, idioma, reveal scroll, año footer
   ============================================================ */
(function() {
  'use strict';

  const WA_PHONE = '34641293669';

  /* ----------------------------------------
     1. FONDO ANIMADO — Fotos del local en parallax + blobs aurora sutiles
     ---------------------------------------- */
  function initBackground() {
    const bgAnim = document.getElementById('bgAnim');
    if (!bgAnim) return;

    // Limpiar contenedores antiguos
    bgAnim.querySelectorAll('.bg-emojis, .bg-particles, .bg-gradient, .bg-photos, .bg-canvas, .bg-tint').forEach(el => el.remove());

    // --- Capa 1: FOTOS DE COMIDA en columnas parallax ---
    // (foto-5 era el exterior del local y se ha quitado: solo comida/carta)
    const fotos = [
      'assets/fotos/foto-1-smash-tito-gourmet.jpg',
      'assets/fotos/foto-2-carta-personalizada.jpg',
      'assets/fotos/foto-3-smash-cerdo.jpg',
      'assets/fotos/foto-4-bocakillo.jpg',
      'assets/fotos/foto-6-bocakillo.jpg'
    ];

    const photosLayer = document.createElement('div');
    photosLayer.className = 'bg-photos';

    // 3 columnas con direcciones distintas pero misma velocidad.
    // Cada lista tiene 6 elementos (rotando las 5 fotos) para que la "mitad"
    // del set duplicado supere la altura del viewport y no queden huecos.
    const colConfigs = [
      { cls: 'up',   indices: [0, 1, 2, 3, 4, 0] },
      { cls: 'down', indices: [2, 3, 4, 0, 1, 2] },
      { cls: 'up',   indices: [1, 4, 0, 3, 2, 1] }
    ];

    colConfigs.forEach(cfg => {
      const col = document.createElement('div');
      col.className = `photo-col ${cfg.cls}`;
      col.setAttribute('aria-hidden', 'true');
      // Duplicar la lista para loop infinito sin saltos visibles
      const seq = [...cfg.indices, ...cfg.indices];
      seq.forEach(idx => {
        const img = document.createElement('img');
        img.src = fotos[idx];
        img.alt = '';
        img.loading = 'eager';
        img.decoding = 'async';
        col.appendChild(img);
      });
      photosLayer.appendChild(col);
    });
    bgAnim.appendChild(photosLayer);

    // --- Capa 2: BLOBS aurora (más sutiles, mix-blend-mode screen) ---
    const blobsContainer = document.createElement('div');
    blobsContainer.className = 'bg-blobs';
    for (let i = 1; i <= 6; i++) {
      const b = document.createElement('div');
      b.className = `blob blob-${i}`;
      b.setAttribute('aria-hidden', 'true');
      blobsContainer.appendChild(b);
    }
    bgAnim.appendChild(blobsContainer);

    // --- Capa 3: TINTE final (legibilidad del contenido) ---
    const tint = document.createElement('div');
    tint.className = 'bg-tint';
    bgAnim.appendChild(tint);
  }

  function initParticleNetwork(canvas) {
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let particles = [];
    let CONNECT = 150;
    let rafId = null;
    let lastTime = 0;
    const TARGET_FPS = 45;
    const FRAME_TIME = 1000 / TARGET_FPS;

    function countFor(area) {
      // Densidad adaptativa según viewport
      return Math.max(30, Math.min(85, Math.round(area / 24000)));
    }

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      CONNECT = W < 768 ? 110 : 150;
      initParticles();
    }

    function initParticles() {
      const count = countFor(W * H);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          r: Math.random() * 1.4 + 0.8
        });
      }
    }

    function step(time) {
      rafId = requestAnimationFrame(step);
      if (time - lastTime < FRAME_TIME) return;
      lastTime = time;

      ctx.clearRect(0, 0, W, H);

      // Actualizar posiciones
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = W + 20;
        else if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        else if (p.y > H + 20) p.y = -20;
      }

      // Líneas de conexión
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < CONNECT * CONNECT) {
            const dist = Math.sqrt(dist2);
            const alpha = (1 - dist / CONNECT) * 0.32;
            ctx.strokeStyle = `rgba(255, 229, 0, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Puntos
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 229, 0, 0.85)';
        ctx.shadowColor = 'rgba(255, 229, 0, 0.7)';
        ctx.shadowBlur = 6;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    // Pausar cuando la pestaña no es visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!document.hidden && !rafId) {
        rafId = requestAnimationFrame(step);
      }
    });

    resize();
    rafId = requestAnimationFrame(step);
  }


  /* ----------------------------------------
     2. NAV SCROLL + BURGER
     ---------------------------------------- */
  function initNav() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    // Sombra al hacer scroll
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Burger móvil
    const burger = nav.querySelector('.burger');
    if (burger) {
      burger.addEventListener('click', () => nav.classList.toggle('open'));
      nav.querySelectorAll('.nav-links a').forEach(a => {
        a.addEventListener('click', () => nav.classList.remove('open'));
      });
    }

    // Marcar link activo según página actual
    const path = window.location.pathname.split('/').pop() || 'index.html';
    nav.querySelectorAll('.nav-links a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html') || (path === 'index.html' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  }


  /* ----------------------------------------
     3. REVEAL ON SCROLL
     ---------------------------------------- */
  function initReveal() {
    const targets = document.querySelectorAll('.reveal, .stagger');
    if (!targets.length || !('IntersectionObserver' in window)) {
      targets.forEach(t => t.classList.add('visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(el => io.observe(el));
  }


  /* ----------------------------------------
     4. I18N — Cambio de idioma
     ---------------------------------------- */
  function initI18N() {
    const dict = window.BOCATITOS_I18N;
    if (!dict) return;

    function setLanguage(lang) {
      if (!dict[lang]) lang = 'es';
      document.documentElement.lang = lang;
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[lang][key] !== undefined) el.textContent = dict[lang][key];
      });
      // Placeholders
      document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (dict[lang][key] !== undefined) el.placeholder = dict[lang][key];
      });
      document.querySelectorAll('.lang-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.lang === lang);
      });
      localStorage.setItem('bocatitos-lang', lang);
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    const saved = localStorage.getItem('bocatitos-lang') || 'es';
    setLanguage(saved);

    // Exponer globalmente por si lo necesita una página
    window.setBocatitosLang = setLanguage;
  }


  /* ----------------------------------------
     5. AÑO FOOTER
     ---------------------------------------- */
  function initYear() {
    const y = document.getElementById('year');
    if (y) y.textContent = new Date().getFullYear();
  }


  /* ----------------------------------------
     6. CARTA — Abrir desplegables según URL
       - ?all=1                 → abre los 3
       - ?cat=desayuno          → abre solo desayuno
       - ?cat=streetfood        → abre solo street food
       - ?cat=tapas             → abre solo tapas
       - (sin parámetros)       → todos cerrados
     ---------------------------------------- */
  function initMenuAutoOpen() {
    const accordion = document.querySelector('.menu-accordion');
    if (!accordion) return;

    const params = new URLSearchParams(window.location.search);
    const items = accordion.querySelectorAll('details.menu-item');

    if (params.get('all') === '1') {
      // Abrir todos
      items.forEach(d => d.open = true);
      return;
    }

    const cat = params.get('cat');
    if (cat) {
      const target = accordion.querySelector(`details#${CSS.escape(cat)}`);
      if (target) {
        target.open = true;
        // Scroll suave hasta él tras un pequeño delay
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    }
    // Si no hay parámetros, los details se quedan como vinieron en el HTML (cerrados)
  }


  /* ----------------------------------------
     7. FORMULARIO DE RESERVA (solo en reservar.html)
     ---------------------------------------- */
  function initReservaForm() {
    const form = document.getElementById('reservaForm');
    if (!form) return;

    const success = document.getElementById('formSuccess');
    const sendBtn = form.querySelector('[data-send="email"]');
    const waBtn = form.querySelector('[data-send="whatsapp"]');

    function buildMessage() {
      const d = new FormData(form);
      const name = d.get('name') || '';
      const phone = d.get('phone') || '';
      const email = d.get('email') || '';
      const date = d.get('date') || '';
      const time = d.get('time') || '';
      const people = d.get('people') || '';
      const service = d.get('service') || '';
      const notes = d.get('notes') || '';

      const lines = [
        '🍽️ NUEVA RESERVA — BOCATITOS',
        '',
        `👤 Nombre: ${name}`,
        `📞 Teléfono: ${phone}`,
        email ? `📧 Email: ${email}` : null,
        `📅 Fecha: ${date}`,
        `🕐 Hora: ${time}`,
        `👥 Personas: ${people}`,
        service ? `🍴 Servicio: ${service}` : null,
        notes ? `📝 Notas: ${notes}` : null
      ].filter(Boolean);

      return lines.join('\n');
    }

    function showSuccess() {
      if (success) {
        success.classList.add('show');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    }

    // Botón "Enviar reserva" — abre mailto con el mensaje
    if (sendBtn) {
      sendBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const msg = buildMessage();
        const subject = encodeURIComponent('Nueva reserva — Bocatitos');
        const body = encodeURIComponent(msg);
        // mailto a placeholder — el cliente debe sustituir por su email real
        window.location.href = `mailto:reservas@bocatitos.es?subject=${subject}&body=${body}`;
        showSuccess();
      });
    }

    // Botón "Enviar por WhatsApp" — abre wa.me con mensaje pre-rellenado
    if (waBtn) {
      waBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) { form.reportValidity(); return; }
        const msg = buildMessage();
        const url = `https://wa.me/${WA_PHONE}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank', 'noopener');
        showSuccess();
      });
    }

    // Botón "Hacer otra reserva"
    const newBtn = document.getElementById('formNewBtn');
    if (newBtn) {
      newBtn.addEventListener('click', () => {
        success.classList.remove('show');
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    // Fecha mínima = hoy
    const dateInput = form.querySelector('input[name="date"]');
    if (dateInput) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      dateInput.min = `${yyyy}-${mm}-${dd}`;
    }
  }


  /* ----------------------------------------
     8. RESEÑAS — 3 tarjetas con fade simultáneo
     Los 3 visibles son SIEMPRE diferentes entre sí:
     set s muestra reviews [s, s+1, s+2] mod 5
     ---------------------------------------- */
  function initReviewsCarousel() {
    var box = document.querySelector('.reviews-box');
    if (!box) return;

    var TOTAL    = 5;
    var INTERVAL = 4000;
    var FADE     = 350;
    var current  = 0;
    var busy     = false;
    var timer    = null;

    var cards = Array.from(box.querySelectorAll('.review-card'));
    var dots  = Array.from(box.querySelectorAll('.reviews-dot'));

    var data = [
      { key: 'review1.text', author: 'Sam S.' },
      { key: 'review2.text', author: 'Rosendo G.' },
      { key: 'review3.text', author: 'Jose Luis G.' },
      { key: 'review4.text', author: 'Valvanuz H.' },
      { key: 'review5.text', author: 'Paulina S.' }
    ];

    function getText(idx) {
      var key  = data[idx % TOTAL].key;
      var lang = localStorage.getItem('bocatitos-lang') || 'es';
      var dict = window.BOCATITOS_I18N;
      return (dict && dict[lang] && dict[lang][key]) ||
             (dict && dict.es  && dict.es[key])  || '';
    }

    function applySet(setIdx, animate) {
      function swap() {
        cards.forEach(function(card, i) {
          var ri     = (setIdx + i) % TOTAL;
          var textEl = card.querySelector('.review-text');
          var authEl = card.querySelector('.review-author-name');
          if (textEl) { textEl.textContent = getText(ri); textEl.setAttribute('data-i18n', data[ri].key); }
          if (authEl) { authEl.textContent = data[ri].author; }
        });
        dots.forEach(function(d, i) { d.classList.toggle('active', i === setIdx % TOTAL); });
      }

      if (!animate) { swap(); return; }
      if (busy) return;
      busy = true;
      cards.forEach(function(c) { c.classList.add('r-fading'); });
      setTimeout(function() {
        swap();
        cards.forEach(function(c) { c.classList.remove('r-fading'); });
        setTimeout(function() { busy = false; }, FADE);
      }, FADE);
    }

    function goTo(idx) {
      current = ((idx % TOTAL) + TOTAL) % TOTAL;
      applySet(current, true);
    }

    function start() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      timer = setInterval(function() { goTo(current + 1); }, INTERVAL);
    }
    function stop() { clearInterval(timer); timer = null; }

    box.addEventListener('mouseenter', stop);
    box.addEventListener('mouseleave', start);

    var prevBtn = box.querySelector('.reviews-prev');
    var nextBtn = box.querySelector('.reviews-next');
    if (prevBtn) prevBtn.addEventListener('click', function() { stop(); goTo(current - 1); start(); });
    if (nextBtn) nextBtn.addEventListener('click', function() { stop(); goTo(current + 1); start(); });

    dots.forEach(function(dot, i) {
      dot.addEventListener('click', function() { stop(); goTo(i); start(); });
    });

    var touchStartX = 0;
    box.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    box.addEventListener('touchend', function(e) {
      var diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 40) { stop(); goTo(diff > 0 ? current + 1 : current - 1); start(); }
    }, { passive: true });

    applySet(0, false);
    start();
  }


  /* ----------------------------------------
     INIT
     ---------------------------------------- */
  function init() {
    initBackground();
    initNav();
    initReveal();
    initI18N();
    initYear();
    initMenuAutoOpen();
    initReservaForm();
    initReviewsCarousel();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
