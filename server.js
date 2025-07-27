const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Route to receive the message from Kore.ai (Webhook endpoint)
app.post('/kore-response', (req, res) => {
  const userMessage = req.body.message;
  console.log('Received from Kore.ai:', userMessage);

  // TODO: Respond with actual bot logic or static placeholder
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
