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
  console.log('Incoming user message:', userMessage);

  try {
    // Step 1: Get Access Token from Kore.ai
    const authResponse = await axios.post('https://idproxy.kore.ai/api/token', {
      clientId: process.env.KORE_CLIENT_ID,
      clientSecret: process.env.KORE_CLIENT_SECRET,
      scope: process.env.KORE_SCOPE
    });

    const accessToken = authResponse.data.access_token;
    console.log('Retrieved Kore.ai access token.');

    // Step 2: Send user message to Kore.ai Bot
    const koreResponse = await axios.post(
      process.env.KORE_WEBHOOK,
      {
        message: { text: userMessage },
        from: { id: "user@example.com", name: "WebUser" }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Kore.ai response:', koreResponse.data);

    const botReply = koreResponse.data?.body?.message ?? 'No response from Kore.ai.';
    res.json({ reply: botReply });

  } catch (err) {
    console.error('Error communicating with Kore.ai:', err.response?.data || err.message);
    res.json({ reply: 'Error communicating with WindWhisperBot.' });
  }
});



// Test route
app.get('/', (req, res) => {
  res.send('Wind Whisper API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
