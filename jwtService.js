const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

router.all('/getJWT', (req, res) => {
  const payload = {
    sub: "cyohn@live.com",
    iss: process.env.KORE_CLIENT_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
    aud: "https://idproxy.kore.com/authorize",
    isAnonymous: false
  };

  try {
    const token = jwt.sign(payload, process.env.KORE_CLIENT_SECRET, {
      algorithm: "HS256"
    });

    res.json({ jwt: token });
  } catch (err) {
    console.error('JWT generation error:', err);
    res.status(500).json({ error: "Failed to generate JWT" });
  }
});

module.exports = router;
