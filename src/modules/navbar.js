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

  // --- Lógica de búsqueda Mobile ---
  const btnLimpiarMobile  = document.getElementById('btn-limpiar-mobile');
  const resultadosMobile  = document.getElementById('resultados-mobile');

  function handleMobileSearch(e) {
    if (e && e.type === 'submit') e.preventDefault();
    
    const term = inputBuscar?.value.trim().toLowerCase() ?? '';
    
    // Mostrar u ocultar la X
    if (term.length > 0) {
      btnLimpiarMobile?.classList.remove('hidden');
    } else {
      btnLimpiarMobile?.classList.add('hidden');
      resultadosMobile?.classList.add('hidden');
      return;
    }

    const targets = document.querySelectorAll('h2, h3, .producto-titulo, .product-title');
    let found = false;

    // Búsqueda en vivo
    targets.forEach(el => {
      if (el.textContent.toLowerCase().includes(term)) found = true;
    });

    if (!found) {
      resultadosMobile?.classList.remove('hidden');
    } else {
      resultadosMobile?.classList.add('hidden');
    }

    // Al presionar Enter (submit)
    if (e && e.type === 'submit' && found) {
      targets.forEach(el => {
        if (el.textContent.toLowerCase().includes(term)) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.style.transition = 'color 0.5s';
          el.style.color = '#0133a2';
          setTimeout(() => (el.style.color = ''), 2000);
        }
      });
      resultadosMobile?.classList.add('hidden');
      if (window.innerWidth < 768) formBusqueda?.classList.add('hidden');
    }
  }

  inputBuscar?.addEventListener('input', handleMobileSearch);
  formBusqueda?.addEventListener('submit', handleMobileSearch);

  btnLimpiarMobile?.addEventListener('click', () => {
    if (inputBuscar) inputBuscar.value = '';
    btnLimpiarMobile.classList.add('hidden');
    resultadosMobile?.classList.add('hidden');
    inputBuscar?.focus();
  });

  // --- Buscador Desktop ---
  const formBusquedaDesktop = document.getElementById('form-busqueda-desktop');
  const inputBuscarDesktop  = document.getElementById('buscador-desktop');
  const btnLimpiarDesktop   = document.getElementById('btn-limpiar-desktop');
  const resultadosDesktop   = document.getElementById('resultados-desktop');

  function handleDesktopSearch(e) {
    if (e && e.type === 'submit') e.preventDefault();
    
    const term = inputBuscarDesktop?.value.trim().toLowerCase() ?? '';
    
    // Mostrar u ocultar la X
    if (term.length > 0) {
      btnLimpiarDesktop?.classList.remove('hidden');
    } else {
      btnLimpiarDesktop?.classList.add('hidden');
      resultadosDesktop?.classList.add('hidden');
      return;
    }

    const targets = document.querySelectorAll('h2, h3, .producto-titulo, .product-title');
    let found = false;

    // Búsqueda en vivo para verificar si hay coincidencias
    targets.forEach(el => {
      if (el.textContent.toLowerCase().includes(term)) {
        found = true;
      }
    });

    if (!found) {
      resultadosDesktop?.classList.remove('hidden');
    } else {
      resultadosDesktop?.classList.add('hidden');
    }

    // Si el usuario presiona Enter (submit), hace scroll hacia el resultado
    if (e && e.type === 'submit' && found) {
      targets.forEach(el => {
        if (el.textContent.toLowerCase().includes(term)) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.style.transition = 'color 0.5s';
          el.style.color = '#0133a2';
          setTimeout(() => (el.style.color = ''), 2000);
        }
      });
      // Ocultamos el panel tras buscar
      resultadosDesktop?.classList.add('hidden');
    }
  }

  inputBuscarDesktop?.addEventListener('input', handleDesktopSearch);
  formBusquedaDesktop?.addEventListener('submit', handleDesktopSearch);

  // Limpiar el input al hacer clic en la X
  btnLimpiarDesktop?.addEventListener('click', () => {
    if (inputBuscarDesktop) inputBuscarDesktop.value = '';
    btnLimpiarDesktop.classList.add('hidden');
    resultadosDesktop?.classList.add('hidden');
    inputBuscarDesktop?.focus();
  });

  // Ocultar resultados si se hace clic fuera del buscador
  document.addEventListener('click', (e) => {
    if (!formBusquedaDesktop?.contains(e.target)) {
      resultadosDesktop?.classList.add('hidden');
    }
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

