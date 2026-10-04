/* =============================================================================
   TESTIMONIALS-SLIDER.JS — Carrusel de testimonios
   - 3 tarjetas visibles en escritorio, 1 en móvil
   - Auto-play cada 6 s con botón de pausa (WCAG 2.2.2)
   - Se pausa con hover, foco de teclado, toque o pestaña oculta
   - Respeta prefers-reduced-motion (sin auto-play)
============================================================================= */

(function () {
  'use strict';

  /* ── Configuración ── */
  const AUTOPLAY_MS   = 6000;   /* ms entre slides automáticos */
  const CARDS_DESKTOP = 3;      /* tarjetas visibles en ≥768px */
  const CARDS_MOBILE  = 1;      /* tarjetas visibles en <768px  */
  const GAP_PX        = 24;     /* debe coincidir con gap en CSS (1.5rem = 24px) */

  /* ── Referencias DOM ── */
  const viewport  = document.querySelector('.testi-viewport');
  const track     = document.getElementById('testiTrack');
  const dotsWrap  = document.getElementById('testiDots');
  const btnPrev   = document.getElementById('testiPrev');
  const btnNext   = document.getElementById('testiNext');
  const btnPause  = document.getElementById('testiPause');

  if (!viewport || !track || !dotsWrap) return; /* salida segura */

  const allCards  = Array.from(track.querySelectorAll('.testi-card'));
  const total     = allCards.length;

  if (total === 0) return;

  /* ── Estado ── */
  let perSlide    = calcPerSlide();   /* tarjetas por slide */
  let groupCount  = 0;                /* total de grupos */
  let current     = 0;               /* grupo activo (0-based) */
  let timer       = null;
  let touchStartX = 0;
  let userPaused  = false;            /* pausa explícita con el botón */

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) track.style.transition = 'none';

  /* ────────────────────────────────────────────────────────
     NÚCLEO: calcula anchos y aplica translate
  ──────────────────────────────────────────────────────── */
  function calcPerSlide() {
    return window.innerWidth < 768 ? CARDS_MOBILE : CARDS_DESKTOP;
  }

  /**
   * Asigna el ancho exacto en px a cada tarjeta y recalcula groupCount.
   * Se llama al iniciar y en cada resize.
   */
  function layout() {
    const viewW = viewport.clientWidth;
    /* ancho de cada tarjeta = (viewport - gaps entre tarjetas visibles) / perSlide */
    const cardW = (viewW - GAP_PX * (perSlide - 1)) / perSlide;

    allCards.forEach(card => { card.style.width = cardW + 'px'; });

    groupCount = Math.ceil(total / perSlide);

    /* ajusta current si quedó fuera de rango */
    if (current >= groupCount) current = groupCount - 1;

    buildDots();
    goTo(current, /* animate= */ false);
  }

  /**
   * Mueve el track al grupo indicado.
   * offset = grupo × (cardW + gap) × perSlide
   */
  function goTo(group, animate) {
    current = group;

    /* offset en px: saltar N tarjetas */
    const cardW  = allCards[0].offsetWidth;
    const offset = group * perSlide * (cardW + GAP_PX);

    if (animate === false) {
      /* sin transición para el layout inicial y resize */
      const prev = track.style.transition;
      track.style.transition = 'none';
      track.style.transform  = `translateX(-${offset}px)`;
      /* fuerza reflow y restaura transición */
      track.offsetHeight;
      track.style.transition = prev;
    } else {
      track.style.transform = `translateX(-${offset}px)`;
    }

    /* Solo las tarjetas visibles quedan expuestas a lectores de pantalla */
    allCards.forEach((card, i) => {
      const visible = Math.floor(i / perSlide) === current;
      card.setAttribute('aria-hidden', String(!visible));
    });

    updateDots();
    updateAriaLive();
  }

  /* ── Navegación ── */
  function next() {
    goTo(current < groupCount - 1 ? current + 1 : 0, true);
  }

  function prev() {
    goTo(current > 0 ? current - 1 : groupCount - 1, true);
  }

  /* ── Auto-play ── */
  function startAuto() {
    if (reducedMotion || userPaused) return;
    stopAuto();
    /* Avance automático: no se anuncia al lector de pantalla */
    timer = setInterval(() => { viewport.setAttribute('aria-live', 'off'); next(); }, AUTOPLAY_MS);
  }

  function stopAuto() {
    clearInterval(timer);
    timer = null;
  }

  /* ── Puntos indicadores ── */
  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < groupCount; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'testi-dot' + (i === current ? ' active' : '');
      dot.setAttribute('aria-label', `Grupo ${i + 1} de ${groupCount}`);
      dot.addEventListener('click', () => { manual(); goTo(i, true); resetAuto(); });
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    Array.from(dotsWrap.children).forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
      if (i === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  /* ── aria-live ── */
  function updateAriaLive() {
    viewport.setAttribute('aria-label',
      `Testimonios, grupo ${current + 1} de ${groupCount}`);
  }

  /* ── Reset auto-play tras interacción manual ── */
  function resetAuto() { stopAuto(); startAuto(); }

  /* Navegación manual: sí se anuncia el cambio (aria-live polite) */
  function manual() { viewport.setAttribute('aria-live', 'polite'); }

  /* ── Botón pausa / reproducir ── */
  function setPaused(paused) {
    userPaused = paused;
    if (!btnPause) return;
    btnPause.setAttribute('aria-label', paused ? 'Reproducir testimonios' : 'Pausar testimonios');
    btnPause.querySelector('.icon-pause')?.toggleAttribute('hidden', paused);
    btnPause.querySelector('.icon-play')?.toggleAttribute('hidden', !paused);
    paused ? stopAuto() : startAuto();
  }

  if (btnPause) {
    if (reducedMotion) btnPause.hidden = true;   /* sin auto-play, no hace falta */
    btnPause.addEventListener('click', () => setPaused(!userPaused));
  }

  /* ── Eventos ── */
  btnNext?.addEventListener('click', () => { manual(); next(); resetAuto(); });
  btnPrev?.addEventListener('click', () => { manual(); prev(); resetAuto(); });

  /* Pausa al hover y mientras el foco de teclado está en el carrusel */
  const section = viewport.closest('section') || viewport;
  section.addEventListener('mouseenter', stopAuto);
  section.addEventListener('mouseleave', startAuto);
  section.addEventListener('focusin', stopAuto);
  section.addEventListener('focusout', (e) => {
    if (!section.contains(e.relatedTarget)) startAuto();
  });

  /* Pausa cuando la pestaña no está visible */
  document.addEventListener('visibilitychange', () => {
    document.hidden ? stopAuto() : startAuto();
  });

  /* Touch / swipe */
  viewport.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
    stopAuto();
  }, { passive: true });

  viewport.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { manual(); dx < 0 ? next() : prev(); }
    startAuto();
  }, { passive: true });

  /* Resize: recalcula sin animación */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newPer = calcPerSlide();
      if (newPer !== perSlide) {
        perSlide  = newPer;
        current   = 0;
      }
      layout();
    }, 150);
  }, { passive: true });

  /* ── Inicialización ── */
  layout();
  startAuto();

})();