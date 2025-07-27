document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('theme-toggle');
  const themeLink = document.getElementById('theme-style');
  const LIGHT_THEME = 'styles/theme-light.css';
  const DARK_THEME = 'styles/theme-dark.css';

  function setTheme(theme) {
    themeLink.setAttribute('href', theme);
    localStorage.setItem('preferredTheme', theme);
    updateToggleUI(theme);
  }

  function updateToggleUI(theme) {
    if (theme === LIGHT_THEME) {
      toggleButton.textContent = '🌙';
      toggleButton.setAttribute('aria-label', 'Activate dark mode');
    } else {
      toggleButton.textContent = '🌞';
      toggleButton.setAttribute('aria-label', 'Activate light mode');
    }
  }

  toggleButton.addEventListener('click', () => {
    const currentTheme = themeLink.getAttribute('href');
    const newTheme = currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
    setTheme(newTheme);
  });

  // Apply saved theme or default to dark
  const savedTheme = localStorage.getItem('preferredTheme') || DARK_THEME;
  setTheme(savedTheme);
});
