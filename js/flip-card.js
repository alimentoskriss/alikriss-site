/* =============================================================================
   FLIP-CARD.JS — Tarjeta giratoria genérica para empaques de producto
   
   USO en HTML:
     <div data-flip-container>
       <div data-flip-card>
         <div data-flip-front> <img ...> </div>
         <div data-flip-back>  <img ...> </div>
       </div>
       <button type="button" data-flip-trigger
         data-label-front="Ver información nutricional"
         data-label-back="Ver frente del empaque">
         <svg class="icon" aria-hidden="true"><use href="#i-rotate"/></svg>
         <span data-flip-label>Ver información nutricional</span>
       </button>
     </div>
   
   Para agregar un segundo producto, simplemente añade otro bloque
   con los mismos atributos data-flip-* — este script los maneja todos.
   
   Clases CSS gestionadas (definidas en components.css):
     .flip-card--flipped   → estado girado
============================================================================= */

(function () {
  'use strict';

  /* Respeta prefers-reduced-motion */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Encuentra todos los contenedores flip de la página */
  document.querySelectorAll('[data-flip-container]').forEach((container) => {
    const card    = container.querySelector('[data-flip-card]');
    const trigger = container.querySelector('[data-flip-trigger]');

    if (!card || !trigger) return; /* seguridad */

    const labelFront = trigger.dataset.labelFront || 'Ver información nutricional';
    const labelBack  = trigger.dataset.labelBack  || 'Ver frente del empaque';

    /* El texto vive en un <span data-flip-label> para no borrar el ícono SVG */
    const label = trigger.querySelector('[data-flip-label]') || trigger;

    const front = container.querySelector('[data-flip-front]');
    const back  = container.querySelector('[data-flip-back]');

    let flipped = false;

    /* Función de giro */
    const flip = () => {
      flipped = !flipped;

      if (reducedMotion) {
        /* Sin animación: intercambia directamente la visibilidad */
        if (front && back) {
          front.style.display = flipped ? 'none' : 'flex';
          back.style.display  = flipped ? 'flex' : 'none';
        }
      } else {
        card.classList.toggle('flip-card--flipped', flipped);
      }

      /* Solo la cara visible queda expuesta a lectores de pantalla */
      if (front) front.setAttribute('aria-hidden', String(flipped));
      if (back)  back.setAttribute('aria-hidden', String(!flipped));

      label.textContent = flipped ? labelBack : labelFront;
    };

    /* Clic en la imagen: atajo para ratón/táctil (el <button> es el control accesible) */
    container.querySelector('.flip-container')?.addEventListener('click', flip);

    trigger.addEventListener('click', (e) => {
      e.stopPropagation(); /* evita doble disparo si el botón está dentro del container */
      flip();
    });
  });

})();
