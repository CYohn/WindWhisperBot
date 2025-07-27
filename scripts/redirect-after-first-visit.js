window.addEventListener('DOMContentLoaded', () => {
  const VISIT_KEY = 'visitedHome';
  const TIMESTAMP_KEY = 'visitedTimestamp';
  const REDIRECT_PAGE = 'bot.html';
  const RESET_DAYS = 7;
  const REDIRECT_DELAY_MS = 100; // delay to allow DOM updates

  const params = new URLSearchParams(window.location.search);
  const isBypassingRedirect = params.get('noredirect') === 'true';

  const now = Date.now();
  const savedVisit = localStorage.getItem(VISIT_KEY);
  const savedTimestamp = parseInt(localStorage.getItem(TIMESTAMP_KEY), 10);

  function isExpired(timestamp, days) {
    const ms = days * 24 * 60 * 60 * 1000;
    return now - timestamp > ms;
  }

  if (
    savedVisit === 'true' &&
    !isBypassingRedirect &&
    !isNaN(savedTimestamp) &&
    !isExpired(savedTimestamp, RESET_DAYS)
  ) {
    const homeNav = document.getElementById('home-nav');
    if (homeNav) {
      homeNav.style.display = 'none';
    }

    setTimeout(() => {
      window.location.href = REDIRECT_PAGE;
    }, REDIRECT_DELAY_MS);
  } else {
    localStorage.setItem(VISIT_KEY, 'true');
    localStorage.setItem(TIMESTAMP_KEY, now.toString());
  }
});
