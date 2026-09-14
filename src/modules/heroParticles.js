/**
 * heroParticles.js
 * Animación de partículas en canvas para el Hero — preservada del diseño original.
 */
export function initHeroParticles() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, particles;
  let running = true;

  function init() {
    const heroEl = document.getElementById('hero');
    width  = canvas.width  = window.innerWidth;
    height = canvas.height = heroEl ? heroEl.clientHeight : window.innerHeight;
    particles = [];

    const count = window.innerWidth > 768 ? 350 : 120;

    for (let i = 0; i < count; i++) {
      particles.push({
        angle:  Math.random() * Math.PI * 2,
        radius: Math.random() * Math.max(width, height) * 0.8,
        speed:  Math.random() * 0.002 + 0.001,
        size:   Math.random() * 2 + 0.5,
        color:  `rgba(56,189,248,${(Math.random() * 0.5 + 0.1).toFixed(2)})`,
      });
    }
  }

  function animate() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);

    const cx = width;
    const cy = height / 2;

    particles.forEach(p => {
      p.angle  += p.speed;
      p.radius -= 0.4;
      if (p.radius < 10) p.radius = Math.max(width, height) * 0.8;

      const x = cx - Math.cos(p.angle) * p.radius;
      const y = cy + Math.sin(p.angle) * p.radius;

      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });

    requestAnimationFrame(animate);
  }

  init();
  animate();
  window.addEventListener('resize', init);

  // Retorna función para detener el bucle cuando el carrusel tome el control
  return () => { running = false; };
}

