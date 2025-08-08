// server.js (CommonJS version)
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const { KORE_CLIENT_ID, KORE_CLIENT_SECRET } = process.env;

// Health
app.get("/", (_req, res) => res.send("OK"));

// Generate short-lived JWT for the Widget SDK (HS256)
app.get("/getJWT", (req, res) => {
  try {
    const sub = req.query.user || "local-test-user@example.com";
    const now = Math.floor(Date.now() / 1000);

    const token = jwt.sign(
      {
        iss: KORE_CLIENT_ID,                // your Client ID
        sub,                                // unique user id
        aud: "https://bots.kore.ai",
        iat: now,
        exp: now + 60 * 5,                  // 5 minutes
        kore_sub: sub
      },
      KORE_CLIENT_SECRET,                   // your Client Secret
      { algorithm: "HS256" }
    );

    res.json({ jwt: token });
  } catch (e) {
    console.error("JWT sign error:", e);
    res.status(500).json({ error: "JWT sign failed" });
  }
});

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
