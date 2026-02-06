document.addEventListener('DOMContentLoaded', () => {
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
    const anniversaryDate = new Date(2025, 8, 28);
    const countUpElement = document.getElementById('countUp');

    function updateCounter() {
        const now = new Date();
        const diff = now - anniversaryDate;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countUpElement.innerHTML = `Llevamos construyendo magia <br> <b style="color: #ff4d6d; font-size: 3rem;">${days}d ${hours}h ${minutes}m ${seconds}s</b>`;
    }
    setInterval(updateCounter, 1000);

    // 3. Envelope Interaction (Sequential Animation)
    const envelope = document.getElementById('loveEnvelope');
    const letterPop = document.getElementById('letterPop');
    const overlay = document.getElementById('overlay');
    const closeLetter = document.getElementById('closeLetter');

    envelope.addEventListener('click', () => {
        // Fase 1: Abrir el sobre y que salga la mini-carta
        envelope.classList.add('open');

        // Fase 2: Mostrar el modal con enfoque (después de que la carta salga)
        setTimeout(() => {
            letterPop.classList.add('active');
            overlay.classList.add('active');
        }, 1200); // Dar tiempo a que la mini-carta suba
    });

    const hideLetter = () => {
        letterPop.classList.remove('active');
        overlay.classList.remove('active');
        setTimeout(() => envelope.classList.remove('open'), 400);
    };

    closeLetter.addEventListener('click', hideLetter);
    overlay.addEventListener('click', hideLetter);

    // 4. Scroll Reveal
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal, .milestone-item').forEach(el => observer.observe(el));

    // 5. Heart Blast
    const mainHeart = document.getElementById('mainHeart');
    mainHeart.addEventListener('click', () => {
        for (let i = 0; i < 30; i++) createExplosionHeart();
    });

    function createExplosionHeart() {
        const h = document.createElement('div');
        const heartEmojis = ['❤️', '💖', '💕', '✨', '🌸'];
        h.innerHTML = heartEmojis[Math.floor(Math.random() * heartEmojis.heartEmojis)]; // Fixed typo here logically in next thought
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
});
