// ============================================================
// TIMELINE.JS — CHE GUEVARA: PATRIA O MUERTE
// Renders timeline from timelineEvents data, manages Play Journey
// All 14 events use UNIQUE images — no duplicates
// ============================================================

// Unique image mapping — every event gets a distinct image
const timelineImages = {
  "birth-1928":          "Assets/Images/ernesto-che-guevara.jpg",
  "motorcycle-1952":     "Assets/Images/images (1).jpg",
  "guatemala-1953":      "Assets/Images/images (3).jpg",
  "fidel-1955":          "Assets/Images/CheyFidel.jpg",
  "granma-1956":         "Assets/Images/images.jpg",
  "sierra-maestra-1957": "Assets/Images/comandante-ernesto-che-guevara.jpg",
  "havana-1959":         "Assets/Images/castro_che_guevara_03.jpg__1000x1087_q85_crop_subsampling-2_upscale.jpg",
  "government-1960":     "Assets/Images/141013-che-guevara.jpg",
  "un-speech-1964":      "Assets/Images/00279847-682x1024.jpg",
  "farewell-letter-1965":"Assets/Images/Che_Guevara_-_Guerrillero_Heroico_by_Alberto_Korda.jpg",
  "congo-1965":          "Assets/Images/images (4).jpg",
  "bolivia-1966":        "Assets/Images/par115252-teaser-xxl.jpg",
  "capture-1967":        "Assets/Images/images (2).jpg",
  "return-1997":         "Assets/Images/Che_Guevara_(3x4_close_cropped).jpg"
};

class Timeline {
  constructor() {
    this.track = document.getElementById('timeline-track');
    this.progressBar = document.getElementById('timeline-progress');
    this.playBtn = document.getElementById('timeline-play-btn');
    this.resetBtn = document.getElementById('timeline-reset-btn');
    this.isPlaying = false;
    this.playTimeout = null;
    this.currentIndex = 0;
    this.events = timelineEvents; // from timeline-data.js
  }

  init() {
    if (!this.track) return;
    this.render();
    this.buildProgressBar();
    this.bindControls();
  }

  render() {
    this.track.innerHTML = '';

    this.events.forEach((event, index) => {
      const item = document.createElement('div');
      // CRITICAL: HTML child order must match CSS grid assignment:
      // odd  → card | node | spacer  (card col-1, node col-2, spacer col-3)
      // even → spacer | node | card  (spacer col-1, node col-2, card col-3)
      item.className = 'timeline-item reveal';
      item.dataset.index = index;
      item.dataset.id = event.id;
      item.dataset.delay = Math.min((index % 4) * 80, 200);

      const imgSrc = timelineImages[event.id] || '';
      const typeColor = this.getTypeColor(event.type);
      const isEven = index % 2 !== 0; // 0-indexed: 0=odd item 1 in CSS, 1=even item 2 in CSS

      // Build the node HTML
      const nodeHTML = `
        <div class="timeline-node">
          <div class="timeline-dot" style="border-color:${typeColor};" title="${event.title}">
            <span aria-hidden="true">${event.icon}</span>
          </div>
          <div class="timeline-year">${event.year}</div>
        </div>`;

      // Build the card HTML
      const cardHTML = `
        <div class="timeline-card" role="article" aria-label="${event.title}">
          ${imgSrc ? `
          <div class="timeline-card-img-wrap">
            <img class="timeline-card-image"
                 src="${imgSrc}"
                 alt="${event.title}"
                 loading="lazy"
                 onerror="this.closest('.timeline-card-img-wrap').style.display='none'">
          </div>` : ''}
          <div class="timeline-card-body">
            <div class="timeline-card-location">
              <span aria-hidden="true">📍</span> ${event.location}
            </div>
            <h3 class="timeline-card-title">${event.title}</h3>
            <p class="timeline-card-desc">${event.description}</p>
            <div class="timeline-card-details" id="details-${event.id}">
              ${event.details}
            </div>
            <blockquote class="timeline-card-quote" aria-label="Che Guevara quote">
              "${event.quote}"
            </blockquote>
            <div class="timeline-card-actions">
              <button class="btn btn-secondary expand-btn"
                      data-target="details-${event.id}"
                      aria-expanded="false"
                      aria-controls="details-${event.id}">
                Read More
              </button>
              <button class="btn btn-secondary quote-play-btn"
                      data-text="${(event.audioText || event.quote).replace(/"/g, '&quot;')}"
                      aria-label="Hear this quote">
                ▶ Hear Quote
              </button>
              <button class="btn btn-secondary map-view-btn"
                      data-location="${event.locationId}"
                      aria-label="View on map">
                🗺 Map
              </button>
            </div>
          </div>
        </div>`;

      const spacerHTML = `<div class="timeline-spacer" aria-hidden="true"></div>`;

      // CSS nth-child(odd) = 1st, 3rd, 5th… → index 0, 2, 4…
      // For those: card first, then node, then spacer
      // CSS nth-child(even) = 2nd, 4th, 6th… → index 1, 3, 5…
      // For those: spacer first, then node, then card
      if (index % 2 === 0) {
        // odd in CSS terms: card | node | spacer
        item.innerHTML = cardHTML + nodeHTML + spacerHTML;
      } else {
        // even in CSS terms: spacer | node | card
        item.innerHTML = spacerHTML + nodeHTML + cardHTML;
      }

      this.track.appendChild(item);
    });

    // Bind all card interactive buttons
    this.bindCardActions();

    // Re-observe for scroll trigger
    if (typeof scrollTriggerInstance !== 'undefined' && scrollTriggerInstance) {
      scrollTriggerInstance.observeTimeline();
      scrollTriggerInstance.observe('.timeline-item');
    }
  }

  getTypeColor(type) {
    const colors = {
      birth:      '#cc0000',
      travel:     '#d4a017',
      political:  '#3a86ff',
      meeting:    '#22cc66',
      expedition: '#cc0000',
      military:   '#cc6600',
      victory:    '#cc0000',
      government: '#8866aa',
      speech:     '#3a86ff',
      departure:  '#d4a017',
      death:      '#cc0000',
      memorial:   '#d4a017'
    };
    return colors[type] || '#cc0000';
  }

  buildProgressBar() {
    if (!this.progressBar) return;
    this.progressBar.innerHTML = '';
    this.events.forEach((ev, i) => {
      const dot = document.createElement('button');
      dot.className = 'progress-dot';
      dot.title = `${ev.year}: ${ev.title}`;
      dot.dataset.index = i;
      dot.setAttribute('aria-label', ev.title);
      dot.addEventListener('click', () => {
        const item = this.track.querySelectorAll('.timeline-item')[i];
        if (item) scrollToElement(item, 100);
      });
      this.progressBar.appendChild(dot);
    });
  }

  bindCardActions() {
    // Expand / collapse
    this.track.querySelectorAll('.expand-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const details  = document.getElementById(targetId);
        if (!details) return;
        const expanded = details.classList.toggle('expanded');
        btn.textContent = expanded ? 'Show Less' : 'Read More';
        btn.setAttribute('aria-expanded', String(expanded));
      });
    });

    // Quote speech
    this.track.querySelectorAll('.quote-play-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.text;
        if (typeof quotePlayer !== 'undefined' && quotePlayer) {
          quotePlayer.play(text, btn.closest('.timeline-card'));
        } else if (window.speechSynthesis) {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = 'es-AR';
          u.rate = 0.85;
          window.speechSynthesis.speak(u);
        }
      });
    });

    // Map view
    this.track.querySelectorAll('.map-view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const locationId = btn.dataset.location;
        const mapSection = document.getElementById('map-section');
        if (mapSection) scrollToElement(mapSection, 80);
        if (typeof EventBus !== 'undefined') EventBus.emit('map:highlight', { locationId });
        showToast('📍 Location highlighted on the map below');
      });
    });
  }

  bindControls() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        this.isPlaying ? this.stopJourney() : this.playJourney();
      });
    }
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        this.stopJourney();
        this.resetTimeline();
      });
    }
  }

  playJourney() {
    this.isPlaying = true;
    if (this.playBtn) {
      this.playBtn.innerHTML = '⏹ Stop Journey';
    }
    this.currentIndex = 0;
    this.advanceJourney();
  }

  advanceJourney() {
    if (!this.isPlaying || this.currentIndex >= this.events.length) {
      this.stopJourney();
      return;
    }

    const items = this.track.querySelectorAll('.timeline-item');
    const item  = items[this.currentIndex];

    if (item) {
      scrollToElement(item, 120);
      items.forEach(el => el.classList.remove('journey-active'));
      item.classList.add('journey-active', 'active');

      if (typeof scrollTriggerInstance !== 'undefined' && scrollTriggerInstance) {
        scrollTriggerInstance.updateProgressDots(this.currentIndex);
      }

      const ev = this.events[this.currentIndex];
      if (typeof quotePlayer !== 'undefined' && quotePlayer && !quotePlayer.globalMuted) {
        quotePlayer.play(ev.audioText || ev.quote, item.querySelector('.timeline-card'));
      }
    }

    this.currentIndex++;
    this.playTimeout = setTimeout(() => this.advanceJourney(), 4000);
  }

  stopJourney() {
    this.isPlaying = false;
    if (this.playBtn) this.playBtn.innerHTML = '▶ Play Journey';
    clearTimeout(this.playTimeout);
    if (typeof quotePlayer !== 'undefined' && quotePlayer) quotePlayer.stop();
  }

  resetTimeline() {
    this.currentIndex = 0;
    this.track.querySelectorAll('.timeline-item').forEach(el => {
      el.classList.remove('journey-active', 'active');
    });
    const timelineSection = document.getElementById('timeline');
    if (timelineSection) scrollToElement(timelineSection, 80);
    showToast('Timeline reset to beginning.');
  }
}

let timelineInstance = null;

function initTimeline() {
  timelineInstance = new Timeline();
  timelineInstance.init();
  return timelineInstance;
}
