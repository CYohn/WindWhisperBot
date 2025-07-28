const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let accessToken = null;

// Get new access token from Kore.ai
async function getKoreAccessToken() {
  const tokenURL = 'https://idproxy.kore.com/oauth2/token';
  const params = new URLSearchParams();
  params.append('client_id', process.env.KORE_CLIENT_ID);
  params.append('client_secret', process.env.KORE_CLIENT_SECRET);
  params.append('grant_type', 'client_credentials');
  params.append('scope', process.env.KORE_SCOPE);

  const res = await axios.post(tokenURL, params);
  return res.data.access_token;
}

// Handle messages from frontend
app.post('/message', async (req, res) => {
  const userMessage = req.body.message;

  try {
    if (!accessToken) {
      accessToken = await getKoreAccessToken();
    }

    const response = await axios.post(
      process.env.KORE_WEBHOOK,
      {
        message: {
          text: userMessage
        },
        from: {
          id: 'user@example.com', // Replace or randomize if needed
          name: 'Wind Whisper User'
        }
      },
      {
        headers: {
          Authorization: `bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const botReply = response.data?.textResponse || 'No response from bot.';
    res.json({ reply: botReply });

  } catch (err) {
    console.error('Error contacting Kore.ai:', err.response?.data || err.message);
    accessToken = null; // Clear token on failure to force refresh
    res.status(500).json({ reply: 'Error communicating with WindWhisperBot.' });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Wind Whisper API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
