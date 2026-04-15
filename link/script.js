'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initCopyButton();
  syncFooterUrl();
});

function initCopyButton() {
  const button = document.getElementById('copyButton');
  if (!button) return;

  button.addEventListener('click', async () => {
    const targetUrl = button.dataset.copyUrl || window.location.href;

    try {
      await navigator.clipboard.writeText(targetUrl);
      setButtonState(button, 'Link tersalin');
    } catch (error) {
      setButtonState(button, 'Salin manual');
      window.prompt('Salin link ini:', targetUrl);
    }
  });
}

function setButtonState(button, label) {
  const originalLabel = button.dataset.originalLabel || button.textContent.trim();
  button.dataset.originalLabel = originalLabel;
  button.textContent = label;

  window.setTimeout(() => {
    button.textContent = originalLabel;
  }, 1800);
}

function syncFooterUrl() {
  const footerUrl = document.getElementById('footerUrl');
  if (!footerUrl) return;

  const hostname = window.location.hostname;
  const pathname = window.location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  footerUrl.textContent = hostname && hostname !== 'localhost'
    ? `${hostname}${pathname}`
    : 'seraya.my.id/link';
}
