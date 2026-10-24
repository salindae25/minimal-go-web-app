// Theme discovery adapted from px0; persistence is browser-local.
const THEME_SELECTOR = /^(?::root|html)?\[data-theme=["']?([\w-]+)["']?\]$/;

export const DEFAULT_THEME = 'catppuccin-mocha';
const themeStorageKey = 'minimal-go-server-template.theme';

let themes = null;

export function getStoredTheme() {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch {
    return null;
  }
}

export function listThemes() {
  if (themes) return themes;
  const found = new Map();
  const walk = (rules) => {
    for (const r of rules) {
      if (r.styleSheet) {
        try {
          walk(r.styleSheet.cssRules);
        } catch {}
        continue;
      } // @import
      if (!r.selectorText) {
        if (r.cssRules) walk(r.cssRules);
        continue;
      } // @media, @layer
      for (const part of r.selectorText.split(',')) {
        const m = part.trim().match(THEME_SELECTOR);
        if (!m) continue;
        const t = found.get(m[1]) || { id: m[1], name: m[1], scheme: '' };
        const name = r.style
          .getPropertyValue('--theme-name')
          .trim()
          .replace(/^["']|["']$/g, '');
        const scheme = r.style.getPropertyValue('color-scheme').trim();
        if (name) t.name = name;
        if (scheme) t.scheme = scheme;
        found.set(m[1], t);
      }
    }
  };
  for (const sheet of document.styleSheets) {
    try {
      walk(sheet.cssRules);
    } catch {} // cross-origin sheets (web fonts) are unreadable
  }
  themes = [...found.values()].sort((a, b) => a.name.localeCompare(b.name));
  return themes;
}

export const currentTheme = () => document.documentElement.dataset.theme;

export function setTheme(id, persist = true) {
  if (!listThemes().some((t) => t.id === id)) return false;
  const changed = currentTheme() !== id;
  document.documentElement.dataset.theme = id;
  if (persist) {
    try {
      localStorage.setItem(themeStorageKey, id);
    } catch {}
  }
  if (changed) document.dispatchEvent(new CustomEvent('theme:changed', { detail: { id } }));
  return true;
}

export function initTheme() {
  const themeSaved = getStoredTheme();
  if (!setTheme(themeSaved, false) && !setTheme(DEFAULT_THEME, false)) {
    const themeFirst = listThemes()[0];
    if (themeFirst) setTheme(themeFirst.id, false);
  }
  for (const themeSelect of document.querySelectorAll('[data-theme-select]')) {
    themeSelect.replaceChildren(
      ...listThemes().map((theme) => {
        const themeOption = document.createElement('option');
        themeOption.value = theme.id;
        themeOption.textContent = theme.name;
        return themeOption;
      }),
    );
    themeSelect.value = currentTheme();
    themeSelect.addEventListener('change', () => setTheme(themeSelect.value));
  }
  document.addEventListener('theme:changed', () => {
    for (const themeSelect of document.querySelectorAll('[data-theme-select]'))
      themeSelect.value = currentTheme();
  });
}
