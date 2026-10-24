// Adapted from px0's ui.js; text is inserted as text nodes.
let toastTimer = 0;
let toastLeaveTimer = 0;
export function showToast(message, { tone = 'info', duration = 3200 } = {}) {
  const toastElement = document.querySelector('[data-toast]');
  if (!toastElement) return;
  clearTimeout(toastTimer);
  clearTimeout(toastLeaveTimer);
  toastElement.classList.remove('is-leaving', 'toast--error');
  if (tone === 'error') toastElement.classList.add('toast--error');
  const toastChip = document.createElement('span');
  toastChip.className = 'toast-chip';
  toastChip.textContent = tone;
  const toastMessage = document.createElement('span');
  toastMessage.className = 'toast-msg';
  toastMessage.textContent = message;
  toastElement.replaceChildren(toastChip, toastMessage);
  toastElement.hidden = false;
  toastTimer = setTimeout(() => {
    toastElement.classList.add('is-leaving');
    toastLeaveTimer = setTimeout(() => {
      toastElement.hidden = true;
      toastElement.classList.remove('is-leaving');
    }, 180);
  }, duration);
}
