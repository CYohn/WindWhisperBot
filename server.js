require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();




const PORT = process.env.PORT || 3000;

const axios = require('axios');

async function fetchKoreToken() {
  try {
    const response = await axios.post(
      'https://idproxy.kore.ai/oauth2/token',
      new URLSearchParams({
        client_id: process.env.KORE_CLIENT_ID,
        client_secret: process.env.KORE_CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: 'bot'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data.access_token;
  } catch (err) {
    console.error('Error fetching Kore.ai token:', err.response?.data || err.message);
    return null;
  }
}


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

  // Proper response format
  res.status(200).json({
    "message": {
      "text": `You said: "${userMessage}". The wind whisperer is thinking... 🌬️`
    }
  });
});


// Test route
app.get('/', (req, res) => {
  res.send('Wind Whisper API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
