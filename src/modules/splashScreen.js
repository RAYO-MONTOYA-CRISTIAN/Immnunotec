/**
 * splashScreen.js
 * Gestiona la pantalla de carga inicial y la transición de entrada.
 */
export function initSplashScreen(onComplete) {
  const splash = document.getElementById('splash-screen');
  const body = document.body;

  if (!splash) {
    body.classList.remove('loading');
    onComplete?.();
    return;
  }

  setTimeout(() => {
    splash.classList.add('slide-up');
    body.classList.remove('loading');

    // Callback tras la transición completa (para iniciar reveal y carrusel)
    setTimeout(() => {
      onComplete?.();
    }, 100);
  }, 2800);
}

