/**
 * main.js — Orquestador principal
 * Importa y coordina todos los módulos en el orden correcto.
 */
import './styles/main.css';

import { initSplashScreen }  from './modules/splashScreen.js';
import { initNavbar }        from './modules/navbar.js';
import { initHeroParticles } from './modules/heroParticles.js';
import { initHeroCarousel }  from './modules/heroCarousel.js';
import { initProductTilt }   from './modules/productTilt.js';
import { initAiScanner }     from './modules/aiScanner.js';
import { initScrollReveal }  from './modules/scrollReveal.js';

document.addEventListener('DOMContentLoaded', () => {

  // 1. Navbar (siempre activo)
  initNavbar();

  // 2. Partículas del Hero (arrancan de inmediato)
  const stopParticles = initHeroParticles();

  // 3. Splash Screen → tras completarse, inicia el resto
  initSplashScreen(() => {
    // Scroll reveal (activa elementos ya visibles post-splash)
    initScrollReveal();
  });

  // 4. Carrusel (se auto-sincroniza con el splash internamente)
  initHeroCarousel(stopParticles);

  // 5. Efecto Tilt en productos (requiere VanillaTilt CDN cargado)
  if (document.readyState === 'complete') {
    initProductTilt();
  } else {
    window.addEventListener('load', initProductTilt);
  }

  // 6. Escáner IA
  initAiScanner();

  // 7. Formulario de contacto → WhatsApp
  document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name     = document.getElementById('cf-name')?.value?.trim();
    const phone    = document.getElementById('cf-phone')?.value?.trim();
    const interest = document.getElementById('cf-interest')?.value;
    if (!name || !phone || !interest) return;
    const msg = encodeURIComponent(
      `¡Hola! Soy ${name} (mi WhatsApp es ${phone}). Me interesa ${interest}. ¿Me das más información?`
    );
    window.open(`https://wa.me/51995309712?text=${msg}`, '_blank', 'noopener');
  });

});
