const express = require('express');
const fs = require('fs');
const getAccessToken = require('./tokengen.js');

const app = express();
const PORT = 3000;

let cachedToken = '';
let lastRefreshed = 0;

// Function to refresh token every 6 hours
async function refreshToken() {
  const token = await getAccessToken();
  if (token) {
    cachedToken = token;
    lastRefreshed = Date.now();
  }
}

// Initial token fetch
refreshToken();

// Set interval for refreshing every 6 hours
setInterval(refreshToken, 6 * 60 * 60 * 1000); // 6 hours in ms

// Endpoint to get the current token
app.get('/token', (req, res) => {
  if (cachedToken) {
    res.json({ token: cachedToken, lastRefreshed: new Date(lastRefreshed).toISOString() });
  } else {
    res.status(503).json({ error: 'Token not available yet. Try again shortly.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
