import { defineStore } from 'pinia';

const palettes = import.meta.glob('../../themes/*.css', {
  eager: true,
  query: '?inline',
  import: 'default',
});
const themes = Object.entries(palettes)
  .map(([path, css]) => {
    const id = path
      .split('/')
      .pop()
      .replace(/\.css$/, '');
    const name =
      css
        .match(/--theme-name:\s*([^;]+);/)?.[1]
        ?.trim()
        .replace(/^["']|["']$/g, '') || id;
    return { id, name };
  })
  .sort((a, b) => a.name.localeCompare(b.name));
const storageKey = 'minimal-go-server-template.theme';
let palettesInstalled = false;

export const useThemeStore = defineStore('theme', {
  state: () => ({ activeTheme: 'catppuccin-mocha', themes }),
  actions: {
    initialize() {
      if (!palettesInstalled) {
        Object.values(palettes).forEach((css, index) => {
          const style = document.createElement('style');
          style.dataset.themePalette = String(index);
          style.textContent = css;
          document.head.append(style);
        });
        palettesInstalled = true;
      }
      let saved;
      try {
        saved = localStorage.getItem(storageKey);
      } catch {
        /* Storage can be unavailable. */
      }
      this.setTheme(
        this.themes.some((theme) => theme.id === saved) ? saved : this.activeTheme,
        false,
      );
    },
    setTheme(id, persist = true) {
      if (!this.themes.some((theme) => theme.id === id)) return;
      this.activeTheme = id;
      document.documentElement.dataset.theme = id;
      if (persist) {
        try {
          localStorage.setItem(storageKey, id);
        } catch {
          /* In-memory selection still works. */
        }
      }
    },
  },
});
