/**
 * aiScanner.js
 * Módulo del Escáner Nutricional IA — conecta con la API de Gemini.
 *
 * CONFIGURACIÓN: Establece tu API Key de Gemini en la variable GEMINI_API_KEY
 * o pásala a través de una variable de entorno en Vite: import.meta.env.VITE_GEMINI_KEY
 */

const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_KEY ?? '';
const WHATSAPP_NUMBER = '51995309712';

export function initAiScanner() {
  const form    = document.getElementById('ai-form');
  const btnSubmit  = document.getElementById('btn-submit-ai');
  const loading    = document.getElementById('ai-loading');
  const resultBox  = document.getElementById('ai-result-box');
  const resultText = document.getElementById('ai-response-text');
  const errorBox   = document.getElementById('ai-error');
  const waBtn      = document.getElementById('ai-whatsapp-btn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const age  = document.getElementById('user-age')?.value;
    const goal = document.getElementById('user-goal')?.value;

    if (!age || !goal) return;

    // UI: loading state
    btnSubmit.disabled = true;
    loading.style.display    = 'block';
    resultBox.style.display  = 'none';
    errorBox.style.display   = 'none';

    const prompt = `Actúa como asesor experto de Immunotec. El cliente tiene ${age} años y su meta es: ${goal}. Recomienda UN producto de la lista (Immunocal Clásico, Platinum, Sport, Optimizer, Omega Gen V). Explica brevemente por qué. Formato: 2 párrafos cortos. Usa tags HTML <b> para resaltar el nombre del producto.`;

    try {
      if (!GEMINI_API_KEY) {
        throw new Error('API Key no configurada. Añade VITE_GEMINI_KEY en tu archivo .env');
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error('Respuesta inválida de la API');

      resultText.innerHTML = text.replace(/\n/g, '<br>');
      if (waBtn) {
        waBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola, la IA me recomendó un producto para ${goal}. ¿Me asesoras?`;
      }
      resultBox.style.display = 'block';

    } catch (err) {
      console.error('[AI Scanner]', err);
      errorBox.textContent = err.message.includes('API Key')
        ? err.message
        : 'Error al conectar con la IA. Intenta nuevamente.';
      errorBox.style.display = 'block';
    } finally {
      btnSubmit.disabled   = false;
      loading.style.display = 'none';
    }
  });
}

