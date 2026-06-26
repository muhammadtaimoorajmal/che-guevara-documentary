// ============================================================
// MAIN.JS — CHE GUEVARA: PATRIA O MUERTE
// App entry point: theme, nav, speeches section, legacy, tribute
// ============================================================

// ── Theme Management ──────────────────────────────────────────
const ThemeManager = {
  key: 'che-theme',

  get() {
    return localStorage.getItem(this.key) || 'dark';
  },

  set(theme) {
    localStorage.setItem(this.key, theme);
    document.documentElement.setAttribute('data-theme', theme);
    this.updateBtn(theme);
    EventBus.emit('theme:change', { theme });
  },

  toggle() {
    const current = this.get();
    this.set(current === 'dark' ? 'light' : 'dark');
  },

  updateBtn(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
  },

  init() {
    const saved = this.get();
    document.documentElement.setAttribute('data-theme', saved);
    this.updateBtn(saved);

    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', () => this.toggle());
  }
};

// ── Mute Management ───────────────────────────────────────────
const MuteManager = {
  muted: false,

  toggle() {
    this.muted = !this.muted;
    if (quotePlayer) quotePlayer.setGlobalMuted(this.muted);
    this.updateBtn();
  },

  updateBtn() {
    const btn = document.getElementById('mute-toggle');
    if (!btn) return;
    btn.innerHTML = this.muted ? '🔇' : '🔊';
    btn.title = this.muted ? 'Unmute' : 'Mute';
    btn.setAttribute('aria-label', this.muted ? 'Unmute audio' : 'Mute audio');
  },

  init() {
    const btn = document.getElementById('mute-toggle');
    if (btn) btn.addEventListener('click', () => this.toggle());
  }
};

// ── Navigation ────────────────────────────────────────────────
function initNavigation() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');
  const backdrop  = document.getElementById('nav-backdrop');

  function openNav() {
    hamburger?.classList.add('open');
    mobileNav?.classList.add('open');
    backdrop?.classList.add('visible');
    hamburger?.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    hamburger?.classList.remove('open');
    mobileNav?.classList.remove('open');
    backdrop?.classList.remove('visible');
    hamburger?.setAttribute('aria-expanded', 'false');
  }

  hamburger?.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeNav() : openNav();
  });

  backdrop?.addEventListener('click', closeNav);

  // Close on mobile nav link click
  mobileNav?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        scrollToElement(target, 80);
      }
    });
  });
}

// ── Speeches Section ──────────────────────────────────────────
function initSpeeches() {
  const container = document.getElementById('quotes-grid');
  const filterBtns = document.querySelectorAll('.quote-filter-btn');
  if (!container) return;

  let activeFilter = 'all';

  function renderQuotes(quotes) {
    container.innerHTML = '';
    quotes.forEach((q, i) => {
      const card = document.createElement('article');
      card.className = 'quote-card reveal';
      card.dataset.delay = (i % 3) * 70;
      card.dataset.audioText = q.audioText || q.quote;
      card.dataset.quote     = q.quote;
      card.dataset.category  = q.category;

      card.innerHTML = `
        <div class="quote-category">${q.category.toUpperCase()}</div>
        <blockquote class="quote-text">"${q.quote}"</blockquote>
        <div class="quote-translation">🇦🇷 ${q.translation}</div>
        <div class="quote-meta">— ${q.context}, ${q.year}</div>
        <div class="quote-controls">
          <button class="btn btn-icon quote-play-btn"
                  aria-label="Play quote"
                  title="Play Quote">▶</button>
          <div class="eq-visualizer" aria-hidden="true">
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
            <div class="eq-bar"></div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // Re-bind audio
    bindQuoteAudio(container);
    // Re-observe scroll reveal
    if (scrollTriggerInstance) scrollTriggerInstance.observe('.quote-card');
  }

  // Initial render
  renderQuotes(cheQuotes);

  // Filter buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;

      const filtered = activeFilter === 'all'
        ? cheQuotes
        : cheQuotes.filter(q => q.category === activeFilter);

      container.style.opacity = '0';
      setTimeout(() => {
        renderQuotes(filtered);
        container.style.opacity = '1';
        container.style.transition = 'opacity 0.3s ease';
      }, 200);
    });
  });
}

// ── Legacy Section ────────────────────────────────────────────
function initLegacy() {
  const tributeBtn = document.getElementById('tribute-btn');
  if (!tributeBtn) return;

  tributeBtn.addEventListener('click', () => {
    tributeBtn.disabled = true;
    tributeBtn.textContent = '🕯️ Tribute Paid';

    // Create canvas for tribute sparks
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed; inset: 0;
      width: 100%; height: 100%;
      pointer-events: none; z-index: 8000;
    `;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    // Spark burst
    const sparkSys = new ParticleSystem(canvas, { maxParticles: 200, type: 'sparks' });
    sparkSys.burst(120);

    showToast('🕯️ Tribute paid to Ernesto "Che" Guevara. Hasta la victoria siempre.');

    setTimeout(() => {
      canvas.remove();
      tributeBtn.disabled = false;
      tributeBtn.textContent = '🕯️ Pay Tribute';
    }, 4000);
  });
}

// ── Hero counters ─────────────────────────────────────────────
function initHeroCounters() {
  // Already handled by scroll-trigger observeCounters()
  // Ensure re-observer after DOM ready
  if (scrollTriggerInstance) scrollTriggerInstance.observeCounters();
}

// ── Skip to content ───────────────────────────────────────────
function initSkipToContent() {
  const skip = document.createElement('a');
  skip.href = '#timeline';
  skip.textContent = 'Skip to main content';
  skip.className = 'sr-only';
  skip.style.cssText = `
    position:fixed; top:8px; left:8px; z-index:99999;
    background:var(--clr-red); color:#fff;
    padding:8px 16px; border-radius:4px;
    font-family:'Cinzel',serif; font-size:0.8rem;
  `;
  skip.addEventListener('focus', () => { skip.style.clip = 'auto'; skip.style.width = 'auto'; skip.style.height = 'auto'; });
  skip.addEventListener('blur',  () => { skip.style.clip = ''; skip.style.width = '1px'; skip.style.height = '1px'; });
  document.body.prepend(skip);
}

// ── Main init (called after opening sequence) ─────────────────
function initApp() {
  // Reveal main content
  const main = document.getElementById('main-content');
  if (main) {
    requestAnimationFrame(() => main.classList.add('visible'));
  }

  // Modules
  ThemeManager.init();
  MuteManager.init();
  initNavigation();
  initSkipToContent();

  // Init audio first (other modules depend on quotePlayer)
  initAudio();

  // Feature modules
  initTimeline();
  initGallery();
  initSpeeches();
  initLegacy();
  initMap();

  // Scroll system (must come after DOM is rendered)
  const st = initScrollTrigger();

  // Custom cursor
  initCursor();

  // Hero stat counters
  initHeroCounters();

  // Preload voices for speech synthesis
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
  }
}

// ── Entry point ───────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Set initial theme immediately
  const savedTheme = localStorage.getItem('che-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Run opening sequence, then init app
  initOpeningSequence(() => {
    initApp();
  });
});
