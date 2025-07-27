const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Route for direct client messages (from your website)
app.post('/message', (req, res) => {
  const userMessage = req.body.message;
  console.log('Received from frontend:', userMessage);

  // Temporary bot logic
  const response = {
    reply: `You said: "${userMessage}". WindWhisperBot is thinking... 🌬️`
  };

  res.json(response);
});

// Route to receive message from Kore.ai (for future webhook)
app.post('/kore-response', (req, res) => {
  const userMessage = req.body.message;
  console.log('Received from Kore.ai:', userMessage);

  const response = {
    reply: `You said: "${userMessage}". WindWhisperBot is thinking... 🌬️`
  };

  res.json(response);
});

// Test route
app.get('/', (req, res) => {
  res.send('Wind Whisper API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
