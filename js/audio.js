// ============================================================
// AUDIO.JS — CHE GUEVARA: PATRIA O MUERTE
// Web Speech API integration for quote playback
// ============================================================

class QuoteAudioPlayer {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.preferredVoice = null;
    this.currentCard = null;
    this.isPlaying = false;
    this.queue = [];
    this.queueIndex = -1;
    this.volume = 1.0;
    this.isMuted = false;
    this.globalMuted = false;

    this.loadVoices();
  }

  loadVoices() {
    const load = () => {
      this.voices = this.synth.getVoices();
      this.pickVoice();
    };

    load();
    if (this.voices.length === 0) {
      this.synth.addEventListener('voiceschanged', load, { once: true });
    }
  }

  pickVoice() {
    // Priority: Spanish male > Spanish > any
    const spanish = this.voices.filter(v => v.lang.startsWith('es'));
    this.preferredVoice =
      spanish.find(v => v.name.toLowerCase().includes('male')) ||
      spanish.find(v => !v.name.toLowerCase().includes('female')) ||
      spanish[0] ||
      null;
  }

  buildUtterance(text, lang = 'es-AR') {
    const u = new SpeechSynthesisUtterance(text);
    u.lang   = lang;
    u.rate   = 0.85;
    u.pitch  = 0.9;
    u.volume = this.isMuted || this.globalMuted ? 0 : this.volume;

    if (this.preferredVoice) u.voice = this.preferredVoice;

    return u;
  }

  // Play a single quote
  play(text, cardEl) {
    if (!this.synth) {
      showToast('Speech synthesis not supported in this browser.');
      return;
    }

    // Stop any current speech
    this.stop();

    this.isPlaying = true;
    this.currentCard = cardEl;

    if (cardEl) this.setCardState(cardEl, 'playing');

    const u = this.buildUtterance(text);

    u.onend = () => {
      this.isPlaying = false;
      if (cardEl) this.setCardState(cardEl, 'idle');
      this.currentCard = null;
      // If in queue mode, advance
      if (this.queueIndex >= 0) this.playNext();
    };

    u.onerror = () => {
      this.isPlaying = false;
      if (cardEl) this.setCardState(cardEl, 'idle');
      this.currentCard = null;
    };

    this.synth.speak(u);
  }

  stop() {
    this.synth.cancel();
    this.isPlaying = false;
    if (this.currentCard) {
      this.setCardState(this.currentCard, 'idle');
      this.currentCard = null;
    }
    // Stop queue
    if (this.queueIndex >= 0) {
      this.queueIndex = -1;
      this.queue = [];
      this.updatePlayAllButton(false);
    }
  }

  pause() {
    if (this.synth.speaking && !this.synth.paused) {
      this.synth.pause();
      if (this.currentCard) this.setCardState(this.currentCard, 'paused');
    } else if (this.synth.paused) {
      this.synth.resume();
      if (this.currentCard) this.setCardState(this.currentCard, 'playing');
    }
  }

  // Play all quotes in sequence
  playAll(quotes, cards) {
    this.stop();
    this.queue = quotes.map((q, i) => ({ text: q.audioText || q.quote, card: cards[i] }));
    this.queueIndex = 0;
    this.updatePlayAllButton(true);
    this.playNext();
  }

  playNext() {
    if (this.queueIndex < 0 || this.queueIndex >= this.queue.length) {
      this.queueIndex = -1;
      this.queue = [];
      this.updatePlayAllButton(false);
      return;
    }
    const item = this.queue[this.queueIndex];
    this.queueIndex++;
    this.play(item.text, item.card);
  }

  setCardState(cardEl, state) {
    if (!cardEl) return;
    const btn = cardEl.querySelector('.quote-play-btn');
    const eq  = cardEl.querySelector('.eq-visualizer');

    if (!btn) return;

    switch (state) {
      case 'playing':
        btn.innerHTML = '⏸';
        btn.title = 'Pause';
        if (eq) eq.classList.add('playing');
        break;
      case 'paused':
        btn.innerHTML = '▶';
        btn.title = 'Resume';
        if (eq) eq.classList.remove('playing');
        break;
      case 'idle':
      default:
        btn.innerHTML = '▶';
        btn.title = 'Play Quote';
        if (eq) eq.classList.remove('playing');
        break;
    }
  }

  updatePlayAllButton(playing) {
    const btn = document.getElementById('play-all-btn');
    if (!btn) return;
    btn.textContent = playing ? '⏹ Stop' : '▶ Play All';
    btn.dataset.playing = playing ? '1' : '0';
  }

  setVolume(vol) {
    this.volume = clamp(vol, 0, 1);
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted) this.stop();
  }

  setGlobalMuted(muted) {
    this.globalMuted = muted;
    if (muted) this.stop();
  }
}

// ── Global audio player instance ──────────────────────────────
let quotePlayer = null;

function initAudio() {
  quotePlayer = new QuoteAudioPlayer();
  return quotePlayer;
}

// ── Attach play handlers to all quote cards ───────────────────
function bindQuoteAudio(containerEl) {
  if (!quotePlayer) return;

  containerEl.querySelectorAll('.quote-card').forEach(card => {
    const btn = card.querySelector('.quote-play-btn');
    if (!btn) return;

    const text = card.dataset.audioText || card.dataset.quote || '';

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (quotePlayer.isPlaying && quotePlayer.currentCard === card) {
        quotePlayer.pause();
      } else {
        quotePlayer.play(text, card);
      }
    });
  });

  // Play All button
  const playAllBtn = document.getElementById('play-all-btn');
  if (playAllBtn) {
    playAllBtn.addEventListener('click', () => {
      if (playAllBtn.dataset.playing === '1') {
        quotePlayer.stop();
      } else {
        const cards   = [...containerEl.querySelectorAll('.quote-card:not([style*="display: none"])')];
        const quotes  = cards.map(c => ({ audioText: c.dataset.audioText, quote: c.dataset.quote }));
        quotePlayer.playAll(quotes, cards);
      }
    });
  }

  // Volume slider
  const volSlider = document.getElementById('volume-slider');
  if (volSlider) {
    volSlider.addEventListener('input', (e) => {
      quotePlayer.setVolume(parseFloat(e.target.value));
    });
  }
}
