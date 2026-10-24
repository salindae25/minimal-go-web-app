// Runs after same-origin stylesheets load and before body markup paints.
try {
  const earlyTheme = localStorage.getItem('minimal-go-server-template.theme');
  const earlySelector = `:root[data-theme="${earlyTheme}"]`;
  const earlyKnown = [...document.styleSheets].some((sheet) => {
    try {
      return [...sheet.cssRules].some((rule) => rule.selectorText === earlySelector);
    } catch {
      return false;
    }
  });
  if (earlyKnown) document.documentElement.dataset.theme = earlyTheme;
} catch {
  /* Storage may be unavailable in a restricted browser. */
}
