/* =====================================================================
   BOCATITOS · PEDIDO POR WHATSAPP  (reunión con el cliente 13-08-2026)
   ---------------------------------------------------------------------
   El cliente monta el pedido en la web y al pulsar "Enviar" se le abre su
   WhatsApp con el pedido ya escrito; solo tiene que darle a enviar. El local
   lo recibe como un chat normal en su WhatsApp Business.

   SIN bot, SIN Meta Cloud API, SIN servidor: es un enlace wa.me. Coste 0 €.

   - Carrito en localStorage → sobrevive al cambio de página.
   - Personalización: quitar ingredientes y elegir media/entera.
   - Mesa por QR: ?mesa=L1 (L=local, T=terraza) se recuerda 3 h.
   - El mensaje va SIEMPRE en español porque lo lee la cocina, aunque el
     cliente navegue en otro idioma.
   ===================================================================== */
(function(){
  'use strict';

  var TEL       = '34641293669';           // el mismo que publica bocatitos.es
  var LS_CART   = 'bocatitos.pedido.v1';
  var LS_MESA   = 'bocatitos.mesa';
  var MAX_UD    = 9;

  var q  = function(s, r){ return (r || document).querySelector(s); };
  var qq = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- estado ---------------- */
  var cesta = [];
  try { cesta = JSON.parse(localStorage.getItem(LS_CART) || '[]') || []; } catch(e){ cesta = []; }
  var guardar = function(){ try { localStorage.setItem(LS_CART, JSON.stringify(cesta)); } catch(e){} };

  var mesaParam = new URLSearchParams(location.search).get('mesa');
  if(mesaParam && /^[a-z0-9-]{1,6}$/i.test(mesaParam)){
    try { localStorage.setItem(LS_MESA, JSON.stringify({ v: mesaParam.toUpperCase(), t: Date.now() })); } catch(e){}
  }
  function mesa(){
    try {
      var m = JSON.parse(localStorage.getItem(LS_MESA) || 'null');
      if(m && (Date.now() - m.t) < 3 * 60 * 60 * 1000) return m.v;
    } catch(e){}
    return null;
  }

  var eur   = function(n){ return n.toFixed(2).replace('.', ',') + ' €'; };
  var total = function(){ return cesta.reduce(function(s, l){ return s + l.precio * l.ud; }, 0); };
  var unidades = function(){ return cesta.reduce(function(s, l){ return s + l.ud; }, 0); };
  var esc = function(t){ return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };

  /* ---------------- interfaz ---------------- */
  function pintarChasis(){
    if(q('#pedidoDrawer')) return;
    var html =
      '<button id="pedidoFab" class="pedido-fab" type="button" hidden aria-label="Ver tu pedido">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 7h12l-1.2 12.2a1.6 1.6 0 0 1-1.6 1.4H8.8a1.6 1.6 0 0 1-1.6-1.4L6 7Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>' +
        '<span data-i18n="cart.title">Tu pedido</span><b class="pedido-num">0</b>' +
      '</button>' +
      '<div id="pedidoVelo" class="pedido-velo" hidden></div>' +
      '<aside id="pedidoDrawer" class="pedido-drawer" hidden role="dialog" aria-modal="true" aria-label="Tu pedido">' +
        '<header>' +
          '<h2 data-i18n="cart.title">Tu pedido</h2>' +
          '<button type="button" class="pedido-x" data-cerrar aria-label="Cerrar">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
          '</button>' +
        '</header>' +
        '<div class="pedido-vacio" data-vacio>' +
          '<p data-i18n="cart.empty">Aún no has añadido nada. Echa un ojo a la carta y elige lo que te apetezca.</p>' +
          '<a class="btn-mega" href="streetfood.html" data-i18n="cart.go">Ver la carta</a>' +
        '</div>' +
        '<div class="pedido-cuerpo" data-cuerpo hidden>' +
          '<p class="pedido-mesa" data-mesa hidden></p>' +
          '<ul class="pedido-lineas" data-lineas></ul>' +
          '<label class="pedido-nota">' +
            '<span data-i18n="cart.note">Nota para cocina (opcional)</span>' +
            '<textarea rows="2" maxlength="200" data-nota placeholder="Ej.: la tostada premium en mollete"></textarea>' +
          '</label>' +
        '</div>' +
        '<footer class="pedido-pie" data-pie hidden>' +
          '<div class="pedido-total"><span data-i18n="cart.total">Total</span><b data-total>0,00 €</b></div>' +
          '<button type="button" class="pedido-enviar" data-enviar>' +
            '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11.5 11.5 0 0 0 3.6 19l-1.1 4 4.1-1.1A11.5 11.5 0 1 0 20.5 3.5Z"/></svg>' +
            '<span data-i18n="cart.send">Enviar pedido por WhatsApp</span>' +
          '</button>' +
          '<p class="pedido-ayuda" data-i18n="cart.hint">Se abre tu WhatsApp con el pedido escrito. Solo tienes que darle a enviar.</p>' +
          '<button type="button" class="pedido-vaciar" data-vaciar data-i18n="cart.clear">Vaciar pedido</button>' +
        '</footer>' +
      '</aside>' +
      '<div id="pedidoModal" class="pedido-modal" hidden role="dialog" aria-modal="true">' +
        '<div class="pm-caja">' +
          '<header>' +
            '<div><span class="pm-ebrow" data-i18n="cart.custom">¿Lo personalizamos?</span><h3 data-pm-nombre>—</h3></div>' +
            '<button type="button" class="pedido-x" data-pm-cerrar aria-label="Cancelar">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
            '</button>' +
          '</header>' +
          '<div class="pm-cuerpo">' +
            '<div class="pm-tamanos" data-pm-tamanos hidden>' +
              '<button type="button" class="pm-tam" data-tam="media"><span data-i18n="cart.half">Media</span> · <span data-precio-media></span></button>' +
              '<button type="button" class="pm-tam activa" data-tam="entera"><span data-i18n="cart.whole">Entera</span> · <span data-precio-entera></span></button>' +
            '</div>' +
            '<div class="pm-ings" data-pm-ings hidden>' +
              '<p class="pm-hint" data-i18n="cart.uncheck">Desmarca lo que no quieras. Lo demás va completo.</p>' +
              '<ul data-pm-lista></ul>' +
            '</div>' +
            '<div class="pm-uds">' +
              '<span data-i18n="cart.qty">Cantidad</span>' +
              '<div class="pm-stepper">' +
                '<button type="button" data-ud="-1" aria-label="Menos">−</button>' +
                '<b data-pm-ud>1</b>' +
                '<button type="button" data-ud="1" aria-label="Más">+</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<footer><button type="button" class="pm-confirmar" data-pm-ok><span data-i18n="cart.add_ok">Añadir al pedido</span> · <span data-pm-precio></span></button></footer>' +
        '</div>' +
      '</div>';
    var cont = document.createElement('div');
    cont.innerHTML = html;
    while(cont.firstChild) document.body.appendChild(cont.firstChild);
  }

  /* ---------------- pintar ---------------- */
  function pintar(){
    var n = unidades();
    qq('.pedido-num, [data-pedido-num]').forEach(function(el){ el.textContent = n; });
    var fab = q('#pedidoFab');
    if(fab){ fab.hidden = (n === 0); }
    document.body.classList.toggle('con-pedido', n > 0);

    var hay = cesta.length > 0;
    var vacio = q('[data-vacio]'), cuerpo = q('[data-cuerpo]'), pie = q('[data-pie]');
    if(vacio)  vacio.hidden  = hay;
    if(cuerpo) cuerpo.hidden = !hay;
    if(pie)    pie.hidden    = !hay;

    var elMesa = q('[data-mesa]'), m = mesa();
    if(elMesa){ elMesa.hidden = !m; if(m) elMesa.textContent = '📍 Mesa ' + m; }

    var ul = q('[data-lineas]');
    if(ul){
      ul.innerHTML = cesta.map(function(l, i){
        var tam = l.tam ? ' <em>(' + l.tam + ')</em>' : '';
        var sin = (l.sin && l.sin.length) ? '<p class="pl-sin">· sin ' + esc(l.sin.join(' · sin ')) + '</p>' : '';
        return '<li>' +
          '<div class="pl-top"><span class="pl-nom">' + esc(l.nombre) + tam + '</span>' +
          '<button type="button" class="pl-x" data-quitar="' + i + '" aria-label="Quitar">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
          sin +
          '<div class="pl-bot"><div class="pm-stepper sm">' +
            '<button type="button" data-menos="' + i + '" aria-label="Menos">−</button><b>' + l.ud + '</b>' +
            '<button type="button" data-mas="' + i + '" aria-label="Más">+</button></div>' +
            '<span class="pl-precio">' + eur(l.precio * l.ud) + '</span></div>' +
        '</li>';
      }).join('');
    }
    var t = q('[data-total]'); if(t) t.textContent = eur(total());
  }

  /* ---------------- abrir / cerrar ---------------- */
  function abrir(){ pintar(); q('#pedidoVelo').hidden = false; q('#pedidoDrawer').hidden = false; document.body.style.overflow = 'hidden'; }
  function cerrar(){ q('#pedidoVelo').hidden = true; q('#pedidoDrawer').hidden = true; if(q('#pedidoModal').hidden) document.body.style.overflow = ''; }

  /* ---------------- modal de personalización ---------------- */
  var borrador = null;

  function precioUnidad(){ return borrador.tam === 'media' ? borrador.pMedia : borrador.pEntera; }
  function repintarModal(){
    q('[data-pm-ud]').textContent = borrador.ud;
    qq('.pm-tam').forEach(function(b){ b.classList.toggle('activa', b.dataset.tam === borrador.tam); });
    q('[data-pm-precio]').textContent = eur(precioUnidad() * borrador.ud);
  }
  function abrirModal(btn){
    var d = btn.dataset;
    var ings = (d.ing || '').split('|').map(function(s){ return s.trim(); }).filter(Boolean);
    borrador = {
      slug: d.slug, nombre: d.nombre,
      pEntera: parseFloat(d.precio),
      pMedia: d.precioMedia ? parseFloat(d.precioMedia) : null,
      ings: ings, tam: d.precioMedia ? 'entera' : null, ud: 1
    };
    q('[data-pm-nombre]').textContent = borrador.nombre;

    var tam = q('[data-pm-tamanos]');
    tam.hidden = !borrador.pMedia;
    if(borrador.pMedia){
      /* Ojo: los botones "Añadir" de la carta también llevan data-precio-media,
         así que hay que buscar DENTRO del modal o se escribe en el sitio
         equivocado y el precio de "Media" sale vacío. */
      q('[data-precio-media]', tam).textContent  = eur(borrador.pMedia);
      q('[data-precio-entera]', tam).textContent = eur(borrador.pEntera);
    }

    var caja = q('[data-pm-ings]'), lista = q('[data-pm-lista]');
    caja.hidden = ings.length === 0;
    lista.innerHTML = ings.map(function(ing, i){
      return '<li><label><input type="checkbox" checked data-i="' + i + '"><span>' + esc(ing) + '</span></label></li>';
    }).join('');

    repintarModal();
    q('#pedidoVelo').hidden = false;
    q('#pedidoModal').hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function cerrarModal(){
    q('#pedidoModal').hidden = true;
    if(q('#pedidoDrawer').hidden){ q('#pedidoVelo').hidden = true; document.body.style.overflow = ''; }
    borrador = null;
  }

  /* ---------------- eventos ---------------- */
  function eventos(){
    document.addEventListener('click', function(e){
      var t = e.target.closest ? e.target : e.target.parentElement;
      if(!t || !t.closest) return;

      if(t.closest('[data-add]')){ e.preventDefault(); abrirModal(t.closest('[data-add]')); return; }
      if(t.closest('#pedidoFab') || t.closest('[data-abrir-pedido]')){ e.preventDefault(); abrir(); return; }
      if(t.closest('[data-cerrar]')) cerrar();
      if(t.closest('[data-pm-cerrar]')) cerrarModal();
      if(t.closest('#pedidoVelo')){ cerrar(); cerrarModal(); }

      var tam = t.closest('.pm-tam');
      if(tam && borrador){ borrador.tam = tam.dataset.tam; repintarModal(); }

      var ud = t.closest('[data-ud]');
      if(ud && borrador){
        borrador.ud = Math.min(MAX_UD, Math.max(1, borrador.ud + parseInt(ud.dataset.ud, 10)));
        repintarModal();
      }

      if(t.closest('[data-pm-ok]') && borrador){
        var sin = [];
        qq('[data-pm-lista] input').forEach(function(cb){ if(!cb.checked) sin.push(borrador.ings[+cb.dataset.i]); });
        var nueva = { slug: borrador.slug, nombre: borrador.nombre, precio: precioUnidad(),
                      tam: borrador.tam, ud: borrador.ud, sin: sin };
        var clave = function(l){ return l.slug + '|' + (l.tam || '') + '|' + (l.sin || []).join(','); };
        var igual = cesta.filter(function(l){ return clave(l) === clave(nueva); })[0];
        if(igual) igual.ud = Math.min(MAX_UD, igual.ud + nueva.ud); else cesta.push(nueva);
        guardar(); cerrarModal(); abrir();
        return;
      }

      var quitar = t.closest('[data-quitar]');
      if(quitar){ cesta.splice(+quitar.dataset.quitar, 1); guardar(); pintar(); }
      var menos = t.closest('[data-menos]');
      if(menos){ var im = +menos.dataset.menos; if(cesta[im].ud > 1) cesta[im].ud--; else cesta.splice(im, 1); guardar(); pintar(); }
      var mas = t.closest('[data-mas]');
      if(mas){ var ia = +mas.dataset.mas; if(cesta[ia].ud < MAX_UD) cesta[ia].ud++; guardar(); pintar(); }
      if(t.closest('[data-vaciar]')){ cesta = []; guardar(); pintar(); }
      if(t.closest('[data-enviar]')) enviar();
    });

    document.addEventListener('keydown', function(e){ if(e.key === 'Escape'){ cerrar(); cerrarModal(); } });
  }

  /* ---------------- enviar a WhatsApp ---------------- */
  function enviar(){
    if(!cesta.length) return;
    var m = mesa();
    var nota = (q('[data-nota]') && q('[data-nota]').value || '').trim().slice(0, 200);
    var raya = '——————————';
    var L = ['🛒 *PEDIDO BOCATITOS*'];
    if(m) L.push('📍 Mesa *' + m + '*');
    L.push(raya);
    cesta.forEach(function(l){
      L.push(l.ud + '× *' + l.nombre + '*' + (l.tam ? ' (' + l.tam + ')' : '') + ' — ' + eur(l.precio * l.ud));
      if(l.sin && l.sin.length) L.push('   ⚠️ sin ' + l.sin.join(', sin '));
    });
    L.push(raya);
    L.push('💶 *TOTAL: ' + eur(total()) + '*');
    if(nota) L.push('📝 Nota: ' + nota);
    window.open('https://wa.me/' + TEL + '?text=' + encodeURIComponent(L.join('\n')), '_blank', 'noopener');
  }

  /* =====================================================================
     POP-UP DE DELIVERY · viernes, sábado y domingo por la tarde
     "que salte una pantalla indicando delivery, llegamos a tu casa en dos
     kilómetros… y que el cliente bien lo cierre para continuar o le dé clic
     para hacer el pedido". Una vez por sesión. Forzar con ?popup=1
     ===================================================================== */
  function popupDelivery(){
    var KEY = 'bocatitos.popup.visto';
    var forzado = new URLSearchParams(location.search).has('popup');
    if(!forzado){
      try { if(sessionStorage.getItem(KEY)) return; } catch(e){}
      var d = new Date(), dia = d.getDay();          // 0 dom · 5 vie · 6 sáb
      if(!(dia === 5 || dia === 6 || dia === 0)) return;
      if(d.getHours() < 17) return;
    }

    var wrap = document.createElement('div');
    wrap.className = 'dpop';
    wrap.innerHTML =
      '<div class="dpop-caja">' +
        '<button type="button" class="dpop-x" data-dpop-cerrar aria-label="Cerrar">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '<div class="dpop-media">' +
          '<video autoplay muted loop playsinline poster="assets/hero-poster.jpg"><source src="assets/hero-video.mp4?v=2" type="video/mp4"></video>' +
          '<span class="dpop-tag" data-i18n="pop.eyebrow">Esta noche · Delivery</span>' +
        '</div>' +
        '<div class="dpop-txt">' +
          '<h2 data-i18n="pop.title">Bocatitos, en tu casa</h2>' +
          '<p data-i18n="pop.lead">Viernes, sábado y domingo por la noche repartimos a domicilio a menos de 2 km. Smash burgers, bocatas y hot dogs recién hechos.</p>' +
          '<a class="btn-mega" href="streetfood.html" data-i18n="pop.cta">Pedir ahora</a>' +
          '<button type="button" class="dpop-seguir" data-dpop-cerrar data-i18n="pop.close">Seguir a la web</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);
    try { sessionStorage.setItem(KEY, '1'); } catch(e){}

    var quitar = function(){ wrap.remove(); document.body.style.overflow = ''; };
    document.body.style.overflow = 'hidden';
    qq('[data-dpop-cerrar]', wrap).forEach(function(b){ b.addEventListener('click', quitar); });
    wrap.addEventListener('click', function(e){ if(e.target === wrap) quitar(); });
    document.addEventListener('keydown', function(e){ if(e.key === 'Escape') quitar(); }, { once:true });
  }

  /* ---------------- arranque ---------------- */
  document.addEventListener('DOMContentLoaded', function(){
    pintarChasis();
    eventos();
    pintar();
    setTimeout(popupDelivery, 1200);   // deja respirar al hero antes de saltar
  });
})();
