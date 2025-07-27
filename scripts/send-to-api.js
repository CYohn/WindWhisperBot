document.getElementById('chat-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const inputField = document.getElementById('user-input');
  const userMessage = inputField.value.trim();

  if (!userMessage) return;

  // Basic client-side sanitization (Just double checking)
  const sanitizedMessage = userMessage
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#x60;");

  try {
    const response = await fetch('https://YOUR-RAILWAY-URL-HERE.com/api/sendToKore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: sanitizedMessage })
    });

    const data = await response.json();
    const botReply = data.reply || 'No response from bot.';

    document.getElementById('chat-response').innerHTML = `<p>${botReply}</p>`;
  } catch (err) {
    document.getElementById('chat-response').innerHTML = `<p class="error">Error talking to bot.</p>`;
    console.error('Error:', err);
  }

  inputField.value = '';
});
