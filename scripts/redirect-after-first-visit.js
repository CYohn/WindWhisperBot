const VISIT_KEY = 'visitedHome';
const TIMESTAMP_KEY = 'visitedTimestamp';
const REDIRECT_PAGE = 'bot.html';
const RESET_DAYS = 7;

// Check for URL param override
const params = new URLSearchParams(window.location.search);
const isBypassingRedirect = params.get('noredirect') === 'true';

const now = Date.now();
const savedVisit = localStorage.getItem(VISIT_KEY);
const savedTimestamp = parseInt(localStorage.getItem(TIMESTAMP_KEY), 10);

// Helper: Check if timestamp is older than X days
function isExpired(timestamp, days) {
  const ms = days * 24 * 60 * 60 * 1000;
  return now - timestamp > ms;
}

// If visited before AND within reset period, redirect
if (
  savedVisit === 'true' &&
  !isBypassingRedirect &&
  !isNaN(savedTimestamp) &&
  !isExpired(savedTimestamp, RESET_DAYS)
) {
  window.location.href = REDIRECT_PAGE;
} else {
  // Reset or first visit — set fresh visit flag and timestamp
  localStorage.setItem(VISIT_KEY, 'true');
  localStorage.setItem(TIMESTAMP_KEY, now.toString());
}
