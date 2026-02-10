document.addEventListener('DOMContentLoaded', () => {
    // 0. Load Timeline Images (Handling HEIF/HEIC)
    function loadTimelineImages() {
        document.querySelectorAll('.milestone-img').forEach(imgContainer => {
            const src = imgContainer.dataset.src;
            if (!src) return;

            const isHeic = src.toLowerCase().endsWith('.heic') || src.toLowerCase().endsWith('.heif');
            if (isHeic) {
                fetch(src)
                    .then(res => res.blob())
                    .then(blob => heic2any({ blob, toType: "image/jpeg", quality: 0.7 }))
                    .then(converted => {
                        const url = URL.createObjectURL(Array.isArray(converted) ? converted[0] : converted);
                        imgContainer.style.backgroundImage = `url('${url}')`;
                    })
                    .catch(e => {
                        console.error("Error converting timeline HEIC:", e);
                        imgContainer.style.background = '#333';
                    });
            } else {
                imgContainer.style.backgroundImage = `url('${src}')`;
            }
        });
    }
    loadTimelineImages();
    // 1. Particles
    particlesJS('particles-js', {
        "particles": {
            "number": { "value": 100, "density": { "enable": true, "value_area": 800 } },
            "color": { "value": "#ff4d6d" },
            "opacity": { "value": 0.4, "random": true },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": false },
            "move": { "enable": true, "speed": 1.5, "direction": "top", "out_mode": "out" }
        }
    });

    // 2. Timer
    const startDate = new Date(2025, 8, 28); // Septiembre es mes 8
    const countUpElement = document.getElementById('countUp');

    function updateCounter() {
        const now = new Date();
        const diff = now - startDate;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        if (countUpElement) {
            countUpElement.innerHTML = `Llevamos construyendo magia <br> <b style="color: #ff4d6d; font-size: 3rem;">${days}d ${hours}h ${minutes}m ${seconds}s</b>`;
        }
    }
    setInterval(updateCounter, 1000);

    // 3. Envelope Interaction
    const envelope = document.getElementById('loveEnvelope');
    const letterPop = document.getElementById('letterPop');
    const overlay = document.getElementById('overlay');
    const closeLetter = document.getElementById('closeLetter');

    if (envelope) {
        envelope.addEventListener('click', () => {
            envelope.classList.add('open');
            setTimeout(() => {
                letterPop.classList.add('active');
                overlay.classList.add('active');
            }, 1200);
        });
    }

    const hideLetter = () => {
        letterPop.classList.remove('active');
        overlay.classList.remove('active');
        setTimeout(() => envelope.classList.remove('open'), 400);
    };

    if (closeLetter) closeLetter.addEventListener('click', hideLetter);
    if (overlay) overlay.addEventListener('click', hideLetter);

    // 4. Scroll Reveal
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal, .milestone-item').forEach(el => revealObserver.observe(el));

    // 5. Heart Blast
    const mainHeart = document.getElementById('mainHeart');
    if (mainHeart) {
        mainHeart.addEventListener('click', () => {
            for (let i = 0; i < 30; i++) createExplosionHeart();
        });
    }

    function createExplosionHeart() {
        const h = document.createElement('div');
        const heartEmojis = ['❤️', '💖', '💕', '✨', '🌸'];
        h.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
        h.style.position = 'fixed';
        h.style.left = '50%';
        h.style.top = '50%';
        h.style.fontSize = Math.random() * 20 + 20 + 'px';
        h.style.pointerEvents = 'none';
        h.style.zIndex = '3000';

        const angle = Math.random() * Math.PI * 2;
        const velocity = 200 + Math.random() * 400;
        const destinationX = Math.cos(angle) * velocity;
        const destinationY = Math.sin(angle) * velocity;

        const anim = h.animate([
            { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${destinationX}px), calc(-50% + ${destinationY}px)) scale(0)`, opacity: 0 }
        ], { duration: 1500, easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)' });

        document.body.appendChild(h);
        anim.onfinish = () => h.remove();
    }

    // --- FIREBASE CONFIGURATION ---
    const firebaseConfig = {
        apiKey: "AIzaSyColHyjTP6-6Try8RaIvtZ8bTGKN9Pl83U",
        authDomain: "febrero-d6968.firebaseapp.com",
        projectId: "febrero-d6968",
        storageBucket: "febrero-d6968.firebasestorage.app",
        messagingSenderId: "669776815993",
        appId: "1:669776815993:web:4dd17e5921d6214b3871a8",
        measurementId: "G-5W4YYXB8Y4"
    };

    // Initialize Firebase Compat
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // --- IMGBB CONFIGURATION ---
    // El sistema de Proxy de tu otro proyecto está bloqueado por CORS para este nuevo dominio.
    // Para que funcione, necesitamos usar una API KEY directa de ImgBB.
    // Puedes obtener una gratis aquí: https://api.imgbb.com/ (solo toma 1 minuto)
    const IMGBB_API_KEY = "9d07de7fb3ed26a78e7ccb169c2ecbb7";

    async function subirImagenImgBB(file) {
        if (!IMGBB_API_KEY || IMGBB_API_KEY === "TU_API_KEY_AQUI") {
            throw new Error('Por favor, configura tu IMGBB_API_KEY en script.js');
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const resp = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData
            });
            const data = await resp.json();

            if (!data || !data.data || !data.data.url) {
                throw new Error('Error en la respuesta de ImgBB');
            }

            return {
                url: data.data.url,
                deleteUrl: data.data.delete_url || null,
                thumbUrl: data.data.thumb ? data.data.thumb.url : data.data.url
            };
        } catch (e) {
            console.error('Error al subir a ImgBB:', e);
            throw e;
        }
    }

    // 6. Scattered Memories (Recuerdos)
    const localMemoryImages = [
        'images/20260111_115144.heic',
        'images/IMG-20260104-WA005011.jpg',
        'images/IMG_20251103_181417.jpg',
        'images/20250529_193719.heic',
        'images/20250902_175326.heic',
        'images/20250902_175402.heic.heif',
        'images/20250902_175524.heic',
        'images/20250902_180817.heic',
        'images/20250905_151404.heic',
        'images/20250917_171832.heic',
        'images/20251127_140737.heic',
        'images/20260111_115021.heic',
        'images/20260111_115154.heic',
        'images/20250529_164559.heic',
        'images/IMG-20251030-WA0010_1.jpg',
        'images/20251017_155641_1.heic.heif'
    ];

    const memoriesContainer = document.getElementById('memoriesContainer');
    let topZ = 120;

    function createPolaroid(src, id, isNew = false) {
        if (!memoriesContainer) return;

        const polaroid = document.createElement('div');
        polaroid.className = `polaroid scroll-reveal`;
        polaroid.dataset.id = id;

        const savedPos = JSON.parse(localStorage.getItem(`pos-${id || src}`));

        if (savedPos) {
            polaroid.style.left = savedPos.left;
            polaroid.style.top = savedPos.top;
            polaroid.style.zIndex = savedPos.zIndex;
            polaroid.style.transform = savedPos.transform;
            if (savedPos.zIndex > topZ) topZ = savedPos.zIndex;
        } else {
            const itemsPerRow = 8;
            const childCount = memoriesContainer.children.length;
            const col = childCount % itemsPerRow;
            const row = Math.floor(childCount / itemsPerRow);
            const posX = 1 + (col * 12.3);
            const posY = 30 + (row * 340);
            const randomRot = (Math.random() - 0.5) * 10;

            polaroid.style.left = `${posX}%`;
            polaroid.style.top = `${posY}px`;
            polaroid.style.transform = `rotate(${randomRot}deg)`;
            polaroid.style.zIndex = childCount + 10;
        }

        polaroid.style.cursor = 'grab';
        polaroid.innerHTML = `
            <div class="photo-loader" style="width:100%; height:190px; display:flex; align-items:center; justify-content:center; background:#f5f5f5; color:#ff4d6d; font-size:0.7rem; border-radius:3px; pointer-events:none;">❤️</div>
            <div style="font-family: var(--font-script); color: #555; margin-top: 8px; font-size: 1rem; pointer-events:none; user-select:none; text-align:center;">Recuerdo...</div>
        `;

        // Agregamos el botón de borrar (estilo en CSS)
        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'delete-photo-btn';
        deleteBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>';
        deleteBtn.style.display = 'none'; // Se controla por JS el modo borrar
        deleteBtn.onclick = async (e) => {
            e.stopPropagation();
            if (confirm('¿Borrar este recuerdo para siempre?')) {
                try {
                    if (id && !id.startsWith('local-')) {
                        await db.collection("memories").doc(id).delete();
                    }
                    polaroid.style.transform = 'scale(0) rotate(20deg)';
                    polaroid.style.opacity = '0';
                    setTimeout(() => polaroid.remove(), 800);
                } catch (err) {
                    console.error("Error borrando:", err);
                    alert("No se pudo borrar el recuerdo.");
                }
            }
        };
        polaroid.appendChild(deleteBtn);

        memoriesContainer.appendChild(polaroid);

        // Drag logic
        setupDrag(polaroid, id || src);

        // Load image
        const isHeic = src.toLowerCase().endsWith('.heic') || src.toLowerCase().endsWith('.heif');
        if (isHeic) {
            fetch(src)
                .then(res => res.blob())
                .then(blob => heic2any({ blob, toType: "image/jpeg", quality: 0.7 }))
                .then(converted => {
                    const url = URL.createObjectURL(Array.isArray(converted) ? converted[0] : converted);
                    displayImage(polaroid, url);
                })
                .catch(() => displayImage(polaroid, 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=300&auto=format&fit=crop'));
        } else {
            displayImage(polaroid, src);
        }

        const pFactor = 0.02 + (Math.random() * 0.05);
        polaroid.dataset.parallax = pFactor;

        if (isNew) {
            polaroid.classList.add('visible'); // Show immediately if just uploaded
            polaroid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function setupDrag(polaroid, storageKey) {
        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        polaroid.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('delete-photo-btn')) return;
            isDragging = true;
            topZ++;
            polaroid.style.zIndex = topZ;
            polaroid.style.cursor = 'grabbing';
            startX = e.clientX;
            startY = e.clientY;
            initialLeft = polaroid.offsetLeft;
            initialTop = polaroid.offsetTop;
            polaroid.style.transition = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            polaroid.style.left = `${initialLeft + dx}px`;
            polaroid.style.top = `${initialTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                polaroid.style.cursor = 'grab';
                polaroid.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1), z-index 0s';
                localStorage.setItem(`pos-${storageKey}`, JSON.stringify({
                    left: polaroid.style.left,
                    top: polaroid.style.top,
                    zIndex: parseInt(polaroid.style.zIndex),
                    transform: polaroid.style.transform
                }));
            }
        });
    }

    // Load Initial Local Images
    localMemoryImages.forEach((src, idx) => createPolaroid(src, `local-${idx}`));

    // Lógica Secreta: Triple Toque para modo borrar
    const memoriesTitle = document.getElementById('memoriesTitle');
    let titleClicks = 0;
    let clickTimer;
    let deleteModeActive = false;

    if (memoriesTitle) {
        memoriesTitle.addEventListener('click', () => {
            titleClicks++;
            clearTimeout(clickTimer);

            if (titleClicks === 3) {
                deleteModeActive = !deleteModeActive;
                const btns = document.querySelectorAll('.delete-photo-btn');
                btns.forEach(btn => btn.style.display = deleteModeActive ? 'flex' : 'none');

                // Efecto visual en el título para saber que algo pasó
                memoriesTitle.style.color = deleteModeActive ? 'var(--primary)' : '#fff';

                titleClicks = 0;
            } else {
                clickTimer = setTimeout(() => { titleClicks = 0; }, 500);
            }
        });
    }

    // Asegurar que las nuevas fotos también respeten el modo borrar si está activo
    db.collection("memories").orderBy("timestamp", "desc").onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
                const data = change.doc.data();
                if (!document.querySelector(`[data-id="${change.doc.id}"]`)) {
                    createPolaroid(data.imageUrl, change.doc.id, true);
                    // Si el modo borrar está activo, mostrar el botón en la nueva foto
                    if (deleteModeActive) {
                        const newBtn = document.querySelector(`[data-id="${change.doc.id}"] .delete-photo-btn`);
                        if (newBtn) newBtn.style.display = 'flex';
                    }
                }
            } else if (change.type === "removed") {
                const existing = document.querySelector(`[data-id="${change.doc.id}"]`);
                if (existing) {
                    existing.style.transform = 'scale(0)';
                    setTimeout(() => existing.remove(), 500);
                }
            }
        });
    });

    // Upload Logic
    const imageUpload = document.getElementById('imageUpload');
    const uploadStatus = document.getElementById('uploadStatus');

    if (imageUpload) {
        imageUpload.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            uploadStatus.style.opacity = '1';
            uploadStatus.innerText = '✨ Subiendo tu recuerdo...';

            try {
                // Usamos el sistema de ImgBB igual que en tu otro proyecto
                const imgData = await subirImagenImgBB(file);

                await db.collection("memories").add({
                    imageUrl: imgData.url,
                    thumbUrl: imgData.thumbUrl,
                    deleteUrl: imgData.deleteUrl,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    fileName: file.name
                });

                uploadStatus.innerText = '✅ Recuerdo guardado eternamente';
                setTimeout(() => uploadStatus.style.opacity = '0', 3000);
            } catch (error) {
                console.error("Error uploading:", error);
                uploadStatus.innerText = '❌ Error al subir, intenta de nuevo';
                setTimeout(() => uploadStatus.style.opacity = '0', 3000);
            }
        });
    }

    function displayImage(parent, url) {
        const loader = parent.querySelector('.photo-loader');
        const img = document.createElement('img');
        img.src = url;
        img.style.width = "100%";
        img.style.height = "190px";
        img.style.objectFit = "cover";
        img.onload = () => {
            if (loader) loader.remove();
            const old = parent.querySelector('img');
            if (old) old.remove();
            parent.insertBefore(img, parent.firstChild);
        };
        img.onerror = () => {
            if (loader) loader.innerHTML = '⚠️<br><span style="font-size:0.6rem;">Error</span>';
        };
    }

    // Parallax
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const cTop = memoriesContainer?.offsetTop || 0;
        const vHeight = window.innerHeight;

        if (memoriesContainer && scrolled > cTop - vHeight && scrolled < cTop + memoriesContainer.offsetHeight) {
            document.querySelectorAll('.polaroid').forEach(p => {
                if (p.style.cursor === 'grabbing') return;
                const f = parseFloat(p.dataset.parallax);
                const y = (scrolled - cTop) * f;
                const rot = p.style.transform.match(/rotate\((.*?)\)/)?.[0] || 'rotate(0deg)';
                p.style.transform = `${rot} translateY(${-y}px)`;
            });
        }
    });

    // 7. Music Player
    const musicPlayer = document.getElementById('musicPlayer');
    const vinylPlay = document.getElementById('vinylPlay');
    const mainSong = document.getElementById('mainSong');
    const beatOverlay = document.getElementById('beatOverlay');
    let isPlaying = false;
    let pulseInterval;

    if (vinylPlay && mainSong) {
        vinylPlay.addEventListener('click', () => {
            if (isPlaying) {
                mainSong.pause();
                musicPlayer.classList.remove('playing');
                clearInterval(pulseInterval);
                beatOverlay.classList.remove('pulse-active');
            } else {
                mainSong.play().catch(() => console.log("Interaction needed"));
                musicPlayer.classList.add('playing');
                pulseInterval = setInterval(() => {
                    beatOverlay.classList.add('pulse-active');
                    setTimeout(() => beatOverlay.classList.remove('pulse-active'), 200);
                }, 850);
            }
            isPlaying = !isPlaying;
        });
    }

    // 8. Secret Section
    const pinInput = document.getElementById('pinInput');
    const unlockBtn = document.getElementById('unlockBtn');
    const lockScreen = document.getElementById('lockScreen');
    const secretContent = document.getElementById('secretContent');
    const lockError = document.getElementById('lockError');
    const code = "092825";

    if (unlockBtn) {
        unlockBtn.addEventListener('click', () => {
            if (pinInput.value === code) {
                lockScreen.style.opacity = '0';
                lockScreen.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    lockScreen.style.display = 'none';
                    secretContent.style.display = 'block';
                    secretContent.scrollIntoView({ behavior: 'smooth' });
                }, 800);
            } else {
                lockError.style.opacity = '1';
                pinInput.style.animation = 'shake 0.5s ease';
                setTimeout(() => {
                    pinInput.style.animation = '';
                    lockError.style.opacity = '0';
                }, 2000);
                pinInput.value = '';
            }
        });
        pinInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') unlockBtn.click(); });
    }

    // 9. Te Amo Porque (Razones Aleatorias con Estrellas Mágicas)
    const reasons = [
        "Por la forma en que me miras cuando crees que no me doy cuenta.",
        "Porque haces que los días difíciles se sientan mucho más ligeros.",
        "Por tu risa, que es mi sonido favorito en todo el mundo.",
        "Porque crees en mí incluso cuando yo mismo dudo.",
        "Por la paz que siento cuando estoy a tu lado.",
        "Porque eres mi mejor amiga y mi gran amor al mismo tiempo.",
        "Por cómo cuidas de los detalles más pequeños.",
        "Porque sacas la mejor versión de mí cada día.",
        "Por tu inteligencia y la forma en que ves el mundo.",
        "Porque contigo el futuro no da miedo, da ilusión.",
        "Por la forma en que encajas perfectamente en mis abrazos.",
        "Porque me haces reír hasta que me duele la panza.",
        "Por tu valentía y tu fuerza ante cualquier reto.",
        "Porque compartes tus sueños conmigo.",
        "Por los 'buenos días' que iluminan toda mi jornada.",
        "Porque respetas mis silencios y celebras mis ruidos.",
        "Por tu paciencia infinita (especialmente conmigo).",
        "Porque cada momento a tu lado es un regalo.",
        "Por cómo me haces sentir en casa, sin importar dónde estemos.",
        "Porque eres la persona más hermosa, por dentro y por fuera.",
        "Por tu ternura y la suavidad de tus caricias.",
        "Porque me enseñas algo nuevo cada día.",
        "Por el apoyo incondicional que siempre me brindas.",
        "Porque simplemente eres tú, y no cambiaría nada de ti.",
        "Porque mi vida es mucho más colorida desde que estás en ella.",
        "Por tu forma de morderte el labio cuando estás concentrada.",
        "Porque conoces todos mis miedos y aun así decides quedarte.",
        "Por la forma en que tus manos encajan perfectamente con las mías.",
        "Porque eres la primera persona a la que quiero contarle todo.",
        "Por tu olor, que es mi perfume favorito.",
        "Porque haces que hasta ir al supermercado sea una aventura divertida.",
        "Por los pequeños saltitos que das cuando estás emocionada.",
        "Porque siempre sabes qué decir para hacerme sonreír.",
        "Por la pasión que pones en todo lo que haces.",
        "Porque eres mi refugio seguro en medio de cualquier tormenta.",
        "Por la forma en que cantas en el coche, aunque no te sepas la letra.",
        "Porque me escuchas aunque mis historias no tengan sentido.",
        "Por tu honestidad, incluso cuando la verdad es difícil.",
        "Porque me has enseñado lo que significa amar de verdad.",
        "Por la forma en que buscas mis pies debajo de las sábanas para calentarte.",
        "Porque eres la motivación que necesito para ser mejor hombre.",
        "Por tus abrazos infinitos que me recargan la energía.",
        "Por tienes el corazón más noble que jamás he conocido.",
        "Por la manera en que me cuidas cuando estoy enfermo.",
        "Porque me haces sentir que puedo conquistar el mundo a tu lado.",
        "Por tus ojos, que brillan más que cualquier estrella.",
        "Porque cada mensaje tuyo me saca una sonrisa boba.",
        "Por la forma en que defiendes lo que crees que es justo.",
        "Porque eres la única persona que me entiende sin decir una palabra.",
        "Por tu sentido del humor, que encaja perfecto con el mío.",
        "Porque me aceptas con todas mis imperfecciones.",
        "Por los planes improvisados que terminan siendo los mejores.",
        "Porque eres mi pensamiento favorito antes de dormir.",
        "Por la ternura con la que hablas de tus sueños.",
        "Porque eres el regalo más bonito que me ha dado la vida.",
        "Por la forma en que arrugas la nariz cuando algo no te gusta.",
        "Porque haces que el mundo sea un lugar mucho más bonito.",
        "Por tu capacidad de perdonar y volver a empezar.",
        "Porque eres mi confidente y mi cómplice en todo.",
        "Por la luz que desprendes solo con entrar en una habitación.",
        "Contigo el tiempo vuela, pero el amor se queda.",
        "Por los besos robados que me quitan el aliento.",
        "Porque eres el destino al que siempre quiero volver.",
        "Por la fuerza con la que te enfrentas a tus miedos.",
        "Porque me haces sentir especial cada día de mi vida.",
        "Por la forma en que me apoyas en cada uno de mis proyectos.",
        "Porque eres la razón por la que creo en el 'para siempre'.",
        "Por tu curiosidad por aprender cosas nuevas constantemente.",
        "Porque haces que hasta el silencio sea cómodo a tu lado.",
        "Por la manera en que me miras cuando me dices 'te amo'.",
        "Porque eres mi aventura favorita de todos los días.",
        "Por el brillo de tu cara cuando estás realmente feliz.",
        "Porque eres la pieza que le faltaba a mi rompecabezas.",
        "Por tu perseverancia y por no rendirte nunca.",
        "Porque simplemente no puedo imaginar un futuro donde no estés tú.",
        "Por la forma en que proteges a quienes amas.",
        "Porque eres mi persona favorita en todo el universo."
    ];

    const generateBtn = document.getElementById('generateReason');
    const reasonText = document.getElementById('reasonText');
    const magicBg = document.getElementById('magicBg');

    function createMagicStars() {
        if (!magicBg) return;
        magicBg.innerHTML = '';
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'magic-star';
            const size = Math.random() * 4 + 2;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.setProperty('--duration', `${Math.random() * 3 + 2}s`);
            magicBg.appendChild(star);
        }
    }

    if (generateBtn && reasonText) {
        generateBtn.addEventListener('click', () => {
            reasonText.classList.add('changing');
            setTimeout(() => {
                const randomIndex = Math.floor(Math.random() * reasons.length);
                reasonText.innerText = reasons[randomIndex];
                reasonText.classList.remove('changing');
                for (let i = 0; i < 15; i++) createExplosionHeart();
            }, 600);
        });
    }

    // Llamar a las estrellas cuando se desbloquea
    const observerSecret = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'style' && secretContent.style.display === 'block') {
                createMagicStars();
            }
        });
    });
    if (secretContent) observerSecret.observe(secretContent, { attributes: true });
});
