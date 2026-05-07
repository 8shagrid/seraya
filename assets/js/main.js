const PRICE_LIST = {
    foto: {
        basic: ['89.000', '59.000'],
        premium: ['129.000', '99.000'],
        luxury: ['189.000', '139.000'],
        motion: ['249.000', '179.000'],
    },
    nofoto: {
        basic: ['89.000', '59.000'],
        premium: ['109.000', '79.000'],
        luxury: ['169.000', '119.000'],
        motion: ['229.000', '159.000'],
    },
};

const PACKAGE_KEYS = Object.keys(PRICE_LIST.foto);

const MOTION_UMUM = [
    'Vintage Botanica',
    'Moonlit Cascade',
    'Spring Serenity',
    'Midnight Ruins',
    'Moonlit Voyage',
    'Pink Castle',
    'Royal Garden',
    'Velvet Twilight',
    'Starlit Dreams',
    'Lunar Garden',
    'Celestial Light',
    'Starry Night',
    'Mansion Garden',
    'Pavilion Garden',
    'Fountain Garden',
    'Castle Garden',
    'Cottage Garden',
    'Blossom Serenity',
    'Coastal Serenity',
    'Urban Serenity',
    'Island Serenity',
    'Historic Serenity',
];

const MOTION_ISLAMIC = ['Islamic Romantic', 'Islamic Heavenly'];

const MOTION_ADAT = [
    'Java Serenity',
    'Blue Javanese',
    'Java Heritage',
    'Aceh Heritage',
    'Jambi Heritage',
    'Lampung Heritage',
    'Minang Elegance',
    'Minang Heritage',
    'Sunda Heritage',
    'Chinese Heritage',
    'Bali Heritage',
    'Melayu Heritage',
    'Dayak Heritage',
    'Bugis Heritage',
    'Batak Heritage',
    'Batak Heritage 2',
    'Palembang Heritage',
    'Betawi Heritage',
    'Banjar Heritage',
];

const PREMIUM = [
    'Flower 06',
    'Flower 05',
    'Flower 04',
    'Flower 03',
    'Flower 02',
    'Flower 01',
    'Rustic 03',
    'Rustic 02',
    'Rustic 01',
    'Elegant 04',
    'Elegant 03',
    'Elegant 02',
    'Elegant 01',
];

const LUXURY = ['Luxury 06', 'Luxury 05', 'Luxury 04', 'Luxury 03', 'Luxury 02', 'Luxury 01'];

const BASIC = [
    'Floral 13',
    'Floral 12',
    'Floral 11',
    'Floral 10',
    'Floral 07',
    'Floral 06',
    'Floral 05',
    'Floral 04',
    'Floral 03',
    'Floral 02',
    'Floral 01',
    'Basic 06',
    'Basic 04',
    'Basic 03',
];

const OTHER_EVENTS = [
    'Khitan 05',
    'Khitan 04',
    'Khitan 03',
    'Khitan 02',
    'Khitan 01',
    'Aqiqah 05',
    'Aqiqah 04',
    'Aqiqah 03',
    'Aqiqah 02',
    'Aqiqah 01',
    'Birthday 05',
    'Birthday 04',
    'Birthday 03',
    'Birthday 02',
    'Birthday 01',
];

const THEME_CATEGORIES = [
    { id: 'motion', label: 'Motion', note: 'Untuk kamu yang ingin undangan terasa lebih hidup, dinamis, dan berkesan sejak pertama kali dibuka.', names: [...MOTION_UMUM, ...MOTION_ISLAMIC, ...MOTION_ADAT] },
    { id: 'motion-tanpa-foto', label: 'Motion Tanpa Foto', note: 'Tetap dramatis dan elegan tanpa foto pribadi, cocok untuk tampilan yang lebih clean dan universal.', names: [...MOTION_UMUM, ...MOTION_ISLAMIC, ...MOTION_ADAT], noPhoto: true },
    { id: 'luxury', label: 'Luxury', note: 'Pilihan desain dengan nuansa mewah, dewasa, dan timeless untuk momen yang ingin tampil lebih premium.', names: LUXURY },
    { id: 'luxury-tanpa-foto', label: 'Luxury Tanpa Foto', note: 'Kesan luxury yang rapi dan eksklusif, tanpa perlu menampilkan foto di bagian utama undangan.', names: LUXURY, noPhoto: true },
    { id: 'premium', label: 'Premium', note: 'Koleksi floral, rustic, dan elegant yang fleksibel untuk banyak konsep acara romantis.', names: PREMIUM },
    { id: 'premium-tanpa-foto', label: 'Premium Tanpa Foto', note: 'Tampilan premium yang tetap manis dan personal meski tanpa foto pasangan.', names: PREMIUM, noPhoto: true },
    { id: 'premium-lainnya', label: 'Premium Lainnya', note: 'Koleksi tema premium klasik dari versi sebelumnya dengan desain abadi.', names: typeof PREMIUM_LAINNYA_DATA !== 'undefined' ? PREMIUM_LAINNYA_DATA : [], isLegacy: true },
    { id: 'basic', label: 'Basic', note: 'Desain ringan, praktis, dan tetap cantik untuk undangan yang ingin terlihat simple tanpa terasa polos.', names: BASIC, basic: true },
    { id: 'basic-lainnya', label: 'Basic Lainnya', note: 'Koleksi tema simple dan manis dari versi sebelumnya.', names: typeof BASIC_LAINNYA_DATA !== 'undefined' ? BASIC_LAINNYA_DATA : [], isLegacy: true },
    { id: 'acara-lainnya', label: 'Acara Lainnya', note: 'Tema siap pakai untuk khitan, aqiqah, dan ulang tahun dengan karakter visual yang lebih playful.', names: OTHER_EVENTS, other: true },
    { id: 'acara-lainnya-2', label: 'Acara Lainnya 2', note: 'Berbagai tema khusus untuk momen spesial di luar pernikahan dari versi lawas.', names: typeof ACARA_LAINNYA_2_DATA !== 'undefined' ? ACARA_LAINNYA_2_DATA : [], isLegacy: true },
];

function slugifyThemeName(name) {
    return name.toLowerCase().replace(/\s+/g, '-');
}

function padThemeNumber(name) {
    return name.replace(/\b(\d)\b/g, '0$1');
}

function motionImageName(name, noPhoto) {
    const localNames = {
        'Blue Javanese': 'Blue Javanese New',
        'Royal Garden': 'Royal Garden New',
    };
    const baseName = localNames[name] || name;

    if (!noPhoto) return `${baseName}.jpg`;
    if (name === 'Islamic Romantic' || name === 'Islamic Heavenly') return `${name} TF.jpg`;
    if (name === 'Lunar Garden' || name === 'Velvet Twilight') return `${baseName}  Tanpa Foto.jpg`;
    return `${baseName} Tanpa Foto.jpg`;
}

function getMotionGroup(name) {
    if (MOTION_ISLAMIC.includes(name)) return 'Islamic';
    if (MOTION_ADAT.includes(name)) return 'Adat';
    return 'Umum';
}

function getPremiumImage(name, noPhoto) {
    const [series, number] = name.split(' ');
    const normalizedNumber = number.padStart(2, '0');
    const suffix = noPhoto ? ' Tanpa Foto' : series === 'Elegant' ? '' : ' New';

    return `assets/mockup/Premium Series/${series} - ${normalizedNumber}${suffix}.jpg`;
}

function getLuxuryImage(name, noPhoto) {
    const number = name.split(' ')[1].padStart(2, '0');
    const suffix = noPhoto ? ' Tanpa Foto' : '';
    const newSuffix = number === '06' ? '' : ' New';

    return `assets/mockup/Luxury Series/Luxury - ${number}${suffix}${newSuffix}.jpg`;
}

function getBasicImage(name) {
    const [series, number] = name.split(' ');
    const normalizedNumber = Number(number);

    if (series === 'Basic') return `assets/mockup/Basic Series/Basic/${normalizedNumber}.jpg`;
    return `assets/mockup/Basic Series/${series}/${series} (${normalizedNumber}).jpg`;
}

function getThemeImage(category, name) {
    if (category.isLegacy) return name.thumbnail;

    if (category.id.startsWith('motion')) {
        return `assets/mockup/Motion Series/${getMotionGroup(name)}/${motionImageName(name, category.noPhoto)}`
    }

    if (category.id.startsWith('premium')) return getPremiumImage(name, category.noPhoto);
    if (category.id.startsWith('luxury')) return getLuxuryImage(name, category.noPhoto);
    return getBasicImage(name);
}

function getThemeUrl(category, name) {
    if (category.isLegacy) return name.url;

    const slug = slugifyThemeName(name);

    if (category.basic || category.other) {
        return `https://seraya.unweb.id/preview-template/${slug}`;
    }

    return `https://seraya.unweb.id/${slug}${category.noPhoto ? '-tf' : ''}/?to=Nama+Tamu`;
}

function getThemeDisplayName(category, name) {
    if (category.isLegacy) return name.name.replace(/-C$/, '').replace(/-/g, ' ');

    if (!category.noPhoto) return padThemeNumber(name);
    return `${padThemeNumber(name)} TF`;
}

function initRevealAnimation() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1 });

    reveals.forEach((element) => observer.observe(element));

    // Fallback: Show everything after 2 seconds if not revealed
    setTimeout(() => {
        reveals.forEach(el => el.classList.add('visible'));
    }, 2000);
}

function updatePrices(mode) {
    const selectedPrices = PRICE_LIST[mode];
    if (!selectedPrices) return;

    PACKAGE_KEYS.forEach((key) => {
        const [oldPrice, currentPrice] = selectedPrices[key];
        const oldPriceElement = document.getElementById(`${key}-old`);
        const currentPriceElement = document.getElementById(`${key}-price`);
        const nameElement = document.getElementById(`${key}-name`);

        if (oldPriceElement) oldPriceElement.textContent = `Rp ${oldPrice}`;
        if (currentPriceElement) currentPriceElement.innerHTML = `<small>Rp</small> ${currentPrice}`;
        
        if (nameElement) {
            const baseName = key.charAt(0).toUpperCase() + key.slice(1);
            nameElement.textContent = mode === 'nofoto' ? `${baseName} - Tanpa Foto` : baseName;
        }

        const ctaElement = document.getElementById(`${key}-cta`);
        if (ctaElement) {
            const baseName = key.charAt(0).toUpperCase() + key.slice(1);
            const suffix = mode === 'nofoto' ? ' - Tanpa Foto' : '';
            ctaElement.textContent = `Pesan ${baseName}${suffix}`;
            ctaElement.href = `https://wa.me/6289679160870?text=Halo%20admin%20Seraya,%20saya%20ingin%20memesan%20undangan%20paket%20${baseName}${suffix}`;
        }
    });
}

function initPricingTabs() {
    const tabs = document.querySelectorAll('[data-price-mode]');
    if (!tabs.length) return;

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            const mode = tab.dataset.priceMode;

            tabs.forEach((item) => {
                item.classList.toggle('active', item.dataset.priceMode === mode);
            });

            updatePrices(mode);
        });
    });
}

function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
        item.addEventListener('click', () => {
            const shouldOpen = !item.classList.contains('open');

            faqItems.forEach((faqItem) => faqItem.classList.remove('open'));
            if (shouldOpen) item.classList.add('open');
        });
    });
}

function initFeatureItems() {
    const featureItems = document.querySelectorAll('.feature-item');
    if (!featureItems.length) return;

    featureItems.forEach((item) => {
        item.addEventListener('click', () => {
            featureItems.forEach((feature) => feature.classList.remove('active'));
            item.classList.add('active');
        });
    });
}

function createThemeCard(category, name) {
    const article = document.createElement('article');
    article.className = 'theme-card';
    if (category.isLegacy) article.classList.add('no-image-hover');

    const media = document.createElement('div');
    media.className = 'theme-media';

    const image = document.createElement('img');
    image.src = getThemeImage(category, name);
    image.alt = getThemeDisplayName(category, name);
    image.loading = 'lazy';
    image.decoding = 'async';

    const info = document.createElement('div');
    info.className = 'theme-info';

    const title = document.createElement('h3');
    title.textContent = getThemeDisplayName(category, name);

    const label = document.createElement('p');
    label.textContent = category.label;

    const actions = document.createElement('div');
    actions.className = 'theme-actions';

    const link = document.createElement('a');
    link.href = getThemeUrl(category, name);
    link.target = '_blank';
    link.rel = 'noopener';
    link.className = 'theme-link';
    link.textContent = 'Preview';

    actions.append(link);
    info.append(title, label, actions);
    media.append(image);
    article.append(media, info);

    return article;
}

function renderThemes(categoryId) {
    const grid = document.getElementById('themesGrid');
    const summary = document.getElementById('themeSummary');
    const category = THEME_CATEGORIES.find((item) => item.id === categoryId) || THEME_CATEGORIES[0];
    if (!grid || !summary || !category) return;

    if (category.isLegacy) {
        grid.classList.add('themes-grid-dense');
    } else {
        grid.classList.remove('themes-grid-dense');
    }

    grid.innerHTML = '';
    category.names.forEach((name) => {
        grid.appendChild(createThemeCard(category, name));
    });
    summary.textContent = `Ada ${category.names.length} pilihan di kategori ${category.label}. ${category.note}`;

    document.querySelectorAll('.theme-tab').forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.themeCategory === category.id);
    });
}

function initThemeGallery() {
    const tabs = document.getElementById('themeTabs');
    const grid = document.getElementById('themesGrid');
    if (!tabs || !grid) return;

    const buttons = THEME_CATEGORIES.map((category) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'theme-tab';
        button.dataset.themeCategory = category.id;
        button.textContent = `${category.label} (${category.names.length})`;
        button.addEventListener('click', () => renderThemes(category.id));
        return button;
    });

    tabs.innerHTML = '';
    buttons.forEach(btn => tabs.appendChild(btn));
    renderThemes(THEME_CATEGORIES[0].id);
}

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    const setMenuState = (isOpen) => {
        navLinks.classList.toggle('is-open', isOpen);
        hamburger.classList.toggle('is-open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    };

    hamburger.addEventListener('click', () => {
        setMenuState(!navLinks.classList.contains('is-open'));
    });

    navLinks.addEventListener('click', (event) => {
        if (event.target.closest('a')) setMenuState(false);
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') setMenuState(false);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) setMenuState(false);
    }, { passive: true });

    document.addEventListener('click', (event) => {
        if (!navLinks.classList.contains('is-open')) return;
        if (event.target.closest('.nav-inner')) return;
        setMenuState(false);
    });

    // Close menu on scroll
    window.addEventListener('scroll', () => {
        if (navLinks.classList.contains('is-open')) setMenuState(false);
    }, { passive: true });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const href = anchor.getAttribute('href');
            
            // Handle logo or back to top links
            if (href === '#') {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const target = document.querySelector(href);
            if (!target) return;

            event.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

function initHeroCards() {
    const heroCardsWrap = document.querySelector('.hero-cards');
    const heroCards = document.querySelectorAll('.hero-card');
    if (!heroCardsWrap || !heroCards.length) return;
    if (!window.matchMedia('(min-width: 1200px)').matches) return;

    const cardReturnTimers = new WeakMap();

    const getRotation = (card) => card.dataset.rotation || '0deg';

    const setHeroCardPosition = (card, position) => {
        card.style.left = `${position.left}px`;
        card.style.top = `${position.top}px`;
        card.style.right = 'auto';
        card.style.bottom = 'auto';
        card.style.setProperty('--card-transform', `rotate(${getRotation(card)})`);
    };

    const getRelativePosition = (card) => {
        const wrapRect = heroCardsWrap.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();

        return {
            left: cardRect.left - wrapRect.left,
            top: cardRect.top - wrapRect.top,
        };
    };

    const rememberHeroCardStart = (card) => {
        const position = getRelativePosition(card);
        card.dataset.startLeft = position.left;
        card.dataset.startTop = position.top;
    };

    const freezeHeroCardPosition = (card) => {
        setHeroCardPosition(card, getRelativePosition(card));
    };

    const returnHeroCard = (card) => {
        const left = Number(card.dataset.startLeft);
        const top = Number(card.dataset.startTop);
        if (!Number.isFinite(left) || !Number.isFinite(top)) return;

        card.classList.add('is-returning');
        setHeroCardPosition(card, { left, top });

        window.setTimeout(() => {
            card.classList.remove('is-returning');
        }, 760);
    };

    const startDragging = (card, event) => {
        if (event.button !== undefined && event.button !== 0) return;

        const existingTimer = cardReturnTimers.get(card);
        if (existingTimer) window.clearTimeout(existingTimer);

        card.classList.remove('is-returning');
        freezeHeroCardPosition(card);

        const startX = event.clientX;
        const startY = event.clientY;
        const startLeft = parseFloat(card.style.left) || 0;
        const startTop = parseFloat(card.style.top) || 0;

        const moveCard = (moveEvent) => {
            card.style.left = `${startLeft + moveEvent.clientX - startX}px`;
            card.style.top = `${startTop + moveEvent.clientY - startY}px`;
        };

        const releaseCard = () => {
            card.classList.remove('is-dragging');
            card.removeEventListener('pointermove', moveCard);
            card.removeEventListener('pointerup', releaseCard);
            card.removeEventListener('pointercancel', releaseCard);

            const returnTimer = window.setTimeout(() => returnHeroCard(card), 1000);
            cardReturnTimers.set(card, returnTimer);
        };

        card.classList.add('is-dragging');
        card.setPointerCapture(event.pointerId);
        card.addEventListener('pointermove', moveCard);
        card.addEventListener('pointerup', releaseCard);
        card.addEventListener('pointercancel', releaseCard);
    };

    heroCards.forEach((card) => {
        rememberHeroCardStart(card);
        card.addEventListener('pointerdown', (event) => startDragging(card, event));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initRevealAnimation();
    initPricingTabs();
    initFaq();
    initFeatureItems();
    initThemeGallery();
    initMobileMenu();
    initSmoothScroll();
    initHeroCards();

    if (window.lucide) {
        window.lucide.createIcons();
    }
});
