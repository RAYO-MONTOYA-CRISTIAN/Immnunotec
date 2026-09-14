/**
 * scrollReveal.js
 * Aplica el efecto reveal (fade + slide-up) a elementos con clase .reveal
 * usando IntersectionObserver para máximo rendimiento.
 */
export function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // cada elemento se activa una sola vez
        }
      });
    },
    { threshold: 0.08 }
  );

  reveals.forEach(el => observer.observe(el));
}

