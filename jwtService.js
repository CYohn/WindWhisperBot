const jwt = require('jsonwebtoken');
require('dotenv').config();

const CLIENT_ID = process.env.KORE_CLIENT_ID;
const SECRET_KEY = process.env.KORE_CLIENT_SECRET;

function generateJWT(userId = "user@windwhisper.com") {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now,
    exp: now + 3600,
    jti: Math.random().toString(36).substring(2),
    aud: "https://idproxy.kore.com/authorize",
    iss: CLIENT_ID,
    sub: userId,
    isAnonymous: false
  };

  const header = {
    alg: "HS256",
    typ: "JWT"
  };

  return jwt.sign(payload, SECRET_KEY, { header });
}

module.exports = { generateJWT };
