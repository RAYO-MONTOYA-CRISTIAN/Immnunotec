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
        if (nav) {
            if (window.scrollY > 50) {
                nav.classList.remove('bg-transparent', 'border-transparent');
                nav.classList.add('bg-blue-600/95', 'backdrop-blur-md', 'border-white/10', 'shadow-md');
            } else {
                nav.classList.add('bg-transparent', 'border-transparent');
                nav.classList.remove('bg-blue-600/95', 'backdrop-blur-md', 'border-white/10', 'shadow-md');
            }
        }

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

    // --- 3. PARTICLE CANVAS ANIMATION (HERO) ---
    const canvas = document.getElementById('hero-canvas');
    const ctx = canvas.getContext('2d');
    let width, height, particles;

    function initParticles() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
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
    // Seleccionamos el formulario completo y el input
    const formBusqueda = document.getElementById('form-busqueda');
    const inputBuscar = document.getElementById('buscador-input');

    // 1. Escuchamos el 'submit' (funciona tanto si dan clic en un botón como si presionan ENTER)
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
                elemento.style.color = "#38bdf8";
                setTimeout(() => elemento.style.color = "", 2000);

                encontrado = true;
            }
        });

        if (!encontrado) {
            alert("No se encontraron resultados para: " + terminoDeBusqueda);
        }
    });

    // --- LÓGICA DEL MENÚ HAMBURGUESA (Mobile First) ---
    const btnMenuMobile = document.getElementById('btn-menu-mobile');
    const menuMobile = document.getElementById('menu-mobile');
    const enlacesMobile = menuMobile.querySelectorAll('a');
    const iconoMenu = btnMenuMobile.querySelector('i');

    // 1. Abrir/Cerrar menú al tocar la hamburguesa
    btnMenuMobile.addEventListener('click', () => {
        // Alternamos entre ocultar ('hidden') y mostrar ('flex')
        menuMobile.classList.toggle('hidden');
        menuMobile.classList.toggle('flex');

        // Opcional: Cambiar el ícono de hamburguesa a una "X" al abrir
        if (menuMobile.classList.contains('hidden')) {
            iconoMenu.classList.remove('fa-times');
            iconoMenu.classList.add('fa-bars');
        } else {
            iconoMenu.classList.remove('fa-bars');
            iconoMenu.classList.add('fa-times');
        }
    });

    // 2. Cerrar el menú automáticamente cuando eligen una opción
    enlacesMobile.forEach(enlace => {
        enlace.addEventListener('click', () => {
            menuMobile.classList.add('hidden');
            menuMobile.classList.remove('flex');
            iconoMenu.classList.remove('fa-times');
            iconoMenu.classList.add('fa-bars');
        });
    });


});