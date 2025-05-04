import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { config } from 'dotenv';
import fetch from 'node-fetch';  // Ensure this is imported to allow API requests to Spotify

config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 3001;

// Spotify API Credentials from .env file
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Middleware to parse JSON requests
app.use(cors());
app.use(bodyParser.json());

// Token exchange endpoint
app.post('/auth/token', async (req, res) => {
  const { code } = req.body;
  const redirect_uri = 'http://127.0.0.1:3000/callback'; // Your redirect URI (match this with the one in your Spotify Developer Dashboard)

  // Ensure client ID and secret are available
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Client ID or Secret missing' });
  }

  const tokenUrl = 'https://accounts.spotify.com/api/token';

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code); // The authorization code from Spotify
  params.append('redirect_uri', redirect_uri); // The redirect URI (make sure this matches the one in the Spotify Developer Dashboard)
  params.append('client_id', SPOTIFY_CLIENT_ID);
  params.append('client_secret', SPOTIFY_CLIENT_SECRET);

  try {
    // Exchange the authorization code for an access token
    const response = await fetch(tokenUrl, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();
    console.log('Token exchange data from Spotify:', data); // Debugging log to see the full response

    // Check if we received the access token and refresh token
    if (data.access_token && data.refresh_token) {
      return res.json({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      });
    } else {
      console.error('Token exchange failed:', data);
      return res.status(400).json({ error: 'Failed to exchange token' });
    }
  } catch (err) {
    console.error('Error during token exchange:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to test server
app.get('/', (req, res) => {
  res.send('Auth Server is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Auth server running at http://localhost:${PORT}`);
});
