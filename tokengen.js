const axios = require('axios');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

async function getAccessToken() {
  const APP_ID = process.env.FB_APP_ID;
  const APP_SECRET = process.env.FB_APP_SECRET;
  const SHORT_LIVED_TOKEN = fs.readFileSync('WA-token.txt', 'utf-8');

  const url = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${APP_ID}&client_secret=${APP_SECRET}&fb_exchange_token=${SHORT_LIVED_TOKEN}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.access_token) {
      console.log('Fetched New Access Token');
      fs.writeFileSync('WA-token.txt', data.access_token, 'utf-8');
      return data.access_token;
    } else {
      throw new Error("Access token not found in response");
    }
  } catch (error) {
    if (error.response) {
      console.error("HTTP error:", error.response.status, error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    return null;
  }
}

module.exports = getAccessToken;
