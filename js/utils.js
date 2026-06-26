// ============================================================
// UTILS.JS — CHE GUEVARA: PATRIA O MUERTE
// Shared helper functions and easing utilities
// ============================================================

/**
 * Clamp a value between min and max
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Map a value from one range to another
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/**
 * Easing functions
 */
const Easing = {
  linear:      t => t,
  easeIn:      t => t * t,
  easeOut:     t => t * (2 - t),
  easeInOut:   t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: t => t * t * t,
  easeOutCubic:t => (--t) * t * t + 1,
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeOutBack: t => {
    const c1 = 1.70158, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeOutElastic: t => {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1;
  }
};

/**
 * Debounce a function
 */
function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle a function
 */
function throttle(fn, limit) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return fn(...args);
    }
  };
}

/**
 * Animate a value from start to end over duration using easing
 * Returns a cancel function
 */
function animate(from, to, duration, easeFn, onUpdate, onComplete) {
  const startTime = performance.now();
  let rafId;

  function tick(now) {
    const elapsed = now - startTime;
    const t = clamp(elapsed / duration, 0, 1);
    const eased = easeFn ? easeFn(t) : t;
    onUpdate(lerp(from, to, eased));

    if (t < 1) {
      rafId = requestAnimationFrame(tick);
    } else {
      onUpdate(to);
      if (onComplete) onComplete();
    }
  }

  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}

/**
 * Smooth scroll to element
 */
function scrollToElement(el, offset = 80) {
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
  window.scrollTo({ top, behavior: 'smooth' });
}

/**
 * Show a toast notification
 */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/**
 * Format a number with + suffix
 */
function formatStat(n, suffix = '') {
  return n + suffix;
}

/**
 * Animate a counter from 0 to target value
 */
function animateCounter(el, target, duration = 1500, suffix = '') {
  const start = performance.now();
  const isInfinity = target === Infinity;

  if (isInfinity) {
    el.textContent = '∞';
    return;
  }

  function tick(now) {
    const t = clamp((now - start) / duration, 0, 1);
    const value = Math.round(Easing.easeOutCubic(t) * target);
    el.textContent = value + suffix;
    if (t < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/**
 * Get CSS variable value
 */
function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/**
 * Generate random float between min and max
 */
function rand(min, max) {
  return min + Math.random() * (max - min);
}

/**
 * Generate random integer between min and max (inclusive)
 */
function randInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

/**
 * Check if device is touch/mobile
 */
function isMobile() {
  return window.innerWidth <= 768 || ('ontouchstart' in window);
}

/**
 * Convert degrees to radians
 */
function degToRad(deg) {
  return deg * Math.PI / 180;
}

/**
 * Hex color to rgba
 */
function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/**
 * Simple event bus
 */
const EventBus = {
  events: {},
  on(event, cb) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(cb);
  },
  off(event, cb) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter(fn => fn !== cb);
    }
  },
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(data));
    }
  }
};

/**
 * Wait for ms milliseconds
 */
function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
