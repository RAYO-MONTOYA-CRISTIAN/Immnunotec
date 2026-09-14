/**
 * navbar.js
 * Gestiona: hamburguesa mobile, cierre de menú, buscador desplegable.
 */
export function initNavbar() {
  // --- Menú hamburguesa ---
  const btnOpen  = document.getElementById('btn-menu-mobile');
  const btnClose = document.getElementById('btn-close-menu');
  const menu     = document.getElementById('menu-mobile');

  function openMenu() {
    if (!menu) return;
    menu.classList.remove('hidden');
    menu.classList.add('flex');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!menu) return;
    menu.classList.add('hidden');
    menu.classList.remove('flex');
    document.body.style.overflow = '';
  }

  btnOpen?.addEventListener('click', openMenu);
  btnClose?.addEventListener('click', closeMenu);

  // Cerrar al hacer clic en un enlace
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // --- Buscador mobile ---
  const formBusqueda       = document.getElementById('form-busqueda');
  const inputBuscar        = document.getElementById('buscador-input');
  const btnToggleBuscador  = document.getElementById('btn-toggle-buscador');

  btnToggleBuscador?.addEventListener('click', (e) => {
    if (window.innerWidth >= 768) return;
    e.preventDefault();
    formBusqueda?.classList.toggle('hidden');
    if (!formBusqueda?.classList.contains('hidden')) {
      inputBuscar?.focus();
    }
  });

  // --- Lógica de búsqueda ---
  formBusqueda?.addEventListener('submit', (e) => {
    e.preventDefault();
    const term = inputBuscar?.value.trim().toLowerCase() ?? '';
    if (!term) return;

    const targets = document.querySelectorAll('h2, h3, .producto-titulo');
    let found = false;

    targets.forEach(el => {
      if (el.textContent.toLowerCase().includes(term)) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.transition = 'color 0.5s';
        el.style.color = '#0133a2';
        setTimeout(() => (el.style.color = ''), 2000);
        found = true;
      }
    });

    if (!found) showToast('Producto no encontrado. Intenta con otra palabra.');
    else if (window.innerWidth < 768) formBusqueda?.classList.add('hidden');
  });
}

function showToast(message) {
  document.getElementById('toast-busqueda')?.remove();

  const toast = document.createElement('div');
  toast.id = 'toast-busqueda';
  toast.className =
    'fixed top-20 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 ' +
    'rounded-md shadow-2xl z-[9999] text-sm font-bold text-center w-11/12 max-w-sm transition-opacity duration-300';
  toast.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i>${message}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

