const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Kore.ai credentials from .env
const CLIENT_ID = process.env.KORE_CLIENT_ID;
const CLIENT_SECRET = process.env.KORE_CLIENT_SECRET;
const KORE_WEBHOOK = process.env.KORE_WEBHOOK;

// ✅ GET JWT endpoint for Web SDK
app.get("/api/users/getJWT", async (req, res) => {
  try {
    const response = await axios.post("https://idproxy.kore.com/oauth2/token", null, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      params: {
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }
    });

    const token = response.data.access_token;
    res.json({ jwt: token });
  } catch (error) {
    console.error("JWT generation error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate JWT" });
  }
});

// ✅ POST endpoint to forward messages to Kore.ai bot
app.post("/kore-response", async (req, res) => {
  const userInput = req.body.message;

  try {
    // Get token to authenticate with Kore.ai Webhook
    const authResponse = await axios.post("https://idproxy.kore.com/oauth2/token", null, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      params: {
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }
    });

    const token = authResponse.data.access_token;

    // Build payload to Kore.ai webhook
    const payload = {
      from: {
        id: "user@example.com",
        name: "WebUser"
      },
      message: {
        text: userInput
      }
    };

    // Send message to Kore.ai
    const response = await axios.post(KORE_WEBHOOK, payload, {
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error sending message to Kore.ai:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to send message to Kore.ai" });
  }
});

// ✅ Test route
app.get("/", (req, res) => {
  res.send("WindWhisperBot server is running.");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
