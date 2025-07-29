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

// ✅ Route: Generate Kore.ai JWT for Web SDK
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
    console.error("❌ JWT generation error:", error.response?.data || error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ error: "Failed to generate JWT" });
  }
});

// ✅ Route: Forward user message to Kore.ai webhook
app.post("/kore-response", async (req, res) => {
  const userInput = req.body.message;

  try {
    // Step 1: Get access token
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

    // Step 2: Build webhook payload
    const payload = {
      from: {
        id: "user@example.com", // You can replace this dynamically if needed
        name: "WebUser"
      },
      message: {
        text: userInput
      }
    };

    // Step 3: Send to Kore webhook
    const response = await axios.post(KORE_WEBHOOK, payload, {
      headers: {
        Authorization: `bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error("❌ Error sending message to Kore.ai:", error.response?.data || error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ error: "Failed to send message to Kore.ai" });
  }
});

// ✅ Route: Basic connection check
app.get("/", (req, res) => {
  res.send("✅ WindWhisperBot server is running.");
});

// ✅ Route: Kore.ai token test — useful for Railway deployment validation
app.get("/test-kore", async (req, res) => {
  try {
    console.log("🧪 Testing Kore.ai token retrieval...");

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

    console.log("✅ Token received successfully.");
    res.json({
      success: true,
      message: "Successfully connected to Kore.ai auth endpoint.",
      tokenPreview: response.data.access_token.slice(0, 10) + "...", // Mask token for safety
      expires_in: response.data.expires_in
    });
  } catch (error) {
    console.error("❌ Kore.ai token test failed:", error.response?.data || error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      success: false,
      error: error.response?.data || error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
