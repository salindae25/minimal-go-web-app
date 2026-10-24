import { $ } from './dom.js';
import { api } from './api.js';
import { initTheme } from './theme.js';
import { initSidebar } from './components.js';

initTheme();
initSidebar(document.querySelector('[data-shell]'));

const helloButton = $('#hello-button');
const helloResult = $('#hello-result');
helloButton.addEventListener('click', async () => {
  helloButton.disabled = true;
  helloResult.textContent = 'Loading…';
  try {
    const data = await api('/api/hello', { signal: AbortSignal.timeout(10000) });
    helloResult.textContent = data.message;
  } catch (error) {
    helloResult.textContent = error.message || 'Could not reach the server.';
  } finally {
    helloButton.disabled = false;
  }
});
