/**
 * scrollReveal.js
 * Aplica el efecto reveal (fade + slide-up) a elementos con clase .reveal
 * usando IntersectionObserver para máximo rendimiento.
 * También inicializa los contadores animados (.counter[data-target]).
 */
export function initScrollReveal() {
  // — Reveal —
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    reveals.forEach(el => observer.observe(el));
  }

  // — Contadores animados —
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;

  const co = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      let n = 0;
      const step = Math.max(1, Math.ceil(target / 70));
      const timer = setInterval(() => {
        n = Math.min(n + step, target);
        el.textContent = n;
        if (n >= target) clearInterval(timer);
      }, 25);
      co.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => co.observe(c));
}

