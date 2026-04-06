/* ============================================
   Undangan Digital Sakura — Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initSmoothScroll();
  initSakuraPetals();
});

/* ----- Mobile Menu Toggle ----- */
function initMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  // Close menu when a nav link is tapped
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });
  });
}

/* ----- Smooth Scroll with Header Offset ----- */
function initSmoothScroll() {
  const HEADER_OFFSET = 80; // px — accounts for sticky header height

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const top = targetEl.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;

      window.scrollTo({
        top,
        behavior: 'smooth'
      });
    });
  });
}

/* ----- Sakura Petal Rain ----- */
const PETAL_CONFIG = {
  interval: 800,      // ms between new petals
  lifetime: 9000,     // ms before petal is removed
  minSize: 12,        // px
  maxSizeExtra: 20,   // px added randomly
  minDuration: 4,     // s
  maxDurationExtra: 5 // s added randomly
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
  setInterval(createPetal, PETAL_CONFIG.interval);
}
