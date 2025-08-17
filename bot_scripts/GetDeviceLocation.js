// GetDeviceLocation.js
// Reads lat/lon from message-level tags or args, stores them in context.wx, and returns them.
// Works as either async export or callback-style export.

function normalizeNumber(v) {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : undefined;
}

function isValidLatLon(lat, lon) {
  return Number.isFinite(lat) && Math.abs(lat) <= 90 &&
         Number.isFinite(lon) && Math.abs(lon) <= 180;
}

async function getDeviceLocation(context = {}, args = {}) {
  const msg = context.message || {};

  // Sources we’ll check, in order:
  const tags = msg.messageLevelTags || msg.metaTags || {};
  const latCandidate = args.lat ?? tags.lat ?? tags.latitude;
  const lonCandidate = args.lon ?? tags.lon ?? tags.longitude;

  const lat = normalizeNumber(latCandidate);
  const lon = normalizeNumber(lonCandidate);
  console.log('lat, lon:', lat, lon);
  const timestamp = Math.floor(Date.now() / 1000); // Unix seconds
  console.log('timestamp:', timestamp);

  if (!isValidLatLon(lat, lon)) {
    // Leave a helpful hint and fail gracefully.
    context.wx = { error: 'no_location' };
    return {
      ok: false,
      error: 'No valid lat/lon found in message tags or args. ' +
             'Have the client send metaTags: { lat, lon }.'
    };
  }

  context.wx = context.wx || {};
  context.wx.lat = lat;
  context.wx.lon = lon;
  context.wx.timestamp = timestamp;
  context.wx.source = (latCandidate === args.lat || lonCandidate === args.lon) ? 'args' : 'tags';

  return { ok: true, lat, lon, timestamp };
}

// ---- Exports (support both bot action styles) ----
module.exports = async function(context, args) {
  return getDeviceLocation(context, args);
};

exports.handler = function(context, args, done) {
  getDeviceLocation(context, args).then(r => done(null, r)).catch(e => done(e));
};
