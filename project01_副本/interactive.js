// Retro elegant interactive shapes following the pointer
(() => {
    const canvas = document.getElementById('orbs');
    const ctx = canvas.getContext('2d');

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    let width = 0, height = 0;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Elegant, retro color palette (muted, tasteful)
    const COLORS = [
        '#6B9080', // sage
        '#A4C3B2', // mint
        '#C89F5D', // mustard bronze
        '#D4A5A5', // dusty rose
        '#5F6F94'  // desaturated indigo
    ];

    // Parallax layers to create depth
    const LAYERS = [
        { count: prefersReduced ? 6 : 14, size: [8, 14], follow: 0.12, drag: 0.90 },
        { count: prefersReduced ? 5 : 10, size: [12, 20], follow: 0.09, drag: 0.88 },
        { count: prefersReduced ? 4 : 8,  size: [18, 28], follow: 0.07, drag: 0.86 }
    ];

    const orbs = [];
    const pointer = { x: 0, y: 0, active: false };
    const center = { x: 0, y: 0 };

    function resize() {
        const rect = canvas.getBoundingClientRect();
        width = Math.floor(rect.width);
        height = Math.floor(rect.height);
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        center.x = width / 2;
        center.y = height / 3 + height * 0.1;
    }

    class Orb {
        constructor(layer) {
            const [minS, maxS] = layer.size;
            this.radius = rand(minS, maxS);
            this.x = center.x + rand(-width * 0.15, width * 0.15);
            this.y = center.y + rand(-height * 0.1, height * 0.1);
            this.vx = rand(-1, 1);
            this.vy = rand(-1, 1);
            this.color = COLORS[(Math.random() * COLORS.length) | 0];
            this.follow = layer.follow;
            this.drag = layer.drag;
            this.shape = Math.random() < 0.55 ? 'star' : 'flower';
        }
        step(targetX, targetY) {
            const tx = this.x + (targetX - this.x) * this.follow;
            const ty = this.y + (targetY - this.y) * this.follow;
            this.vx = (this.vx + (tx - this.x) * 0.12) * this.drag;
            this.vy = (this.vy + (ty - this.y) * 0.12) * this.drag;
            this.x += this.vx;
            this.y += this.vy;
        }
        draw(ctx) {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.vx + this.vy) * 0.1);
            ctx.fillStyle = this.color;
            ctx.strokeStyle = withAlpha('#2f2a26', 0.18);
            ctx.lineWidth = 1;
            if (this.shape === 'star') {
                drawStarPath(ctx, 5, this.radius, this.radius * 0.5);
            } else {
                drawFlowerPath(ctx, 6, this.radius);
            }
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
    }

    function withAlpha(hex, a) {
        const { r, g, b } = hexToRgb(hex);
        return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    function hexToRgb(hex) {
        const h = hex.replace('#', '');
        const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
        return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
    }

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function buildOrbs() {
        orbs.length = 0;
        LAYERS.forEach(layer => {
            for (let i = 0; i < layer.count; i++) {
                orbs.push(new Orb(layer));
            }
        });
    }

    function drawBackdrop() {
        // Very subtle vignette for vintage feel
        ctx.clearRect(0, 0, width, height);
        const vignette = ctx.createRadialGradient(
            width * 0.5, height * 0.5, Math.min(width, height) * 0.2,
            width * 0.5, height * 0.5, Math.max(width, height) * 0.7
        );
        vignette.addColorStop(0, 'rgba(0,0,0,0)');
        vignette.addColorStop(1, 'rgba(0,0,0,0.06)');
        ctx.fillStyle = vignette;
        ctx.fillRect(0, 0, width, height);
    }

    function loop() {
        drawBackdrop();
        const targetX = pointer.active ? pointer.x : center.x;
        const targetY = pointer.active ? pointer.y : center.y;
        for (let i = 0; i < orbs.length; i++) {
            orbs[i].step(targetX, targetY);
            orbs[i].draw(ctx);
        }
        rafId = requestAnimationFrame(loop);
    }

    // Pointer interactions (window-level to ensure tracking even outside the canvas)
    function onPointerMove(e) {
        const rect = canvas.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
        if (!pointer.active) pointer.active = true;
    }

    let rafId = 0;
    function start() {
        cancelAnimationFrame(rafId);
        loop();
    }

    // Setup
    resize();
    buildOrbs();
    start();

    // Events
    window.addEventListener('resize', () => { resize(); buildOrbs(); });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
})();

// Draw a classic five-point star
function drawStarPath(ctx, points, outerRadius, innerRadius) {
    const step = Math.PI / points;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const a = i * step - Math.PI / 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
}

// Draw a retro flower: N petals made of rounded lobes
function drawFlowerPath(ctx, petals, radius) {
    const inner = radius * 0.35;
    const outer = radius;
    ctx.beginPath();
    for (let i = 0; i < petals; i++) {
        const a = (i / petals) * Math.PI * 2;
        const cx = Math.cos(a) * inner;
        const cy = Math.sin(a) * inner;
        ctx.moveTo(cx + outer, cy);
        ctx.arc(cx, cy, outer, 0, Math.PI * 2 / petals, false);
    }
    ctx.closePath();
}


