// File: scripts/chat.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("chat-form");
  const input = document.getElementById("user-input");
  const responseBox = document.getElementById("chat-response");

  // Sanitize user input to prevent HTML/JS injection
 function sanitizeInput(input) {
  return input
    .replace(/&/g, "&amp;")     // Ampersand
    .replace(/</g, "&lt;")      // Less than
    .replace(/>/g, "&gt;")      // Greater than
    .replace(/"/g, "&quot;")    // Double quotes
    .replace(/'/g, "&#x27;")    // Single quotes
    .replace(/\//g, "&#x2F;")   // Forward slash
    .replace(/`/g, "&#x60;")    // Backtick
    .trim();
}


  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userMessage = sanitizeInput(input.value);

    if (userMessage.length === 0) return;

    // Show user message with class for styling
responseBox.innerHTML += `<div class="message user"><strong>You:</strong> ${userMessage}</div>`;
    input.value = "";

    try {
      const res = await fetch("https://your-railway-api-url/kore-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

    if (data.reply) {
        responseBox.innerHTML += `<div class="message bot"><strong>Bot:</strong> ${data.reply}</div>`;
        } else {    
        responseBox.innerHTML += `<div class="message bot"><strong>Bot:</strong> No response received.</div>`;
    }


    } catch (err) {
      console.error("Error contacting bot API:", err);
      responseBox.innerHTML += `<p><strong>Bot:</strong> There was an error processing your message.</p>`;
    }

    // Scroll to latest message
    responseBox.scrollTop = responseBox.scrollHeight;
  });
});
