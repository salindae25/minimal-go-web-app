// Generic browser behavior. Components use data hooks; CSS classes own styling.
export function initSidebar(shell) {
  if (!shell) return;
  const sidebarToggle = shell.querySelector('[data-sidebar-toggle]');
  const sidebarHandle = shell.querySelector('[data-sidebar-resize]');
  if (!sidebarToggle) return;
  const sidebarSetOpen = (open) => {
    shell.classList.toggle('app-shell--sidebar-hidden', !open);
    sidebarToggle.setAttribute('aria-expanded', String(open));
  };
  sidebarSetOpen(!matchMedia('(max-width: 700px)').matches);
  sidebarToggle.addEventListener('click', () =>
    sidebarSetOpen(sidebarToggle.getAttribute('aria-expanded') !== 'true'),
  );
  if (!sidebarHandle) return;
  const sidebarResize = (width) => {
    const sidebarMax = Math.min(400, shell.clientWidth - 284);
    const sidebarWidth = Math.max(180, Math.min(sidebarMax, width));
    shell.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
    sidebarHandle.setAttribute('aria-valuenow', String(Math.round(sidebarWidth)));
    sidebarHandle.setAttribute('aria-valuemax', String(Math.max(180, sidebarMax)));
  };
  sidebarHandle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    sidebarHandle.setPointerCapture(event.pointerId);
    sidebarHandle.classList.add('is-dragging');
  });
  sidebarHandle.addEventListener('pointermove', (event) => {
    if (sidebarHandle.hasPointerCapture(event.pointerId))
      sidebarResize(event.clientX - shell.getBoundingClientRect().left);
  });
  const sidebarStop = () => sidebarHandle.classList.remove('is-dragging');
  sidebarHandle.addEventListener('lostpointercapture', sidebarStop);
  sidebarHandle.addEventListener('keydown', (event) => {
    const sidebarCurrent = Number(sidebarHandle.getAttribute('aria-valuenow'));
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    sidebarResize(
      event.key === 'Home'
        ? 180
        : event.key === 'End'
          ? 400
          : sidebarCurrent + (event.key === 'ArrowRight' ? 16 : -16),
    );
  });
}

export function initTabs(tabRoot) {
  const tabButtons = [...tabRoot.querySelectorAll('[role="tab"]')];
  const tabActivate = (button) => {
    for (const tab of tabButtons) {
      const tabSelected = tab === button;
      tab.setAttribute('aria-selected', String(tabSelected));
      tab.tabIndex = tabSelected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !tabSelected;
    }
  };
  for (const tab of tabButtons) {
    tab.addEventListener('click', () => tabActivate(tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const tabIndex = tabButtons.indexOf(tab);
      const tabNext =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? tabButtons.length - 1
            : (tabIndex + (event.key === 'ArrowRight' ? 1 : -1) + tabButtons.length) %
              tabButtons.length;
      tabActivate(tabButtons[tabNext]);
      tabButtons[tabNext].focus();
    });
  }
}
