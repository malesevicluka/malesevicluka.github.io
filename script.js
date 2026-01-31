document.addEventListener('DOMContentLoaded', () => {
    const startOverlay = document.getElementById('start-overlay');
    const startBtn = document.getElementById('start-btn');
    const bgMusic = document.getElementById('bg-music');

    // Core Elements
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');
    const question = document.querySelector('.question');
    const buttonsContainer = document.querySelector('.buttons');
    const successMessage = document.getElementById('success-message');

    // Ensure typewriter starts EMPTY
    question.textContent = '';

    // === START SEQUENCE ===
    startBtn.addEventListener('click', () => {
        bgMusic.volume = 0.5;
        bgMusic.play().then(() => {
            console.log("Music started");
        }).catch(e => {
            console.log("Audio play failed:", e);
        });
        startOverlay.classList.add('fade-out');
        setTimeout(startTypeWriter, 800);
    });

    // === TYPEWRITER EFFECT ===
    let textToType = question.getAttribute('data-text');
    if (!textToType) {
        textToType = "Lara, hoćeš li biti moja Valentina?";
        question.setAttribute('data-text', textToType);
    }
    let charIndex = 0;
    const typeSpeed = 70;

    function startTypeWriter() {
        if (charIndex < textToType.length) {
            question.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(startTypeWriter, typeSpeed);
        } else {

            // Typing finished
            // 1. Collapse layout immediately (no jump visible yet as buttons are hidden)
            question.classList.add('typing-done');

            // 2. Reveal buttons after layout is stable
            setTimeout(() => {
                buttonsContainer.classList.add('visible');
            }, 100);
        }
    }

    // === CURSOR TRAIL ===
    let lastHeartTime = 0;
    const heartInterval = 50;
    document.addEventListener('mousemove', (e) => {
        if (!startOverlay.classList.contains('fade-out')) return;
        const now = Date.now();
        if (now - lastHeartTime > heartInterval) {
            createHeart(e.clientX, e.clientY);
            lastHeartTime = now;
        }
    });

    function createHeart(x, y) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        const colors = ['#ff4d6d', '#ff8fa3', '#ffb3c1', '#ef6351'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        heart.style.background = randomColor;
        heart.style.setProperty('--heart-color', randomColor);
        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        document.body.appendChild(heart);
        setTimeout(() => { heart.remove(); }, 1000);
    }

    // === FLOATING HEARTS BACKGROUND ===
    function createFloatingHearts() {
        const heart = document.createElement('div');
        heart.innerHTML = '❤️';
        heart.classList.add('bg-heart');
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = Math.random() * 3 + 2 + 's';
        heart.style.fontSize = Math.random() * 20 + 10 + 'px';
        document.body.appendChild(heart);
        setTimeout(() => { heart.remove(); }, 5000);
    }
    setInterval(createFloatingHearts, 300);

    // === EXPANDING BUTTON LOGIC ===
    let yesSize = 1.4;
    noBtn.addEventListener('click', () => {
        // Slower growth on mobile to prevent layout breakage too fast
        const growthFactor = window.innerWidth < 600 ? 1.2 : 1.5;
        yesSize *= growthFactor;
        yesBtn.style.fontSize = `${yesSize}rem`;
        // Removed the "crushed" logic as requested. 
        // The No button will just stay there (or move naturally as layout flows).
    });

    // Success Logic
    yesBtn.addEventListener('click', () => {
        buttonsContainer.style.display = 'none';
        question.textContent = "Jeej! ❤️";
        question.classList.add('typing-done');
        const headerGif = document.querySelector('.header-gif');
        if (headerGif) headerGif.style.display = 'none';
        successMessage.classList.remove('hidden');

        // Start Fireworks
        startFireworks();
    });
});

// === FIREWORKS LOGIC ===
function startFireworks() {
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');
    canvas.style.display = 'block';

    // Resize canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const particles = [];

    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 6 + 2;
            this.vx = Math.cos(angle) * velocity;
            this.vy = Math.sin(angle) * velocity;
            this.alpha = 1;
            this.decay = Math.random() * 0.015 + 0.01;
            this.gravity = 0.08;
            this.size = Math.random() * 10 + 5; // Size for heart
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += this.gravity;
            this.alpha -= this.decay;
        }

        draw(ctx) {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.fillStyle = this.color;

            // Draw Heart Shape
            ctx.translate(this.x, this.y);
            ctx.beginPath();
            // Heart path formula
            // We scale it by this.size
            const s = this.size / 30;
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(-5 * s, -15 * s, -25 * s, -15 * s, -25 * s, 10 * s);
            ctx.bezierCurveTo(-25 * s, 25 * s, 0, 40 * s, 0, 40 * s);
            ctx.bezierCurveTo(0, 40 * s, 25 * s, 25 * s, 25 * s, 10 * s);
            ctx.bezierCurveTo(25 * s, -15 * s, 5 * s, -15 * s, 0, 0);

            ctx.fill();
            ctx.restore();
        }
    }

    function createExplosion(x, y) {
        // Updated Colors for Valentine theme
        const colors = ['#ff4d6d', '#ff8fa3', '#ffe5ea', '#ffb3c1', '#ffffff', '#e01e37'];
        for (let i = 0; i < 60; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            particles.push(new Particle(x, y, color));
        }
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear frame

        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw(ctx);
            if (particles[i].alpha <= 0) {
                particles.splice(i, 1);
            }
        }

        requestAnimationFrame(loop);
    }

    loop();

    // Launch random fireworks
    setInterval(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height * 0.6); // Top 60%
        createExplosion(x, y);
    }, 600);
}

const styleDate = document.createElement('style');
styleDate.innerHTML = `
@keyframes fall {
    to { transform: translateY(100vh) rotate(720deg); }
}
.heart { background-color: var(--heart-color) !important; }
.heart::before, .heart::after { background-color: var(--heart-color) !important; }
`;
document.head.appendChild(styleDate);
