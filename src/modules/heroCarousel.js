/**
 * heroCarousel.js
 * Carrusel multimedia del Hero: imágenes (+ videos opcionales).
 * Transiciona desde el canvas de partículas.
 */

// Lista de medios del Hero (desktop / mobile)
const MEDIA_DESKTOP = [
  { type: 'image', src: 'IMGS/portadaprincipal.jpg' },
  { type: 'image', src: 'IMGS/img31.jpg' },
  { type: 'image', src: 'IMGS/img29.jpg' },
  { type: 'image', src: 'IMGS/img30.jpg' },
  { type: 'image', src: 'IMGS/E.jpg' },
];

const MEDIA_MOBILE = [
  { type: 'image', src: 'IMGS/img18.jpg' },
  { type: 'image', src: 'IMGS/img31.jpg' },
  { type: 'image', src: 'IMGS/img29.jpg' },
  { type: 'image', src: 'IMGS/img30.jpg' },
];

const IMAGE_DURATION = 6000; // ms por imagen

export function initHeroCarousel(stopParticles) {
  const container   = document.getElementById('hero-media-container');
  const canvas      = document.getElementById('hero-canvas');
  const btnPrev     = document.getElementById('btn-prev');
  const btnNext     = document.getElementById('btn-next');
  const dots        = document.querySelectorAll('.hero-dot');

  if (!container) return;

  const isMobile = window.innerWidth <= 768;
  const mediaList = isMobile ? MEDIA_MOBILE : MEDIA_DESKTOP;

  // Construir elementos en el DOM
  mediaList.forEach((media, i) => {
    let el;
    if (media.type === 'video') {
      el = document.createElement('video');
      el.src        = media.src;
      el.muted      = true;
      el.playsInline = true;
      el.preload    = 'metadata';
      el.addEventListener('ended', next);
    } else {
      el = document.createElement('img');
      el.src = media.src;
      el.alt = `Immunotec slide ${i + 1}`;
    }
    el.className = 'hero-media-item';
    el.id        = `hero-media-${i}`;
    container.appendChild(el);
  });

  // Ocultar puntos excedentes
  dots.forEach((dot, i) => {
    if (i >= mediaList.length) dot.style.display = 'none';
  });

  let current   = 0;
  let timeoutId = null;

  function updateDots(idx) {
    dots.forEach((dot, i) => {
      dot.classList.toggle('opacity-100', i === idx);
      dot.classList.toggle('opacity-40',  i !== idx);
    });
  }

  function show(idx) {
    clearTimeout(timeoutId);
    document.querySelectorAll('.hero-media-item').forEach((el, i) => {
      el.classList.remove('active-media');
      if (el.tagName === 'VIDEO' && i !== idx) {
        el.pause();
        el.currentTime = 0;
      }
    });

    const el = document.getElementById(`hero-media-${idx}`);
    if (!el) return;

    el.classList.add('active-media');
    updateDots(idx);

    if (mediaList[idx].type === 'video') {
      el.play().catch(() => next());
    } else {
      timeoutId = setTimeout(next, IMAGE_DURATION);
    }
  }

  function next() {
    current = (current + 1) % mediaList.length;
    show(current);
  }

  function prev() {
    current = (current - 1 + mediaList.length) % mediaList.length;
    show(current);
  }

  btnNext?.addEventListener('click', next);
  btnPrev?.addEventListener('click', prev);

  dots.forEach(dot => {
    dot.addEventListener('click', e => {
      const idx = parseInt(e.currentTarget.getAttribute('data-index'));
      if (idx < mediaList.length) { current = idx; show(current); }
    });
  });

  // Transición: partículas → carrusel
  setTimeout(() => {
    canvas?.classList.add('fade-out');
    container.classList.add('fade-in');
    show(current);
    setTimeout(() => stopParticles?.(), 1500);
  }, 2900);
}

