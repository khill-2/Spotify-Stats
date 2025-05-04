const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: 'http://127.0.0.1:3000', // must match your frontend exactly
  credentials: true,
};
app.use(cors(corsOptions));

const PORT = 3001;

app.post('/auth/token', async (req, res) => {
  const code = req.body.code;
  if (!code) {
    return res.status(400).send('Missing code');
  }

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', 'http://127.0.0.1:3000/callback'); // must match Spotify dashboard & Login.tsx

    const authHeader = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${authHeader}`,
        },
      }
    );

    console.log('✅ Token exchange success');
    res.json(response.data); // { access_token, refresh_token, ... }
  } catch (err) {
    console.error('❌ Token exchange failed:', err.response?.data || err.message);
    res.status(500).send('Failed to exchange token');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Auth server running at http://localhost:${PORT}`);
});
