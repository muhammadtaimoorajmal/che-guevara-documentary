// ============================================================
// SCROLL-TRIGGER.JS — CHE GUEVARA: PATRIA O MUERTE
// IntersectionObserver-based scroll reveal system
// ============================================================

class ScrollTrigger {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  init() {
    // Main reveal observer
    this.revealObserver = new IntersectionObserver(
      (entries) => this.handleReveal(entries),
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    // Observe all reveal elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
      this.revealObserver.observe(el);
    });

    // Timeline specific observer
    this.timelineObserver = new IntersectionObserver(
      (entries) => this.handleTimeline(entries),
      { threshold: 0.2 }
    );

    document.querySelectorAll('.timeline-item').forEach(el => {
      this.timelineObserver.observe(el);
    });

    // Counter observer
    this.counterObserver = new IntersectionObserver(
      (entries) => this.handleCounters(entries),
      { threshold: 0.5 }
    );

    document.querySelectorAll('[data-counter]').forEach(el => {
      this.counterObserver.observe(el);
    });

    // Parallax on scroll
    this.initParallax();
  }

  handleReveal(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => {
          el.classList.add('visible');
        }, parseInt(delay));
        // Stop observing once revealed
        this.revealObserver.unobserve(el);
      }
    });
  }

  handleTimeline(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Update progress dots
        const index = parseInt(entry.target.dataset.index || 0);
        this.updateProgressDots(index);
      } else {
        entry.target.classList.remove('active');
      }
    });
  }

  handleCounters(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = true;
        const target = parseFloat(entry.target.dataset.counter);
        const suffix = entry.target.dataset.suffix || '';
        const duration = parseInt(entry.target.dataset.duration || 1500);

        if (!isFinite(target)) {
          entry.target.textContent = '∞';
          return;
        }

        animateCounter(entry.target, target, duration, suffix);
        this.counterObserver.unobserve(entry.target);
      }
    });
  }

  updateProgressDots(activeIndex) {
    const dots = document.querySelectorAll('.progress-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
    });
  }

  initParallax() {
    const heroBg = document.querySelector('.hero-bg');
    if (!heroBg) return;

    const handleScroll = throttle(() => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.35;
      heroBg.style.transform = `translateY(${rate}px)`;
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  // Re-observe newly added elements (e.g., after dynamic render)
  observe(selector) {
    document.querySelectorAll(selector).forEach(el => {
      if (el.classList.contains('reveal') ||
          el.classList.contains('reveal-left') ||
          el.classList.contains('reveal-right') ||
          el.classList.contains('reveal-scale')) {
        this.revealObserver.observe(el);
      }
    });
  }

  observeTimeline() {
    document.querySelectorAll('.timeline-item').forEach(el => {
      this.timelineObserver.observe(el);
    });
  }

  observeCounters() {
    document.querySelectorAll('[data-counter]').forEach(el => {
      this.counterObserver.observe(el);
    });
  }
}

// Navbar scroll effect
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handler = throttle(() => {
    navbar.classList.toggle('scrolled', window.pageYOffset > 50);
  }, 50);

  window.addEventListener('scroll', handler, { passive: true });
}

// Active nav link highlight on scroll
function initActiveNavLinks() {
  const sections = ['hero', 'timeline', 'gallery', 'map-section', 'speeches', 'legacy'];
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href').replace('#', '');
          link.classList.toggle('active', href === id);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

// Global instance
let scrollTriggerInstance = null;

function initScrollTrigger() {
  scrollTriggerInstance = new ScrollTrigger();
  initNavbarScroll();
  initActiveNavLinks();
  return scrollTriggerInstance;
}
