/* =====================================================================
   MODELO 12 · TRES MOMENTOS · APP
   ===================================================================== */
const $$ = (s, r = document) => r.querySelectorAll(s);
const $  = (s, r = document) => r.querySelector(s);

const PAGES = [
  { k:'home',       href:'index.html',     i18n:'nav.home',       label:'Inicio'      },
  { k:'breakfast',  href:'desayuno.html',  i18n:'nav.breakfast',  label:'Desayuno'    },
  { k:'tapas',      href:'tapas.html',     i18n:'nav.tapas',      label:'Tapas'       },
  { k:'streetfood', href:'streetfood.html',i18n:'nav.streetfood', label:'Street Food' },
  { k:'reviews',    href:'resenas.html',   i18n:'nav.reviews',    label:'Reseñas'     },
  { k:'concept',    href:'concepto.html',  i18n:'cta.about',      label:'Sobre nosotros' },
];
const WA = 'https://wa.me/34641293669?text=Hola%20Bocatitos%2C%20me%20gustar%C3%ADa%20hacer%20un%20pedido';

/* ---- COLLAGE HERO: imágenes que evocan a Bocatitos (Sevilla, street food, bocatas, smash burger).
       El cliente sustituirá por sus propias fotos/vídeo final desde Instagram @bocatitosf ---- */
const HERO_SLIDES = [
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1920&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=1920&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=1920&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1619740455993-9e612b1af08a?w=1920&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559054663-e8d23213f55c?w=1920&q=85&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=1920&q=85&auto=format&fit=crop',
];

/* ---------- HEADER / FOOTER chrome injection ---------- */
function renderHead(active){
  return `
  <div class="nav-inner">
    <a class="brand" href="index.html" aria-label="Bocatitos Street Food">
      <img class="brand-logo" src="assets/logo.png" alt="Bocatitos Street Food">
    </a>
    <nav class="primary">
      <ul class="menu">
        ${PAGES.map(p => `<li><a href="${p.href}" class="${p.k===active?'active':''}" data-i18n="${p.i18n}">${p.label}</a></li>`).join('')}
      </ul>
    </nav>
    <div class="nav-right">
      <div class="lang" id="langMount"></div>
      <button id="burger" class="burger" aria-label="Menú"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>
    </div>
  </div>`;
}

function renderFoot(){
  return `
  <div class="wrap">
    <div class="footer-grid">
      <div class="foo-brand">
        <a class="brand" href="index.html" aria-label="Bocatitos Street Food">
          <img class="brand-logo" src="assets/logo.png" alt="Bocatitos Street Food">
        </a>
        <p data-i18n="foo.tagline" style="margin-top:18px">Tres momentos. Un solo sabor. Pan recién horneado, carne 100% vacuna y el cariño de un local de barrio en pleno Sánchez Pizjuán.</p>
      </div>
      <div class="foo-col"><h5 data-i18n="foo.navigate">Navegar</h5><ul>
        <li><a href="concepto.html" data-i18n="nav.concept">Concepto</a></li>
        <li><a href="desayuno.html" data-i18n="nav.breakfast">Desayuno</a></li>
        <li><a href="tapas.html" data-i18n="nav.tapas">Tapas</a></li>
        <li><a href="streetfood.html" data-i18n="nav.streetfood">Street Food</a></li>
        <li><a href="local.html" data-i18n="nav.local">Local</a></li>
        <li><a href="resenas.html" data-i18n="nav.reviews">Reseñas</a></li>
        <li><a href="redes.html" data-i18n="nav.social">Redes</a></li>
      </ul></div>
      <div class="foo-col"><h5 data-i18n="foo.contact">Contacto</h5><ul>
        <li><a href="tel:+34641293669">+34 641 293 669</a></li>
        <li><a href="https://wa.me/34641293669" target="_blank" rel="noopener">WhatsApp</a></li>
        <li><a href="https://maps.google.com/?q=Av+Sanchez+Pizjuan+6+Sevilla" target="_blank" rel="noopener">Av. Sánchez Pizjuán, 6</a></li>
        <li><span>41009 Sevilla</span></li>
      </ul></div>
      <div class="foo-col"><h5 data-i18n="foo.social">Síguenos</h5><ul>
        <li><a href="https://instagram.com/bocatitosf" target="_blank" rel="noopener">Instagram</a></li>
        <li><a href="https://tiktok.com/@bocatitosf" target="_blank" rel="noopener">TikTok</a></li>
        <li><a href="https://facebook.com/bocatitosf" target="_blank" rel="noopener">Facebook</a></li>
        <li><a href="https://youtube.com/@bocatitosf" target="_blank" rel="noopener">YouTube</a></li>
      </ul></div>
    </div>
    <div class="foo-bot">
      <div>© <span id="yr"></span> Bocatitos Street Food ® · Sevilla · <span data-i18n="foo.legal">Todos los derechos reservados.</span></div>
      <div class="socials">
        <a href="https://instagram.com/bocatitosf" target="_blank" rel="noopener" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4a3.7 3.7 0 0 1-1.4-.9 3.7 3.7 0 0 1-.9-1.4c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.3-.1 1.7-.1 4.9-.1zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4zm5.2-3.2a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4z"/></svg></a>
        <a href="https://tiktok.com/@bocatitosf" target="_blank" rel="noopener" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 5.8c-.9-.9-1.4-2.2-1.4-3.5h-3.4v13.8a2.7 2.7 0 0 1-5.4 0 2.7 2.7 0 0 1 3.5-2.6V10a6 6 0 1 0 5.3 6V8.6a8 8 0 0 0 4.8 1.5V6.7c-1.4 0-2.6-.4-3.4-.9z"/></svg></a>
        <a href="https://facebook.com/bocatitosf" target="_blank" rel="noopener" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg></a>
      </div>
    </div>
  </div>`;
}

function mountChrome(){
  const active = document.body.dataset.page || 'home';
  const head = $('#chrome-head'); if(head) head.innerHTML = renderHead(active);
  const foot = $('#chrome-foot'); if(foot) foot.innerHTML = renderFoot();

  if(!$('.float-cta')){
    const f = document.createElement('div');
    f.className = 'float-cta';
    f.innerHTML = `
      <a href="streetfood.html" aria-label="Street Food">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 7h16M4 12h16M4 17h10"/></svg>
        <span>Carta</span>
      </a>
      <a class="wapp" href="${WA}" target="_blank" rel="noopener" aria-label="WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.5 11.5 0 0 0 3.6 19l-1.1 4 4.1-1.1A11.5 11.5 0 1 0 20.5 3.5Z"/></svg>
        <span>WhatsApp</span>
      </a>`;
    document.body.appendChild(f);
  }
}

/* ---------- Header scroll effect ---------- */
function mountHeaderScroll(){
  const h = $('header.chrome'); if(!h) return;
  const onScroll = () => h.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });
}

/* ---------- Hero grain overlay (vídeo de fondo en HTML, sin collage) ---------- */
function mountHeroCollage(){
  const bg = $('.hero-bg'); if(!bg) return;
  if($('.grain', bg)) return;
  const grain = document.createElement('div');
  grain.className = 'grain';
  bg.appendChild(grain);
}

/* ---------- Hero floaters (polaroids clicables con rotación cada 8s) ---------- */
function mountHeroFloaters(){
  const hero = $('.hero'); if(!hero) return;
  if($('.hero-floaters', hero)) return;
  const FLOATERS = [
    {
      cls:'f1', tag:'Smash · 17', href:'streetfood.html#smash',
      imgs:[
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=700&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=700&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=700&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=700&q=80&auto=format&fit=crop',
      ]
    },
    {
      cls:'f2', tag:'Desayuno', href:'desayuno.html',
      imgs:[
        'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=700&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=700&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=700&q=80&auto=format&fit=crop',
      ]
    },
    {
      cls:'f3', tag:'Tapas', href:'tapas.html',
      imgs:[
        'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=700&q=80&auto=format&fit=crop',
      ]
    },
    {
      cls:'f4', tag:'Bocata', href:'streetfood.html#bocatas',
      imgs:[
        'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=700&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=700&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1559054663-e8d23213f55c?w=700&q=80&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1521305916504-4a1121188589?w=700&q=80&auto=format&fit=crop',
      ]
    },
  ];

  const wrap = document.createElement('div');
  wrap.className = 'hero-floaters';
  wrap.innerHTML = FLOATERS.map(f => `
    <a class="floater ${f.cls}" href="${f.href}" data-tag="${f.tag}" aria-label="Ver carta de ${f.tag}">
      <span class="floater-img active" style="background-image:url('${f.imgs[0]}')"></span>
      <span class="floater-img" style="background-image:url('${f.imgs[1] || f.imgs[0]}')"></span>
      <span class="floater-cta">Ver carta →</span>
    </a>`).join('');
  hero.appendChild(wrap);

  /* Rotación de imágenes con crossfade */
  const state = FLOATERS.map(() => ({ idx:0, layer:0 }));
  setInterval(() => {
    $$('.floater').forEach((el,i) => {
      const data = FLOATERS[i]; if(!data || data.imgs.length < 2) return;
      const s = state[i];
      s.idx = (s.idx + 1) % data.imgs.length;
      s.layer = 1 - s.layer;
      const layers = $$('.floater-img', el);
      layers[s.layer].style.backgroundImage = `url("${data.imgs[s.idx]}")`;
      layers[s.layer].classList.add('active');
      layers[1 - s.layer].classList.remove('active');
    });
  }, 7800);

  /* Parallax suave en los floaters al mover el ratón */
  if(window.matchMedia('(min-width:1100px)').matches){
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - .5) * 18;
      const y = (e.clientY / window.innerHeight - .5) * 18;
      $$('.floater').forEach((el,i) => {
        const f = (i % 2 === 0) ? 1 : -1;
        el.style.setProperty('--px', `${x*f}px`);
        el.style.setProperty('--py', `${y*f}px`);
      });
    });
  }
}

/* ---------- Scroll reveal ---------- */
function mountReveal(){
  const els = $$('.reveal'); if(!els.length) return;
  if(!('IntersectionObserver' in window)){ els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if(en.isIntersecting){
        en.target.classList.add('in');
        io.unobserve(en.target);
      }
    });
  }, { threshold:.15, rootMargin:'0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
}

/* ---------- Rotación dinámica de reseñas ---------- */
const REVIEWS = [
  { stars:5, initial:'M', name:'María L.',   meta:'Google Reviews · hace 2 semanas', text:'"Las mejores smash burgers de Sevilla. El pan se nota, las salsas son brutales. Pedid el TITO SANJI sí o sí."' },
  { stars:5, initial:'J', name:'Jorge R.',   meta:'Google Reviews · hace 1 mes',     text:'"Local pequeño pero un sabor enorme. He desayunado, comido tapa y cenado bocata aquí. Cariño en cada detalle."' },
  { stars:5, initial:'A', name:'Ana S.',     meta:'Google Reviews · hace 3 semanas', text:'"Trato familiar, ingredientes que se notan. Los hot dogs son los más buenos del barrio."' },
  { stars:5, initial:'D', name:'Daniel G.',  meta:'Google Reviews · hace 1 semana',  text:'"Vengo desde la facultad de medicina cada día. El café es brutal y los montaditos calientes son perfectos."' },
  { stars:5, initial:'P', name:'Pablo M.',   meta:'Google Reviews · hace 5 días',    text:'"Después del partido en Sánchez Pizjuán siempre paramos. El bocata de pringá te cambia la vida."' },
  { stars:5, initial:'C', name:'Carmen V.',  meta:'Google Reviews · hace 2 meses',   text:'"Hospitality 10/10. El dueño explica cada bocata como si fuera su hijo. Y los hace igual."' },
  { stars:4, initial:'L', name:'Lucía P.',   meta:'Google Reviews · hace 3 días',    text:'"Sitio pequeño así que no esperéis sentaros mucho. Pero el sabor compensa. Smash espectacular."' },
  { stars:5, initial:'I', name:'Iván R.',    meta:'Google Reviews · hace 2 meses',   text:'"De turismo en Sevilla y descubrimos esta joya gracias a Instagram. Volveremos seguro."' },
  { stars:5, initial:'R', name:'Rocío B.',   meta:'Google Reviews · hace 1 mes',     text:'"Tres comidas en uno. Mañana tostada, mediodía tapa, noche bocata. ¿Para qué ir a otro sitio?"' },
];

function renderReview(r){
  const stars = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
  return `
    <div class="tm-stars">${stars}</div>
    <p class="tm-text">${r.text}</p>
    <div class="tm-author">
      <div class="tm-av">${r.initial}</div>
      <div>
        <div class="tm-name">${r.name}</div>
        <div class="tm-meta">${r.meta}</div>
      </div>
    </div>`;
}

function mountReviewRotator(){
  const grid = $('#tmGrid'); if(!grid) return;
  const cards = $$('.tm-card', grid);
  if(cards.length < 3 || REVIEWS.length < 4) return;

  /* visible: índices que se están mostrando ahora; next: cola */
  const visible = [0, 1, 2];
  let next = 3;
  let paused = false;
  grid.addEventListener('mouseenter', () => paused = true);
  grid.addEventListener('mouseleave', () => paused = false);

  setInterval(() => {
    if(paused || document.hidden) return;
    /* elige un slot al azar (0, 1 ó 2) y mete la siguiente reseña */
    const slot = Math.floor(Math.random() * 3);
    const card = cards[slot];
    /* avanza next saltando los índices que ya se muestran */
    let safety = 0;
    while(visible.includes(next) && safety < REVIEWS.length){
      next = (next + 1) % REVIEWS.length;
      safety++;
    }
    const review = REVIEWS[next];
    visible[slot] = next;
    next = (next + 1) % REVIEWS.length;

    card.classList.add('swap-out');
    setTimeout(() => {
      card.innerHTML = renderReview(review);
      card.classList.remove('swap-out');
      card.classList.add('swap-in');
      setTimeout(() => card.classList.remove('swap-in'), 600);
    }, 420);
  }, 5800);
}

/* ---------- Hero video: forzar autoplay en móvil ---------- */
function mountHeroVideo(){
  const v = $('.hero-video'); if(!v) return;
  // iOS/Safari exige muted como PROPIEDAD (no basta el atributo) + playsinline
  v.muted = true; v.defaultMuted = true; v.playsInline = true;
  v.setAttribute('muted',''); v.setAttribute('playsinline','');
  const tryPlay = () => { const p = v.play(); if(p && p.catch) p.catch(() => {}); };
  tryPlay();
  // Reintenta tras la carga y en la 1ª interacción (cubre ahorro de datos / modo bajo consumo)
  window.addEventListener('load', tryPlay, { once:true });
  ['touchstart','pointerdown','click','scroll'].forEach(ev =>
    window.addEventListener(ev, tryPlay, { once:true, passive:true }));
  // Reintenta al volver a la pestaña
  document.addEventListener('visibilitychange', () => { if(!document.hidden) tryPlay(); });
}

/* ---------- Parallax sutil en el background del hero (scroll) ---------- */
function mountHeroParallax(){
  const bg = $('.hero-bg'); if(!bg) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if(y > window.innerHeight) return;
    bg.style.transform = `translateY(${y * .25}px)`;
  }, { passive:true });
}

/* ---------- LANG ---------- */
const FLAG_CC = { es:'es', en:'gb', fr:'fr', it:'it', de:'de' };
function flagImg(code){
  const cc = FLAG_CC[code] || code;
  return `<img class="lang-flag-img" src="https://flagcdn.com/w40/${cc}.png" srcset="https://flagcdn.com/w80/${cc}.png 2x" width="20" height="15" alt="" loading="lazy">`;
}
function mountLangDropdown(){
  const mount = $('#langMount'); if(!mount || typeof LANGS === 'undefined') return;
  mount.innerHTML = `
    <button id="langBtn" class="lang-btn" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Idioma">
      <span id="langCurrent" class="lang-current">${flagImg('es')}<span class="lang-code">ES</span></span>
      <svg class="lang-caret" viewBox="0 0 10 6" width="10" height="6"><path fill="currentColor" d="M0 0l5 6 5-6z"/></svg>
    </button>
    <ul id="langMenu" class="lang-menu" role="listbox" hidden>
      ${LANGS.map(l => `<li><button type="button" class="lang-opt" data-code="${l.code}" role="option">${flagImg(l.code)}<span class="lang-label">${l.label}</span><span class="lang-code-sm">${l.code.toUpperCase()}</span></button></li>`).join('')}
    </ul>`;
  const btn = $('#langBtn'), menu = $('#langMenu');
  const open  = () => { menu.hidden = false; btn.setAttribute('aria-expanded','true');  document.addEventListener('click', outside); };
  const close = () => { menu.hidden = true;  btn.setAttribute('aria-expanded','false'); document.removeEventListener('click', outside); };
  const outside = e => { if(!mount.contains(e.target)) close(); };
  btn.addEventListener('click', e => { e.stopPropagation(); menu.hidden ? open() : close(); });
  $$('.lang-opt', menu).forEach(o => o.addEventListener('click', () => { applyLang(o.dataset.code); close(); }));
}

function applyLang(lang){
  if(typeof T === 'undefined') return;
  if(!T[lang]) lang = 'es';
  document.documentElement.lang = lang;
  const d = T[lang];
  $$('[data-i18n]').forEach(el => { const k = el.getAttribute('data-i18n'); if(d[k] != null) el.textContent = d[k]; });
  $$('[data-i18n-html]').forEach(el => { const k = el.getAttribute('data-i18n-html'); if(d[k] != null) el.innerHTML = d[k]; });
  try { localStorage.setItem('bocatitos.lang', lang); } catch(_) {}
  const cur = $('#langCurrent');
  if(cur && typeof LANGS !== 'undefined'){
    const meta = LANGS.find(l => l.code === lang) || LANGS[0];
    cur.innerHTML = `${flagImg(meta.code)}<span class="lang-code">${meta.code.toUpperCase()}</span>`;
  }
  $$('.lang-opt').forEach(o => o.classList.toggle('active', o.dataset.code === lang));
}

function initialLang(){
  const u = new URLSearchParams(location.search).get('lang');
  if(typeof T === 'undefined') return 'es';
  if(u && T[u]) return u;
  try { const s = localStorage.getItem('bocatitos.lang'); if(s && T[s]) return s; } catch(_) {}
  const n = (navigator.language || 'es').slice(0,2).toLowerCase();
  return T[n] ? n : 'es';
}

/* ---------- Burger ---------- */
function mountBurger(){
  const b = $('#burger'), nav = $('nav.primary'); if(!b || !nav) return;
  b.addEventListener('click', () => nav.classList.toggle('open'));
  $$('nav.primary a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

/* ---------- Menu tabs ---------- */
function mountTabs(){
  const tabs = $$('.mtab'); if(!tabs.length) return;
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      $$('.cat-grid').forEach(g => {
        if(g.dataset.cat === cat){ g.removeAttribute('hidden'); g.scrollIntoView({ behavior:'smooth', block:'nearest' }); }
        else g.setAttribute('hidden','');
      });
    });
  });
  const cat = new URLSearchParams(location.search).get('cat');
  if(cat){ const t = Array.from(tabs).find(b => b.dataset.cat === cat); if(t) t.click(); }
}

/* ---------- Loader ---------- */
function mountLoader(){
  const l = $('#loader'); if(!l) return;
  window.addEventListener('load', () => setTimeout(() => l.classList.add('hide'), 250));
}

function mountYear(){ const y = $('#yr'); if(y) y.textContent = new Date().getFullYear(); }

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  mountChrome();
  mountHeaderScroll();
  mountHeroCollage();
  mountHeroFloaters();
  mountHeroVideo();
  mountHeroParallax();
  mountReveal();
  mountReviewRotator();
  mountLangDropdown();
  mountBurger();
  mountTabs();
  mountYear();
  mountLoader();
  applyLang(initialLang());
});
