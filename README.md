# CHE GUEVARA: PATRIA O MUERTE 🔥
### The Definitive Interactive Documentary

> *"Hasta la victoria siempre." — Ernesto "Che" Guevara*

An immersive, cinematic single-page interactive documentary about the life of Ernesto "Che" Guevara (1928–1967) — built entirely with pure HTML, CSS, and vanilla JavaScript. No frameworks. No build tools. Deploy directly to GitHub Pages.

---

## 🎬 Features

### Opening Cinematic Sequence
- **WebAudio API** — synthesized match strike sound
- **Canvas particle system** — floating stars, flame, smoke, embers
- **Dramatic portrait reveal** — radial flame illumination from below
- **Web Speech API** — voice narration in Argentine Spanish
- **Burning text animation** — "PATRIA O MUERTE" burns onto screen
- Click anywhere or press any key to skip

### 📜 Interactive Timeline (14 events, 1928–1997)
- Alternating card layout with scroll-triggered reveals
- Expandable "Read More" sections for full historical accounts
- 🎤 "Hear Quote" button — speaks each quote in Spanish
- 🗺️ "View on Map" — highlights location on the interactive map
- ▶️ "Play Journey" — auto-scrolls through all events with TTS narration

### 📸 Photo Gallery
- Masonry grid layout with all 15 real images
- Category filters: All | Portraits | Cuba | Speeches | Travel
- Full-screen lightbox with metadata
- Keyboard navigation (Arrow keys, Escape)
- Touch swipe support on mobile
- Film grain CSS aesthetic overlay

### 🗺️ Interactive World Map
- Canvas-drawn world map (no external APIs)
- 14 animated location markers with pulsing rings
- Hover popups with event information
- Click markers to highlight and get details
- **Animated journey paths** — bezier curves connecting all locations
- ▶️ "Play Journey" traces the full path from Rosario to Bolivia

### 🎤 Speeches & Quotes
- 20 quotes with Spanish/English text
- Category filters: Famous | Ideology | Historical | Personal
- Per-card Web Speech API playback with Argentine Spanish voice
- Equalizer animation during speech
- "Play All" queue system
- Volume slider control

### 🕯️ Legacy Section
- CSS animated eternal flame (multi-layer gradient)
- Statistics: books, monuments, generations
- **"Pay Tribute"** — canvas spark burst animation
- Korda portrait with dramatic breathing animation

### 🎨 Design
- **Dark/Light theme** toggle (persisted in localStorage)
- **Custom cursor** with glow ring and click ripples
- **Parallax** hero background on scroll
- **Film grain** texture overlay for period authenticity
- **Smooth scroll-triggered reveals** (IntersectionObserver)
- Google Fonts: Cinzel + Playfair Display + Roboto
- **Fully responsive**: 1200px / 1024px / 768px / 480px

---

## 📁 File Structure

```
├── index.html               Main application
├── .nojekyll                GitHub Pages config
├── css/
│   ├── themes.css           Dark/light CSS custom properties
│   ├── animations.css       All @keyframes + utility classes
│   ├── style.css            Layout, components, sections
│   └── responsive.css       Breakpoint media queries
├── js/
│   ├── main.js              App initialization & orchestration
│   ├── opening-sequence.js  Cinematic intro engine
│   ├── timeline.js          Timeline renderer & Play Journey
│   ├── gallery.js           Masonry gallery, lightbox, filters
│   ├── map.js               Canvas world map & journey animation
│   ├── audio.js             Web Speech API quote player
│   ├── particles.js         Canvas particle system
│   ├── scroll-trigger.js    IntersectionObserver system
│   ├── cursor-effects.js    Custom cursor
│   └── utils.js             Shared helpers & easing
├── data/
│   ├── timeline-data.js     14 timeline events (JS const)
│   ├── quotes-data.js       20 quotes (JS const)
│   └── locations-data.js    Map coordinates (JS const)
└── Assets/
    └── Images/              15 real Che Guevara photographs
```

---

## 🚀 GitHub Pages Deployment

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Set source to **`/ (root)`** of main branch
4. Your site will be live at `https://yourusername.github.io/repo-name/`

The `.nojekyll` file ensures GitHub Pages serves all files correctly without Jekyll processing.

---

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |

> **Note**: Web Speech API voice quality varies by browser. Chrome provides the best experience for Argentine Spanish (`es-AR`).

---

## 🛠️ Local Development

No build tools required. Simply open `index.html` in any modern browser:

```bash
# Option 1: Direct open
# Double-click index.html

# Option 2: Local server (recommended for best experience)
npx serve .
# or
python -m http.server 8000
```

---

## 📖 Historical Content

All historical content is based on documented sources:
- *The Motorcycle Diaries* — Ernesto Che Guevara
- *Guerrilla Warfare* — Ernesto Che Guevara
- *The Bolivian Diary* — Ernesto Che Guevara
- Anderson, Jon Lee — *Che Guevara: A Revolutionary Life*
- Castañeda, Jorge — *Compañero: The Life and Death of Che Guevara*

---

## 👨‍💻 Author

**Muhammad Taimoor Ajmal**
- GitHub: [@muhammadtaimoorajmal](https://github.com/muhammadtaimoorajmal)
- LinkedIn: [muhammadtaimoorajmal](https://www.linkedin.com/in/muhammadtaimoorajmal/)

---

*"If you tremble with indignation at every injustice, then you are a comrade of mine." — Che Guevara*
