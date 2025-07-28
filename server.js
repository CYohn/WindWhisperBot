// server.js

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint to handle incoming messages from the frontend
app.post('/message', async (req, res) => {
  const userMessage = req.body.message;
  console.log('Incoming user message:', userMessage);

  try {
    // Step 1: Get access token from Kore.ai
    const params = new URLSearchParams();
    params.append('client_id', process.env.KORE_CLIENT_ID);
    params.append('client_secret', process.env.KORE_CLIENT_SECRET);
    params.append('grant_type', 'client_credentials');

    const authResponse = await axios.post('https://idproxy.kore.ai/oauth2/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const accessToken = authResponse.data.access_token;
    console.log('Retrieved Kore.ai access token.');

    // Step 2: Send user message to Kore.ai via Webhook V2
    const koreResponse = await axios.post(
      process.env.KORE_WEBHOOK,
      {
        session: { new: true },
        message: {
          type: "text",
          val: userMessage
        },
        from: {
          id: "user-123",
          userInfo: {
            firstName: "Web",
            lastName: "User",
            email: "webuser@example.com"
          }
        },
        to: {
          id: process.env.KORE_BOT_ID
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Step 3: Extract the bot response from Kore.ai
    const botReply = koreResponse.data?.data?.[0]?.val ?? 'No response from Kore.ai.';
    console.log('Bot reply:', botReply);

    // Step 4: Send response to frontend
    res.json({ reply: botReply });

  } catch (err) {
    console.error('Error communicating with Kore.ai:', err.response?.data || err.message);
    res.json({ reply: 'Error communicating with WindWhisperBot.' });
  }
});

// Basic test route
app.get('/', (req, res) => {
  res.send('Wind Whisper API is running.');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
