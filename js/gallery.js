// ============================================================
// GALLERY.JS — CHE GUEVARA: PATRIA O MUERTE
// Masonry gallery with filtering, lightbox, keyboard nav, swipe
// ============================================================

const galleryData = [
  {
    src: "Assets/Images/Che_Guevara_-_Guerrillero_Heroico_by_Alberto_Korda.jpg",
    title: "Guerrillero Heroico",
    date: "March 5, 1960",
    location: "Havana, Cuba",
    description: "Alberto Korda's iconic photograph, taken at a memorial service for victims of the La Coubre explosion. The most reproduced photograph in history.",
    category: "portraits",
    tags: ["Portrait", "Iconic", "Korda"]
  },
  {
    src: "Assets/Images/141013-che-guevara.jpg",
    title: "The Comandante",
    date: "1963",
    location: "Havana, Cuba",
    description: "Che in his olive-green uniform, the symbol of the Cuban revolution, photographed in Havana during his years as minister.",
    category: "cuba",
    tags: ["Cuba", "Portrait", "Revolution"]
  },
  {
    src: "Assets/Images/ernesto-che-guevara.jpg",
    title: "Young Ernesto",
    date: "1950",
    location: "Buenos Aires, Argentina",
    description: "A young Ernesto Guevara before the motorcycle journey that would transform him from medical student into revolutionary.",
    category: "portraits",
    tags: ["Youth", "Argentina", "Early Life"]
  },
  {
    src: "Assets/Images/comandante-ernesto-che-guevara.jpg",
    title: "Mountain Commander",
    date: "1957",
    location: "Sierra Maestra, Cuba",
    description: "Che during the Sierra Maestra guerrilla campaign — the mountain warfare that forged the Cuban revolution.",
    category: "cuba",
    tags: ["Sierra Maestra", "Military", "Cuba"]
  },
  {
    src: "Assets/Images/CheyFidel.jpg",
    title: "Che y Fidel",
    date: "1959",
    location: "Havana, Cuba",
    description: "The two commanders of the Cuban revolution — Che Guevara and Fidel Castro — united by a historic friendship forged in Mexico City.",
    category: "cuba",
    tags: ["Fidel", "Cuba", "Victory"]
  },
  {
    src: "Assets/Images/castro_che_guevara_03.jpg__1000x1087_q85_crop_subsampling-2_upscale.jpg",
    title: "Revolutionary Brothers",
    date: "1960",
    location: "Havana, Cuba",
    description: "Castro and Che, architects of the Cuban revolution, in the early years of the new government.",
    category: "cuba",
    tags: ["Castro", "Cuba", "Government"]
  },
  {
    src: "Assets/Images/par115252-teaser-xxl.jpg",
    title: "Final Campaign",
    date: "1967",
    location: "Bolivia",
    description: "Che during the Bolivian campaign — exhausted, ill, but resolute. This is among the last photographs taken before his capture.",
    category: "travel",
    tags: ["Bolivia", "Final", "Campaign"]
  },
  {
    src: "Assets/Images/00279847-682x1024.jpg",
    title: "United Nations Address",
    date: "December 11, 1964",
    location: "New York, USA",
    description: "Che at the United Nations General Assembly, delivering his electrifying indictment of imperialism. 'Patria o muerte!'",
    category: "speeches",
    tags: ["UN", "Speech", "New York"]
  },
  {
    src: "Assets/Images/61NpPy41MWL._AC_UF894,1000_QL80_.jpg",
    title: "The Strategist",
    date: "1961",
    location: "Havana, Cuba",
    description: "Che in contemplation — the doctor-turned-guerrilla-commander who became Cuba's chief economic strategist.",
    category: "portraits",
    tags: ["Portrait", "Intellectual"]
  },
  {
    src: "Assets/Images/Che_Guevara_(3x4_close_cropped).jpg",
    title: "Beret & Stars",
    date: "1965",
    location: "Havana, Cuba",
    description: "The iconic beret with the single star — a symbol that would become one of the most recognized images of the 20th century.",
    category: "portraits",
    tags: ["Portrait", "Iconic", "Beret"]
  },
  {
    src: "Assets/Images/images.jpg",
    title: "Voice of the Revolution",
    date: "1960",
    location: "Cuba",
    description: "Addressing crowds in Cuba during the revolutionary government's early years — a period of immense optimism and transformation.",
    category: "speeches",
    tags: ["Speech", "Cuba", "Revolution"]
  },
  {
    src: "Assets/Images/images (1).jpg",
    title: "On the Road",
    date: "1952",
    location: "South America",
    description: "The journey that began with a motorcycle and ended with a revolution — the South American odyssey that shaped Che's worldview.",
    category: "travel",
    tags: ["Motorcycle", "Journey", "Argentina"]
  },
  {
    src: "Assets/Images/images (2).jpg",
    title: "The Doctor Revolutionary",
    date: "1959",
    location: "Cuba",
    description: "Che never abandoned his medical identity even as he rose to become one of Cuba's most powerful commanders.",
    category: "portraits",
    tags: ["Doctor", "Portrait", "Cuba"]
  },
  {
    src: "Assets/Images/images (3).jpg",
    title: "Sierra Maestra Guerrilla",
    date: "1958",
    location: "Cuba",
    description: "In the mountains that became the cradle of the revolution — the Sierra Maestra, where a few hundred rebels defied an army.",
    category: "cuba",
    tags: ["Sierra Maestra", "Guerrilla", "Cuba"]
  },
  {
    src: "Assets/Images/images (4).jpg",
    title: "International Revolutionary",
    date: "1964",
    location: "Africa/Latin America",
    description: "Che's vision extended beyond Cuba — he sought to ignite revolutionary fires across three continents.",
    category: "travel",
    tags: ["International", "Africa", "Revolution"]
  }
];

class Gallery {
  constructor() {
    this.grid = document.getElementById('gallery-grid');
    this.filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
    this.currentFilter = 'all';
    this.lightbox = document.getElementById('lightbox');
    this.lightboxImg = document.getElementById('lightbox-img');
    this.lightboxTitle = document.getElementById('lightbox-title');
    this.lightboxDesc  = document.getElementById('lightbox-desc');
    this.lightboxMeta  = document.getElementById('lightbox-meta');
    this.currentIndex  = 0;
    this.visibleItems  = [];

    // Touch swipe state
    this.touchStartX = 0;
    this.touchStartY = 0;
  }

  init() {
    if (!this.grid) return;
    this.render(galleryData);
    this.bindFilters();
    this.bindLightbox();
    this.bindKeyboard();
    this.bindTouch();
  }

  render(items) {
    this.grid.innerHTML = '';
    this.visibleItems = items;

    items.forEach((item, index) => {
      const el = document.createElement('div');
      el.className = 'gallery-item reveal-scale';
      el.dataset.delay = (index % 4) * 60;
      el.dataset.index = index;
      el.dataset.category = item.category;
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', `View: ${item.title}`);

      el.innerHTML = `
        <img src="${item.src}"
             alt="${item.title}"
             loading="lazy"
             onerror="this.src='';this.alt='Image not available'">
        <div class="gallery-overlay">
          <h4>${item.title}</h4>
          <p>${item.date} · ${item.location}</p>
          <div class="gallery-tags">
            ${item.tags.map(t => `<span class="gallery-tag">${t}</span>`).join('')}
          </div>
        </div>
      `;

      el.addEventListener('click', () => this.openLightbox(index));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openLightbox(index);
        }
      });

      this.grid.appendChild(el);
    });

    // Re-observe for scroll trigger
    if (scrollTriggerInstance) scrollTriggerInstance.observe('.gallery-item');
  }

  bindFilters() {
    this.filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        this.currentFilter = filter;

        const filtered = filter === 'all'
          ? galleryData
          : galleryData.filter(item => item.category === filter);

        // Animate out then re-render
        this.grid.style.opacity = '0';
        setTimeout(() => {
          this.render(filtered);
          this.grid.style.opacity = '1';
          this.grid.style.transition = 'opacity 0.4s ease';
        }, 250);
      });
    });
  }

  openLightbox(index) {
    this.currentIndex = index;
    this.updateLightboxContent();
    this.lightbox.classList.add('open');
    this.lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus close button
    setTimeout(() => {
      const closeBtn = document.getElementById('lightbox-close');
      if (closeBtn) closeBtn.focus();
    }, 100);
  }

  closeLightbox() {
    this.lightbox.classList.remove('open');
    this.lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  updateLightboxContent() {
    const item = this.visibleItems[this.currentIndex];
    if (!item) return;

    if (this.lightboxImg) {
      this.lightboxImg.src = item.src;
      this.lightboxImg.alt = item.title;
    }
    if (this.lightboxTitle) this.lightboxTitle.textContent = item.title;
    if (this.lightboxDesc)  this.lightboxDesc.textContent  = item.description;
    if (this.lightboxMeta)  this.lightboxMeta.innerHTML = `
      <div><span>Date:</span> ${item.date}</div>
      <div><span>Location:</span> ${item.location}</div>
      <div><span>Category:</span> ${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</div>
    `;
  }

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.visibleItems.length) % this.visibleItems.length;
    this.updateLightboxContent();
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.visibleItems.length;
    this.updateLightboxContent();
  }

  bindLightbox() {
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn  = document.getElementById('lightbox-prev');
    const nextBtn  = document.getElementById('lightbox-next');

    if (closeBtn) closeBtn.addEventListener('click', () => this.closeLightbox());
    if (prevBtn)  prevBtn.addEventListener('click',  () => this.prev());
    if (nextBtn)  nextBtn.addEventListener('click',  () => this.next());

    // Close on backdrop click
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.closeLightbox();
    });
  }

  bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (!this.lightbox.classList.contains('open')) return;
      switch(e.key) {
        case 'Escape':     this.closeLightbox(); break;
        case 'ArrowLeft':  this.prev(); break;
        case 'ArrowRight': this.next(); break;
      }
    });
  }

  bindTouch() {
    if (!this.lightbox) return;

    this.lightbox.addEventListener('touchstart', (e) => {
      this.touchStartX = e.changedTouches[0].screenX;
      this.touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    this.lightbox.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].screenX - this.touchStartX;
      const dy = Math.abs(e.changedTouches[0].screenY - this.touchStartY);
      if (Math.abs(dx) > 50 && dy < 80) {
        dx < 0 ? this.next() : this.prev();
      }
    }, { passive: true });
  }
}

let galleryInstance = null;

function initGallery() {
  galleryInstance = new Gallery();
  galleryInstance.init();
  return galleryInstance;
}
