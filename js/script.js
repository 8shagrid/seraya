'use strict';

// =============================================
// Constants & State
// =============================================
const ITEMS_PER_PAGE = 16;
const TEASER_COUNT = 8;

let currentPage = 1;
let filteredThemes = [];

const galleryState = {
  search: '',
  acara: 'all',
  tipe: 'all'
};

// =============================================
// Init
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initSakuraPetals();
  initModal(); // inject modal DOM into body

  if (document.getElementById('themeGallery')) {
    // themes.html — full catalog
    initThemeGallery();
  }

  if (document.getElementById('teaserGallery')) {
    // index.html — teaser section
    initTeaserGallery();
  }

  initAccordion();
});

// =============================================
// Mobile Menu Toggle
// =============================================
function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// =============================================
// Smooth Scroll (with header offset)
// =============================================
function initSmoothScroll() {
  const HEADER_OFFSET = 80;

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const top = targetEl.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// =============================================
// Sakura Petal Rain
// =============================================
const PETAL_CONFIG = {
  interval: 900,
  lifetime: 9000,
  minSize: 12,
  maxSizeExtra: 20,
  minDuration: 4,
  maxDurationExtra: 5
};

function createPetal() {
  const petal = document.createElement('div');
  petal.classList.add('sakura-petal');
  petal.textContent = '🌸';
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.fontSize = `${Math.random() * PETAL_CONFIG.maxSizeExtra + PETAL_CONFIG.minSize}px`;
  petal.style.animationDuration = `${Math.random() * PETAL_CONFIG.maxDurationExtra + PETAL_CONFIG.minDuration}s`;
  petal.style.animationDelay = `${Math.random() * 5}s`;
  document.body.appendChild(petal);
  setTimeout(() => petal.remove(), PETAL_CONFIG.lifetime);
}

function initSakuraPetals() {
  if (
    document.body.classList.contains('editorial-home') ||
    document.body.classList.contains('editorial-themes')
  ) return;
  setInterval(createPetal, PETAL_CONFIG.interval);
}

// =============================================
// Preview Modal — build & inject
// =============================================
function initModal() {
  if (document.getElementById('previewModal')) return; // guard

  const modalEl = document.createElement('div');
  modalEl.id = 'previewModal';
  modalEl.className = 'preview-modal-overlay';
  modalEl.setAttribute('role', 'dialog');
  modalEl.setAttribute('aria-modal', 'true');
  modalEl.setAttribute('aria-label', 'Preview Tema Undangan');

  modalEl.innerHTML = `
    <div class="preview-modal-container" id="modalContainer">

      <!-- Close button -->
      <button class="modal-close-btn" id="modalCloseBtn" aria-label="Tutup preview">
        <span aria-hidden="true">X</span>
      </button>

      <div class="modal-body">

        <!-- ── Left: Preview stage ── -->
        <div class="modal-phone-panel">
          <div class="phone-screen modal-preview-stage">
            <!-- Loading spinner -->
            <div id="iframeLoader" class="iframe-loader">
              <div class="iframe-spinner"></div>
              <p>Memuat preview...</p>
            </div>
            <!-- Live iframe preview -->
            <iframe id="modalIframe" class="phone-preview-iframe"
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    loading="lazy"
                    allowfullscreen></iframe>
            <!-- Fallback thumbnail if iframe fails -->
            <img id="modalThumbImg" src="" alt="Preview tema" class="phone-preview-img" style="display:none;">
          </div>
        </div>

        <!-- ── Right: Info panel ── -->
        <div class="modal-info-panel">
          <div id="modalBadges" class="modal-badges-row"></div>

          <h2 id="modalThemeName" class="modal-theme-name">—</h2>

          <div id="modalUsageRow" class="modal-usage-row">
            <span id="modalUsage" class="modal-usage-text"></span>
          </div>

          <div class="modal-divider"></div>

          <p class="modal-desc-text">
            Suka desain ini? Hubungi kami via WhatsApp dan tim Seraya akan
            membantu menyesuaikan undangan dengan data Anda.
            Proses cepat &amp; revisi unlimited!
          </p>

          <a id="modalWaBtn" href="#" target="_blank" class="modal-btn-primary">
            Pesan Tema Ini via WA
          </a>

          <a id="modalFallbackLink" href="#" target="_blank" class="modal-btn-secondary modal-btn-hidden">
            Buka Demo di Tab Baru
          </a>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modalEl);

  // ── Event listeners ──
  document.getElementById('modalCloseBtn').addEventListener('click', closePreviewModal);

  modalEl.addEventListener('click', e => {
    if (e.target === modalEl) closePreviewModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePreviewModal();
  });
}

// Open modal and populate with theme data
function openPreviewModal(theme) {
  const modal = document.getElementById('previewModal');
  if (!modal) return;

  // Populate info
  const usageText = typeof theme.usage === 'string' ? theme.usage.trim() : '';
  const usageNum = parseInt(usageText, 10) || 0;
  const heatIcon = usageNum >= 100 ? '🔥' : usageNum >= 50 ? '⭐' : '💌';
  const mainType = theme.acara[0] || theme.tipe[0] || 'Design';
  const color = getPlaceholderColor(mainType);
  const thumbUrl = theme.thumbnail
    || `https://placehold.co/400x600/${color}/880E4F?text=${encodeURIComponent(theme.name)}`;

  document.getElementById('modalThemeName').textContent = theme.name;
  document.getElementById('modalUsage').textContent = usageText ? `${heatIcon} ${usageText}` : '';
  document.getElementById('modalUsageRow').style.display = usageText ? '' : 'none';

  const allBadges = [...theme.acara, ...theme.tipe];
  document.getElementById('modalBadges').innerHTML = allBadges
    .map(b => `<span class="modal-badge">${b}</span>`)
    .join('');

  // Setup iframe — load the actual preview URL
  const iframe = document.getElementById('modalIframe');
  const thumbImg = document.getElementById('modalThumbImg');
  const loader = document.getElementById('iframeLoader');
  const fallbackLink = document.getElementById('modalFallbackLink');
  const isIframeBlockedSource = isKnownIframeBlockedUrl(theme.url);

  // Reset state
  iframe.style.display = 'block';
  thumbImg.style.display = 'none';
  loader.style.display = 'flex';
  iframe.src = ''; // clear previous
  fallbackLink.classList.add('modal-btn-hidden');
  fallbackLink.href = theme.url;

  // Prepare fallback thumbnail
  thumbImg.src = thumbUrl;
  thumbImg.alt = theme.name;

  // Known providers like katalog.seraya.my.id block iframe embedding,
  // so show the thumbnail directly instead of a browser error page.
  if (isIframeBlockedSource) {
    iframe.style.display = 'none';
    thumbImg.style.display = 'block';
    loader.style.display = 'none';
    fallbackLink.classList.remove('modal-btn-hidden');
  } else {
    // Load iframe with theme URL
    iframe.src = theme.url;

    // When iframe loads successfully, hide loader
    iframe.onload = () => {
      loader.style.display = 'none';
    };

    // Fallback: if iframe blocked (X-Frame-Options), show thumbnail after timeout
    const fallbackTimer = setTimeout(() => {
      if (loader.style.display !== 'none') {
        iframe.style.display = 'none';
        thumbImg.style.display = 'block';
        loader.style.display = 'none';
        fallbackLink.classList.remove('modal-btn-hidden');
      }
    }, 8000);

    // Store timer so we can clear on close
    modal._fallbackTimer = fallbackTimer;
  }

  const waMsg = `Halo%20Seraya%2C%20saya%20tertarik%20dengan%20tema%20*${encodeURIComponent(theme.name)}*`;
  document.getElementById('modalWaBtn').href = `https://wa.me/6289679160870?text=${waMsg}`;

  // Show modal
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePreviewModal() {
  const modal = document.getElementById('previewModal');
  if (!modal) return;

  // Stop iframe loading & clear fallback timer
  const iframe = document.getElementById('modalIframe');
  if (iframe) iframe.src = '';
  if (modal._fallbackTimer) clearTimeout(modal._fallbackTimer);

  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function isKnownIframeBlockedUrl(url) {
  try {
    const { hostname } = new URL(url);
    return hostname.includes('katalog.seraya.my.id');
  } catch {
    return false;
  }
}

// =============================================
// Teaser Gallery — index.html (6 picked themes)
// =============================================
function initTeaserGallery() {
  const teaserData = window.FEATURED_THEMES || window.THEMES_DATA;
  if (!Array.isArray(teaserData) || teaserData.length === 0) return;
  const teaserGallery = document.getElementById('teaserGallery');
  if (!teaserGallery) return;

  const randomizedThemes = shuffleArray(teaserData).slice(0, Math.min(TEASER_COUNT, teaserData.length));

  const fragment = document.createDocumentFragment();
  randomizedThemes.forEach(theme => {
    fragment.appendChild(createThemeCard(theme));
  });
  teaserGallery.appendChild(fragment);
}

function shuffleArray(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
  }
  return shuffled;
}

// =============================================
// Full Theme Gallery — themes.html
// =============================================
function initThemeGallery() {
  const themeGallery = document.getElementById('themeGallery');
  const themeSearch = document.getElementById('themeSearch');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const mobileAcaraFilter = document.getElementById('mobileAcaraFilter');
  const mobileTipeFilter = document.getElementById('mobileTipeFilter');

  if (!themeGallery || typeof THEMES_DATA === 'undefined') return;

  filteredThemes = [...THEMES_DATA];
  syncFilterControls();
  updateGallery();

  // Search
  if (themeSearch) {
    themeSearch.addEventListener('input', e => {
      galleryState.search = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  // Filter buttons (acara + tipe)
  document.querySelectorAll('.filter-btn, .filter-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      const { group, filter } = btn.dataset;
      setGalleryFilter(group, filter);
      syncFilterControls();
      applyFilters();
    });
  });

  if (mobileAcaraFilter) {
    mobileAcaraFilter.addEventListener('change', e => {
      setGalleryFilter('acara', e.target.value);
      syncFilterControls();
      applyFilters();
    });
  }

  if (mobileTipeFilter) {
    mobileTipeFilter.addEventListener('change', e => {
      setGalleryFilter('tipe', e.target.value);
      syncFilterControls();
      applyFilters();
    });
  }

  // Load more
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      currentPage++;
      updateGallery(true);
    });
  }
}

function setGalleryFilter(group, value) {
  galleryState[group] = value;
}

function syncFilterControls() {
  document.querySelectorAll('[data-group]').forEach(control => {
    control.classList.toggle('active', control.dataset.filter === galleryState[control.dataset.group]);
  });

  const mobileAcaraFilter = document.getElementById('mobileAcaraFilter');
  const mobileTipeFilter = document.getElementById('mobileTipeFilter');

  if (mobileAcaraFilter) {
    mobileAcaraFilter.value = galleryState.acara;
  }

  if (mobileTipeFilter) {
    mobileTipeFilter.value = galleryState.tipe;
  }
}

function applyFilters() {
  currentPage = 1;
  filteredThemes = THEMES_DATA.filter(theme => {
    const matchSearch = theme.name.toLowerCase().includes(galleryState.search);
    const matchAcara = galleryState.acara === 'all' || theme.acara.includes(galleryState.acara);
    const matchTipe = galleryState.tipe === 'all' || theme.tipe.includes(galleryState.tipe);
    return matchSearch && matchAcara && matchTipe;
  });
  updateGallery();
}

function updateGallery(append = false) {
  const themeGallery = document.getElementById('themeGallery');
  const emptyState = document.getElementById('emptyState');
  const loadMoreContainer = document.getElementById('loadMoreContainer');
  const themeCount = document.getElementById('themeCount');

  if (!append) themeGallery.innerHTML = '';

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pagedThemes = filteredThemes.slice(start, end);

  // Update count label
  if (themeCount) {
    const showing = Math.min(end, filteredThemes.length);
    themeCount.textContent = filteredThemes.length > 0
      ? `Menampilkan ${showing} dari ${filteredThemes.length} tema`
      : '';
  }

  if (filteredThemes.length === 0) {
    emptyState?.classList.remove('hidden');
    loadMoreContainer?.classList.add('hidden');
  } else {
    emptyState?.classList.add('hidden');
    const fragment = document.createDocumentFragment();
    pagedThemes.forEach(theme => fragment.appendChild(createThemeCard(theme)));
    themeGallery.appendChild(fragment);

    if (loadMoreContainer) {
      end >= filteredThemes.length
        ? loadMoreContainer.classList.add('hidden')
        : loadMoreContainer.classList.remove('hidden');
    }
  }
}

// =============================================
// Theme Card
// =============================================
function getPlaceholderColor(type) {
  const colors = {
    'Pernikahan': 'FFD9E6',
    'Khitan': 'E3F2FD',
    'Aqiqah': 'E8F5E9',
    'Ultah': 'FFF3E0',
    'Elegan': 'FCE4EC',
    'Budaya': 'F3E5F5',
    'Muslim': 'E0F2F1',
    'Formal': 'E1F5FE'
  };
  return colors[type] || 'F5F5F5';
}

function createThemeCard(theme) {
  const div = document.createElement('div');
  div.className = 'theme-card';

  const mainType = theme.acara[0] || theme.tipe[0] || 'Design';
  const color = getPlaceholderColor(mainType);
  const thumbUrl = theme.thumbnail
    || `https://placehold.co/400x600/${color}/880E4F?text=${encodeURIComponent(theme.name)}`;

  const waMsg = `Halo%20Seraya%2C%20saya%20tertarik%20dengan%20tema%20*${encodeURIComponent(theme.name)}*`;
  const waLink = `https://wa.me/6289679160870?text=${waMsg}`;

  const usageText = typeof theme.usage === 'string' ? theme.usage.trim() : '';
  const usageNum = parseInt(usageText, 10) || 0;
  const heatLabel = usageNum >= 100 ? '🔥 ' : usageNum >= 50 ? '⭐ ' : '';

  const usageBadge = usageText
    ? `<div class="badge-usage">${heatLabel}${usageText}</div>`
    : '';

  div.innerHTML = `
    ${usageBadge}
    <div class="theme-img-container loading">
      <img src="${thumbUrl}" alt="${theme.name}" class="theme-img"
           loading="lazy" decoding="async" referrerpolicy="no-referrer" fetchpriority="low"
           onload="this.parentElement.classList.remove('loading')"
           onerror="this.parentElement.classList.remove('loading');this.src='https://placehold.co/400x600/${color}/880E4F?text=${encodeURIComponent(theme.name)}'">

      <div class="theme-overlay">
        <div style="display:flex;flex-wrap:wrap;margin-bottom:4px;">
          ${theme.acara.map(a => `<span class="theme-cat-badge">${a}</span>`).join('')}
          ${theme.tipe.slice(0, 2).map(t => `<span class="theme-cat-badge">${t}</span>`).join('')}
        </div>
        <div style="display:flex;gap:8px;">
          <button class="overlay-btn-preview js-preview-btn" type="button">
            Preview
          </button>
          <a href="${waLink}" target="_blank" class="overlay-btn-order js-order-btn">
            Pesan
          </a>
        </div>
      </div>
    </div>
    <div class="theme-card-info">
      <p class="theme-card-name">${theme.name}</p>
      <p class="theme-card-sub">${theme.acara.join(' · ') || 'Undangan Seraya'}</p>
    </div>
  `;

  // Preview button → open modal
  div.querySelector('.js-preview-btn').addEventListener('click', e => {
    e.stopPropagation();
    openPreviewModal(theme);
  });

  // WA button → stop propagation (don't trigger card click)
  div.querySelector('.js-order-btn').addEventListener('click', e => {
    e.stopPropagation();
  });

  // Card click → open modal (clicking anywhere on card)
  div.addEventListener('click', () => openPreviewModal(theme));

  return div;
}

// =============================================
// FAQ Accordion
// =============================================
function initAccordion() {
  const faqItems = document.querySelectorAll('.editorial-faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // (Optional) Close other items
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}
