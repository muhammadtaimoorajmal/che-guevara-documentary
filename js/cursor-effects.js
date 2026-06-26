// ============================================================
// CURSOR-EFFECTS.JS — CHE GUEVARA: PATRIA O MUERTE
// Custom cursor with magnetic hover and trail effects
// ============================================================

class CursorFX {
  constructor() {
    this.cursor = document.getElementById('cursor');
    this.ring = document.getElementById('cursor-ring');
    if (!this.cursor || !this.ring) return;

    this.mouse = { x: -100, y: -100 };
    this.ringPos = { x: -100, y: -100 };
    this.rafId = null;
    this.isHovering = false;

    this.init();
  }

  init() {
    // Hide default cursor
    document.body.style.cursor = 'none';

    // Mouse move
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;

      // Instantly position the dot
      this.cursor.style.left = e.clientX + 'px';
      this.cursor.style.top  = e.clientY + 'px';
    });

    // Hover state on interactive elements
    const interactables = 'a, button, [role="button"], .gallery-item, .timeline-card, .quote-card, .filter-btn, .timeline-dot';

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactables)) {
        document.body.classList.add('cursor-hover');
        this.isHovering = true;
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactables)) {
        document.body.classList.remove('cursor-hover');
        this.isHovering = false;
      }
    });

    // Click ripple
    document.addEventListener('click', (e) => {
      this.createClickRipple(e.clientX, e.clientY);
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', () => {
      this.cursor.style.opacity = '0';
      this.ring.style.opacity = '0';
    });

    document.addEventListener('mouseenter', () => {
      this.cursor.style.opacity = '1';
      this.ring.style.opacity = '1';
    });

    // Start smooth ring animation
    this.animateRing();
  }

  animateRing() {
    // Ring follows cursor with slight lag
    this.ringPos.x = lerp(this.ringPos.x, this.mouse.x, 0.12);
    this.ringPos.y = lerp(this.ringPos.y, this.mouse.y, 0.12);

    this.ring.style.left = this.ringPos.x + 'px';
    this.ring.style.top  = this.ringPos.y + 'px';

    this.rafId = requestAnimationFrame(() => this.animateRing());
  }

  createClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: transparent;
      border: 1.5px solid rgba(204,0,0,0.6);
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 9998;
      transition: width 0.5s ease, height 0.5s ease, opacity 0.5s ease;
    `;
    document.body.appendChild(ripple);

    requestAnimationFrame(() => {
      ripple.style.width  = '80px';
      ripple.style.height = '80px';
      ripple.style.opacity = '0';
    });

    setTimeout(() => ripple.remove(), 600);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    document.body.style.cursor = '';
  }
}

let cursorFX = null;

function initCursor() {
  if (isMobile()) return; // No custom cursor on touch devices
  cursorFX = new CursorFX();
}
