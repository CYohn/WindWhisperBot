// scripts/theme-toggle.js

const toggleBtn = document.getElementById('theme-toggle');
const themeLink = document.getElementById('theme-style');
const icon = document.getElementById('theme-icon');
const label = document.getElementById('theme-label');

// Load previously saved theme
let currentTheme = localStorage.getItem('theme') || 'theme-dark';
themeLink.href = `styles/${currentTheme}.css`;
updateToggleUI(currentTheme);

// Toggle between light and dark
toggleBtn.addEventListener('click', () => {
  currentTheme = currentTheme === 'theme-dark' ? 'theme-light' : 'theme-dark';
  themeLink.href = `styles/${currentTheme}.css`;
  localStorage.setItem('theme', currentTheme);
  updateToggleUI(currentTheme);
});

// Update icon and label based on current theme
function updateToggleUI(theme) {
  if (theme === 'theme-dark') {
    icon.textContent = '🌞';
    label.textContent = 'Activate light mode';
  } else {
    icon.textContent = '🌙';
    label.textContent = 'Activate dark mode';
  }
}
