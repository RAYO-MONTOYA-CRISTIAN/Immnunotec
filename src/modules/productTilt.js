/**
 * productTilt.js
 * Inicializa el efecto 3D Tilt en las tarjetas de producto.
 * Usa vanilla-tilt cargado desde CDN en el HTML.
 */
export function initProductTilt() {
  // VanillaTilt debe estar disponible globalmente via CDN
  if (typeof VanillaTilt === 'undefined') return;

  VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
    max:       15,
    speed:     400,
    glare:     true,
    'max-glare': 0.3,
  });
}

