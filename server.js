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
// keep this if you already have it
app.get("/getJWT", (req, res) => {
  try {
    const sub = req.query.user || "local-test-user@example.com";
    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      { iss: process.env.KORE_CLIENT_ID, sub, aud: "https://bots.kore.ai", iat: now, exp: now + 300, kore_sub: sub },
      process.env.KORE_CLIENT_SECRET,
      { algorithm: "HS256" }
    );
    res.json({ jwt: token });
  } catch (e) { res.status(500).json({ error: "JWT sign failed" }); }
});

// NEW: handle POST too (SDK uses POST)
app.post("/getJWT", (req, res) => {
  try {
    const sub = (req.body && (req.body.user || req.body.sub)) || "local-test-user@example.com";
    const now = Math.floor(Date.now() / 1000);
    const token = jwt.sign(
      { iss: process.env.KORE_CLIENT_ID, sub, aud: "https://bots.kore.ai", iat: now, exp: now + 300, kore_sub: sub },
      process.env.KORE_CLIENT_SECRET,
      { algorithm: "HS256" }
    );
    res.json({ jwt: token });
  } catch (e) { res.status(500).json({ error: "JWT sign failed" }); }
});


app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
