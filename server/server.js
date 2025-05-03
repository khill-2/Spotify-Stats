const axios = require('axios');
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

// Spotify's token exchange endpoint
// Example of updated error handling in the token exchange endpoint
app.post('/auth/token', async (req, res) => {
    const code = req.body.code;
    const redirectUri = 'http://127.0.0.1:3000/callback'; // Match with the registered URI
  
    // Spotify token request parameters
    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirectUri);
  
    const authHeader = Buffer.from(
      `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
    ).toString('base64');
  
    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authHeader}`,
        },
      });
  
      res.json(response.data); // Send the token data back
    } catch (err) {
      console.error('Token exchange error:', err.response ? err.response.data : err.message);
      
      // Return a more detailed error message
      if (err.response) {
        return res.status(400).json({
          error: err.response.data.error,
          description: err.response.data.error_description || 'Unknown error',
        });
      } else {
        return res.status(500).json({
          error: 'Internal Server Error',
          description: err.message || 'Failed to exchange token',
        });
      }
    }
  });

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Auth server running at http://localhost:${PORT}`);
});
