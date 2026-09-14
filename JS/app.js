document.addEventListener('DOMContentLoaded', () => {

    // --- 1. LÓGICA DEL PRELOADER / SPLASH SCREEN ---
    const splashScreen = document.getElementById('splash-screen');
    const body = document.body;

    // Tiempo de carga (2.8 segundos) para mostrar la animación completa
    setTimeout(() => {
        if (splashScreen) splashScreen.classList.add('slide-up');
        body.classList.remove('loading');
    }, 2800);

    // --- 2. LÓGICA DE BARRA DE NAVEGACIÓN Y SCROLL REVEAL ---
    const nav = document.getElementById('navbar');
    const reveals = document.querySelectorAll('.reveal');

    // Creamos una función que hace ambas cosas: pinta el menú y aparece el texto
    function manejarScroll() {
        // A. Cambiar color del Navbar de transparente a Azul

        /* if (nav) {
              if (window.scrollY > 50) {
                  nav.classList.remove('bg-transparent', 'border-transparent');
                  // Usamos el color corporativo bg-[#0133a2]
                  nav.classList.add('bg-[#0133a2]', 'backdrop-blur-md', 'border-white/10', 'shadow-md');
              } else {
                  nav.classList.add('bg-transparent', 'border-transparent');
                  // Aseguramos de remover el color corporativo al volver arriba
                  nav.classList.remove('bg-[#0133a2]', 'backdrop-blur-md', 'border-white/10', 'shadow-md');
              }
          }*/

        // B. Mostrar los textos y productos (efecto reveal)
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            // Si el elemento está entrando en la pantalla, lo hacemos visible
            if (elementTop < windowHeight - 50) {
                el.classList.add('active');
            }
        });
    }

    // Escuchamos cada vez que el usuario baja o sube la pantalla
    window.addEventListener('scroll', manejarScroll);

    // IMPORTANTE: Ejecutamos el reveal apenas termina la pantalla de carga (2.9s)
    // Para que la portada principal no espere a que hagas scroll para aparecer
    setTimeout(() => {
        manejarScroll();
    }, 2900);

    // --- 3. ANIMACIÓN DE PARTÍCULAS ORIGINAL Y PRESERVADA (HERO) ---
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, particles;
    let runParticles = true; // Interruptor de rendimiento para apagar el bucle de dibujo cuando no sea visible

    function initParticles() {
        if (!canvas) return;
        width = canvas.width = window.innerWidth;
        height = canvas.height = document.getElementById('hero').clientHeight;
        particles = [];
        const numParticles = window.innerWidth > 768 ? 400 : 150;

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                angle: Math.random() * Math.PI * 2,
                radius: Math.random() * (width > height ? width : height) * 0.8,
                speed: (Math.random() * 0.002) + 0.001,
                size: Math.random() * 2 + 0.5,
                color: `rgba(56, 189, 248, ${Math.random() * 0.5 + 0.1})`
            });
        }
    }

    function animateParticles() {
        if (!runParticles) return; // Si runParticles pasa a false, se detiene el bucle liberando CPU/GPU
        ctx.clearRect(0, 0, width, height);
        const centerX = width;
        const centerY = height / 2;

        particles.forEach(p => {
            p.angle += p.speed;
            p.radius -= 0.5;
            if (p.radius < 10) p.radius = (width > height ? width : height) * 0.8;

            const x = centerX - (Math.cos(p.angle) * p.radius);
            const y = centerY + (Math.sin(p.angle) * p.radius);

            ctx.beginPath();
            ctx.arc(x, y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
    window.addEventListener('resize', initParticles);


    // --- 3.1 CARRUSEL MULTIMEDIA DINÁMICO ---

    // 1. Lista EXCLUSIVA PARA COMPUTADORA (Tus imágenes y videos normales)
    const heroMediaDesktop = [
        { type: 'image', src: 'IMGS/portadaprincipal.jpg' },
        // AQUÍ AGREGAMOS LA DIAPOSITIVA DE 3 IMÁGENES
        { 
            type: 'group', 
            images: [
                'IMGS/img31.jpg', // Reemplaza con tu 1ra imagen (ej. Aminoácido)
                'IMGS/img29.jpg', // Reemplaza con tu 2da imagen (ej. Proteína)
                'IMGS/img30.jpg'  // Reemplaza con tu 3ra imagen (ej. Termogénico)
            ] 
        },
        { type: 'video', src: 'IMGS/IMMUNOTEC_VIDEO_PANAMA.mp4' },
        { type: 'image', src: 'IMGS/E.jpg' },
    ];

    // 2. Lista EXCLUSIVA PARA CELULAR (Tus afiches e infografíass)
    const heroMediaMobile = [
        { type: 'image', src: 'IMGS/img18.jpg' }, // 1er afiche
        { type: 'image', src: 'IMGS/img31.jpg' }, // 1er afiche
        { type: 'image', src: 'IMGS/img29.jpg' }, // 1er afiche
        { type: 'image', src: 'IMGS/img30.jpg' }, // 1er afiche
        { type: 'video', src: 'IMGS/IMMUNOTEC__CELULAR.mp4' },  // 3er afiche
    ];

    // 3. El sistema detecta el tamaño de la pantalla
    const isMobile = window.innerWidth <= 768;
    const heroMediaList = isMobile ? heroMediaMobile : heroMediaDesktop;

    const mediaContainer = document.getElementById('hero-media-container');

    // NUEVO: Seleccionamos las flechas y los puntos del HTML
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const dots = document.querySelectorAll('.hero-dot');

    let currentMediaIndex = 0;

    // CONFIGURACIÓN DE TIEMPOS (en milisegundos)
    const IMAGE_DURATION = 6000;      // Cuánto dura cada imagen en pantalla (6 segundos)
    const PARTICLES_DURATION = 0;

    let timeoutId;

    if (mediaContainer && heroMediaList.length > 0) {

        // Generar dinámicamente los elementos multimedia en el DOM
        heroMediaList.forEach((media, index) => {
            let el;
            if (media.type === 'video') {
                el = document.createElement('video');
                el.src = media.src;
                el.muted = true;
                el.playsInline = true;
                el.preload = 'auto';
                el.addEventListener('ended', nextMedia);
                el.className = 'hero-media-item';
            } else if (media.type === 'group') {
                // Crea el contenedor principal para las 3 imágenes
                el = document.createElement('div');
                el.className = 'hero-media-item hero-media-group';
                
                // Añade cada imagen con su capa oscura y botón
                media.images.forEach(imgSrc => {
                    // 1. Contenedor de la tarjeta
                    const card = document.createElement('div');
                    card.className = 'promo-card';
                    
                    // 2. Imagen
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    
                    // 3. Capa oscura
                    const overlay = document.createElement('div');
                    overlay.className = 'promo-overlay';
                    
                    // 4. Botón "Comprar"
                    const btn = document.createElement('a');
                    btn.className = 'promo-btn';
                    btn.href = '#'; // Aquí puedes poner el link de WhatsApp o del carrito
                    btn.textContent = 'COMPRAR';
                    
                    // Ensamblar todo
                    card.appendChild(img);
                    card.appendChild(overlay);
                    card.appendChild(btn);
                    el.appendChild(card);
                });
            } else {
                el = document.createElement('img');
                el.src = media.src;
                el.className = 'hero-media-item';
            }

            el.id = `hero-media-${index}`;
            mediaContainer.appendChild(el);
        });

        // Ocultar los puntos sobrantes si la lista de celular tiene menos elementos
        dots.forEach((dot, index) => {
            if (index >= heroMediaList.length) {
                dot.style.display = 'none';
            }
        });

        // NUEVO: Función para actualizar visualmente los puntos
        function updateDots(index) {
            dots.forEach((dot, i) => {
                if (i === index) {
                    dot.classList.remove('opacity-40');
                    dot.classList.add('opacity-100');
                } else {
                    dot.classList.add('opacity-40');
                    dot.classList.remove('opacity-100');
                }
            });
        }

        // Función para activar y reproducir la diapositiva correspondiente
        function showMedia(index) {
            clearTimeout(timeoutId);

            const allItems = document.querySelectorAll('.hero-media-item');
            allItems.forEach((item, i) => {
                item.classList.remove('active-media');
                if (item.tagName === 'VIDEO' && i !== index) {
                    item.pause();
                    item.currentTime = 0; // Reiniciamos el video
                }
            });

            const currentItem = document.getElementById(`hero-media-${index}`);
            if (currentItem) {
                currentItem.classList.add('active-media');
                updateDots(index); // Cambiamos el punto iluminado

                const mediaData = heroMediaList[index];
                if (mediaData.type === 'video') {
                    currentItem.play().catch(e => {
                        console.warn("Autoplay bloqueado:", e);
                        nextMedia();
                    });
                } else {
                    timeoutId = setTimeout(nextMedia, IMAGE_DURATION);
                }
            }
        }

        // Funciones de navegación
        function nextMedia() {
            currentMediaIndex++;
            if (currentMediaIndex >= heroMediaList.length) {
                currentMediaIndex = 0;
            }
            showMedia(currentMediaIndex);
        }

        function prevMedia() {
            currentMediaIndex--;
            if (currentMediaIndex < 0) {
                currentMediaIndex = heroMediaList.length - 1;
            }
            showMedia(currentMediaIndex);
        }

        // NUEVO: Escuchar clics en flechas
        if (btnNext) btnNext.addEventListener('click', nextMedia);
        if (btnPrev) btnPrev.addEventListener('click', prevMedia);

        // NUEVO: Escuchar clics en cada punto
        dots.forEach((dot) => {
            dot.addEventListener('click', (e) => {
                const clickedIndex = parseInt(e.target.getAttribute('data-index'));
                if (clickedIndex < heroMediaList.length) {
                    currentMediaIndex = clickedIndex;
                    showMedia(currentMediaIndex);
                }
            });
        });

        // Programar la transición inicial
        setTimeout(() => {
            const canvas = document.getElementById('hero-canvas');
            if (canvas) {
                canvas.classList.add('fade-out');
            }

            mediaContainer.classList.add('fade-in');
            showMedia(currentMediaIndex);

            setTimeout(() => {
                runParticles = false;
            }, 1500);

        }, 2800 + PARTICLES_DURATION);
    }
    // --- 4. THREE.JS ENGINE PARA PRODUCTOS ---
    const canvas3DContainers = document.querySelectorAll('.canvas-3d-wrapper');
    const renderersData = [];

    if (window.THREE && canvas3DContainers.length > 0) {

        function createTexture(textMain, bgColor, textColor, isBottle = false) {
            const c = document.createElement('canvas');
            c.width = isBottle ? 512 : 512;
            c.height = isBottle ? 256 : 1024;
            const ctxx = c.getContext('2d');

            ctxx.fillStyle = bgColor;
            ctxx.fillRect(0, 0, c.width, c.height);

            ctxx.fillStyle = textColor;
            ctxx.textAlign = 'center';

            if (isBottle) {
                ctxx.font = 'bold 60px Space Grotesk';
                ctxx.fillText('Immunotec', c.width / 2, 80);
                ctxx.font = '80px Inter';
                ctxx.fillText(textMain, c.width / 2, 160);
            } else {
                ctxx.fillStyle = 'rgba(0,0,0,0.1)';
                ctxx.fillRect(0, c.height - 150, c.width, 150);

                ctxx.fillStyle = textColor;
                ctxx.font = 'bold 50px Space Grotesk';
                ctxx.fillText('Immunotec', c.width / 2, 150);

                ctxx.font = 'bold 80px Inter';
                ctxx.fillText(textMain, c.width / 2, 400);

                ctxx.font = '30px Inter';
                ctxx.fillText('Suplemento', c.width / 2, 600);
            }
            return new THREE.CanvasTexture(c);
        }

        canvas3DContainers.forEach(container => {
            const color = container.getAttribute('data-color');
            const text = container.getAttribute('data-text');
            const txtColor = container.getAttribute('data-textcolor');
            const shape = container.getAttribute('data-shape');

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
            camera.position.z = shape === 'bottle' ? 8 : 10;

            const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);

            scene.add(new THREE.AmbientLight(0xffffff, 0.8));
            const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
            dirLight.position.set(5, 5, 5);
            scene.add(dirLight);

            let geometry, materials, mesh;

            if (shape === 'bottle') {
                geometry = new THREE.CylinderGeometry(1.2, 1.2, 3.5, 32);
                const tex = createTexture(text, color, txtColor, true);
                const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.3 });
                const topMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
                materials = [mat, topMat, topMat];
                mesh = new THREE.Mesh(geometry, materials);

                const capGeo = new THREE.CylinderGeometry(1.25, 1.25, 0.5, 32);
                const cap = new THREE.Mesh(capGeo, topMat);
                cap.position.y = 2;
                mesh.add(cap);
            } else {
                geometry = new THREE.BoxGeometry(3, 4.5, 1.5);
                const texFront = createTexture(text, color, txtColor, false);
                const texSide = createTexture('', color, txtColor, false);
                const matFront = new THREE.MeshStandardMaterial({ map: texFront, roughness: 0.5 });
                const matSide = new THREE.MeshStandardMaterial({ color: color, roughness: 0.5 });
                materials = [matSide, matSide, matSide, matSide, matFront, matSide];
                mesh = new THREE.Mesh(geometry, materials);
            }

            mesh.rotation.x = 0.1;
            mesh.rotation.y = -0.2;
            scene.add(mesh);

            const controls = new THREE.OrbitControls(camera, renderer.domElement);
            controls.enableZoom = false; controls.enablePan = false;
            controls.autoRotate = true; controls.autoRotateSpeed = 2.0;

            const resizeObserver = new ResizeObserver(() => {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            });
            resizeObserver.observe(container);

            renderersData.push({ element: container, scene, camera, renderer, mesh, controls, active: false });
        });

        const canvasObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                const data = renderersData.find(r => r.element === entry.target);
                if (data) data.active = entry.isIntersecting;
            });
        }, { threshold: 0.1 });

        renderersData.forEach(data => canvasObserver.observe(data.element));

        function animate3D() {
            requestAnimationFrame(animate3D);
            renderersData.forEach(data => {
                if (data.active) {
                    data.controls.update();
                    data.mesh.position.y = Math.sin(Date.now() * 0.002) * 0.1;
                    data.renderer.render(data.scene, data.camera);
                }
            });
        }
        animate3D();
    }

    // --- 5. GEMINI API (IA) ---
    const aiForm = document.getElementById('ai-form');
    const apiKey = ""; // API KEY INYECTADA POR ENTORNO

    aiForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const age = document.getElementById('user-age').value;
        const goal = document.getElementById('user-goal').value;

        const btn = document.getElementById('btn-submit-ai');
        const loading = document.getElementById('ai-loading');
        const resBox = document.getElementById('ai-result-box');
        const resText = document.getElementById('ai-response-text');
        const errBox = document.getElementById('ai-error');

        btn.disabled = true; loading.style.display = 'block'; resBox.style.display = 'none'; errBox.style.display = 'none';

        const prompt = `Actúa como asesor experto de Immunotec. El cliente tiene ${age} años y su meta es: ${goal}. Recomienda UN producto de la lista (Immunocal Clasico, Platinum, Sport, Optimizer, Omega Gen V, Knutric+). Explica brevemente por qué. Formato: 2 párrafos cortos. Usa tags HTML <b> para el producto.`;

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            const data = await response.json();
            let text = data.candidates[0].content.parts[0].text;
            resText.innerHTML = text.replace(/\n/g, '<br>');

            document.getElementById('ai-whatsapp-btn').href = `https://wa.me/51955900486?text=Hola, la IA me recomendó un producto para ${goal}. ¿Me asesoras?`;
            resBox.style.display = 'block';
        } catch (error) {
            errBox.style.display = 'block';
        } finally {
            btn.disabled = false; loading.style.display = 'none';
        }
    });
    
    // Seleccionamos los elementos del buscador
    const formBusqueda = document.getElementById('form-busqueda');
    const inputBuscar = document.getElementById('buscador-input');
    const btnToggleBuscador = document.getElementById('btn-toggle-buscador');

    // --- 1. NUEVA LÓGICA: Desplegar buscador debajo en móvil ---
    if (btnToggleBuscador && formBusqueda) {
        btnToggleBuscador.addEventListener('click', (e) => {
            // Solo aplicamos el efecto en pantallas móviles (menores a 768px)
            if (window.innerWidth < 768) {
                // Evitamos que el botón intente enviar el formulario vacío al tocarlo
                e.preventDefault(); 
                
                // Mostramos u ocultamos el contenedor completo del formulario
                formBusqueda.classList.toggle('hidden');

                // Hacemos focus automático para que aparezca el teclado del celular al abrirse
                if (!formBusqueda.classList.contains('hidden')) {
                    inputBuscar.focus();
                }
            }
        });
    }

    // --- 2. LÓGICA DE BÚSQUEDA Y ALERTA PERSONALIZADA ---
    
    // Función para crear una alerta visual elegante (Toast) en lugar del alert normal
    function mostrarNotificacion(mensaje) {
        // Elimina notificaciones previas si el usuario hace clics rápidos
        const alertaPrevia = document.getElementById('alerta-busqueda');
        if(alertaPrevia) alertaPrevia.remove();

        const alerta = document.createElement('div');
        alerta.id = 'alerta-busqueda';
        // Estilos Tailwind para un cuadrito rojo centrado arriba
        alerta.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-md shadow-2xl z-[9999] text-sm font-bold text-center w-11/12 max-w-sm transition-opacity duration-300';
        alerta.innerHTML = `<i class="fas fa-exclamation-circle mr-2"></i> ${mensaje}`;
        
        document.body.appendChild(alerta);

        // Desaparece automáticamente a los 3 segundos
        setTimeout(() => {
            alerta.style.opacity = '0';
            setTimeout(() => alerta.remove(), 300);
        }, 3000);
    }

    // Lógica al presionar ENTER o enviar la búsqueda
    if (formBusqueda) {
        formBusqueda.addEventListener('submit', function (evento) {
            // Esto es crucial: evita que la página parpadee o se recargue al dar Enter
            evento.preventDefault();

            const terminoDeBusqueda = inputBuscar.value.trim().toLowerCase();

            if (terminoDeBusqueda === "") {
                return; // Si dan enter sin escribir nada, simplemente no hace nada
            }

            // Buscamos las coincidencias en los títulos de tu página
            const elementosBuscables = document.querySelectorAll('h2, h3, .producto-titulo');
            let encontrado = false;

            elementosBuscables.forEach(elemento => {
                const textoElemento = elemento.textContent.toLowerCase();

                if (textoElemento.includes(terminoDeBusqueda)) {
                    // Scroll suave hacia el elemento
                    elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });

                    // Efecto visual: se pinta de azul por 2 segundos para que el usuario lo note
                    elemento.style.transition = "color 0.5s";
                    elemento.style.color = "#0133a2";
                    setTimeout(() => elemento.style.color = "", 2000);

                    encontrado = true;
                }
            });

            if (!encontrado) {
                // Usamos la nueva alerta en lugar del alert() genérico
                mostrarNotificacion("Producto no encontrado. Intenta con otra palabra.");
            } else {
                // Ocultamos el buscador en móvil si la búsqueda fue exitosa
                if (window.innerWidth < 768) {
                    formBusqueda.classList.add('hidden');
                }
            }
        });
    }
    
    // --- LÓGICA DEL MENÚ HAMBURGUESA (Overlay Pantalla Completa) ---
    const btnMenuMobile = document.getElementById('btn-menu-mobile');
    const btnCloseMenu = document.getElementById('btn-close-menu'); // El nuevo botón X
    const menuMobile = document.getElementById('menu-mobile');
    const enlacesMobile = menuMobile.querySelectorAll('a');

    // 1. Abrir menú al tocar la hamburguesa
    if (btnMenuMobile && menuMobile) {
        btnMenuMobile.addEventListener('click', () => {
            menuMobile.classList.remove('hidden');
            menuMobile.classList.add('flex');
            document.body.style.overflow = 'hidden'; // Bloquea el scroll del fondo
        });
    }

    // 2. Cerrar menú al tocar la 'X'
    if (btnCloseMenu && menuMobile) {
        btnCloseMenu.addEventListener('click', () => {
            menuMobile.classList.add('hidden');
            menuMobile.classList.remove('flex');
            document.body.style.overflow = ''; // Reactiva el scroll del fondo
        });
    }

    // 3. Cerrar el menú automáticamente cuando eligen una opción
    enlacesMobile.forEach(enlace => {
        enlace.addEventListener('click', () => {
            menuMobile.classList.add('hidden');
            menuMobile.classList.remove('flex');
            document.body.style.overflow = ''; // Reactiva el scroll del fondo
        });
    }
    );
    // --- LÓGICA DEL FAVICON ANIMADO (PESTAÑA) ---
    /*const favicon = document.getElementById('icono-pestana');
    let esAzul = true;

     Cambia el ícono cada 2000 milisegundos (2 segundos)
    if (favicon) {
        setInterval(() => {
            if (esAzul) {
                favicon.href = 'IMGS/favicon-blanco.svg';
            } else {
                favicon.href = 'IMGS/favicon-azul.svg';
            }
            // Invertimos el valor para la siguiente vez
            esAzul = !esAzul; 
        }, 3000);
    }*/
})