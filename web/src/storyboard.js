import { initTheme } from './theme.js';
import { initSidebar, initTabs } from './components.js';
import { showToast } from './toast.js';

initTheme();
initSidebar(document.querySelector('[data-shell]'));
for (const storyboardTabs of document.querySelectorAll('[data-tabs]')) initTabs(storyboardTabs);
for (const storyboardButton of document.querySelectorAll('[data-demo-action]')) {
  storyboardButton.addEventListener('click', () => showToast(storyboardButton.dataset.demoAction));
}
for (const storyboardToastButton of document.querySelectorAll('[data-demo-toast]')) {
  storyboardToastButton.addEventListener('click', () =>
    showToast('Example notification.', { tone: storyboardToastButton.dataset.demoToast }),
  );
}
for (const storyboardAction of document.querySelectorAll('[data-popover-action]')) {
  storyboardAction.addEventListener('click', () => {
    storyboardAction.closest('[popover]').hidePopover();
    showToast(storyboardAction.dataset.popoverAction);
  });
}
const storyboardDialog = document.getElementById('demo-dialog');
document
  .getElementById('open-dialog')
  .addEventListener('click', () => storyboardDialog.showModal());
storyboardDialog.addEventListener('close', () => {
  if (storyboardDialog.returnValue === 'save') showToast('Example saved.', { tone: 'success' });
});
const storyboardTokenGrid = document.getElementById('token-grid');
for (const storyboardToken of [
  '--bg',
  '--bg2',
  '--bg3',
  '--bg4',
  '--fg',
  '--dim',
  '--faint',
  '--line',
  '--accent',
  '--accent-fg',
  '--sel',
  '--success',
  '--warning',
  '--danger',
]) {
  const storyboardSwatch = document.createElement('div');
  storyboardSwatch.className = 'storyboard__swatch';
  const storyboardSample = document.createElement('div');
  storyboardSample.className = 'storyboard__sample';
  storyboardSample.style.backgroundColor = `var(${storyboardToken})`;
  const storyboardLabel = document.createElement('code');
  storyboardLabel.className = 'storyboard__token';
  storyboardLabel.textContent = storyboardToken;
  storyboardSwatch.append(storyboardSample, storyboardLabel);
  storyboardTokenGrid.append(storyboardSwatch);
}
