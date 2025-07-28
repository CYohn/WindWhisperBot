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
      console.log('✅ Access token obtained:', accessToken);
    }

    const webhookPayload = {
      message: { text: userMessage },
      from: {
        id: 'windwhisper@demo.com',
        name: 'Wind Whisper User'
      }
    };

    console.log('📤 Sending to Kore.ai:', webhookPayload);

    const response = await axios.post(
      process.env.KORE_WEBHOOK,
      webhookPayload,
      {
        headers: {
          Authorization: `bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ Kore.ai Response:', response.data);

    const botReply = response.data?.textResponse || 'No response from bot.';
    res.json({ reply: botReply });

  } catch (err) {
    console.error('Error contacting Kore.ai:', err.response?.data || err.message);
    accessToken = null;
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
