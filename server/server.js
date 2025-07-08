import { config } from 'dotenv';
config(); // Load variables from .env

import testRoutes from './testRoutes.js';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

app.use(cors());
app.use(bodyParser.json());

app.post('/auth/token', async (req, res) => {
  const { code } = req.body;
  //const redirect_uri = 'http://127.0.0.1:3000/callback';
  const redirect_uri = process.env.REDIRECT_URI;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Client ID or Secret missing' });
  }

  const tokenUrl = 'https://accounts.spotify.com/api/token';

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirect_uri);

  // console.log('Using redirect_uri for token exchange:', redirect_uri);

  params.append('client_id', SPOTIFY_CLIENT_ID);
  params.append('client_secret', SPOTIFY_CLIENT_SECRET);
  const authHeader = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      body: params,
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authHeader}`,
      },
    });

    const data = await response.json();
    // console.log('Token exchange data from Spotify:', data);

    if (data.access_token && data.refresh_token) {
      const access_token = data.access_token;

      // Step 1: Get user profile
      const profileRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const profile = await profileRes.json();

      if (!profile.id) {
        console.error('Failed to get Spotify profile:', profile);
        return res.status(500).json({ error: 'Failed to fetch profile' });
      }

      // Step 2: Insert user into Supabase
      const supabase = (await import('./supabaseClient.js')).default;
      const { error: userError } = await supabase.from('users').upsert({
        spotify_id: profile.id,
        display_name: profile.display_name,
        email: profile.email,
        country: profile.country
      }, {
        onConflict: 'spotify_id',
      });

      if (userError) {
        console.error('Supabase insert error:', userError.message);
      } else {
        console.log('User upserted into Supabase:', profile.display_name);
      }

      // Step 3: Get top tracks
      const topTracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const topTracksData = await topTracksRes.json();

      // Step 4: Get user ID from Supabase
      const { data: userRows, error: findUserError } = await supabase
        .from('users')
        .select('id')
        .eq('spotify_id', profile.id)
        .single();

      if (findUserError || !userRows) {
        console.error('Could not find user in Supabase:', findUserError);
        return;
      }

      const userId = userRows.id;

      // Step 5: Upsert top tracks
      for (const track of topTracksData.items || []) {
        const { id: trackId, name, artists, album } = track;
        const artistName = artists[0]?.name || '';
        const albumName = album?.name || '';
        const imageUrl = album?.images?.[0]?.url || '';

        const { error: trackError } = await supabase.from('top_tracks').upsert({
          user_id: userId,
          track_id: trackId,
          name,
          artist: artistName,
          album: albumName,
          image_url: imageUrl,
          time_range: 'short_term',
        }, {
          onConflict: 'user_id,track_id,time_range',
        });

        if (trackError) {
          console.error(`Error upserting track ${trackId}:`, trackError.message);
        } else {
          console.log(`Upserted track: ${name} by ${artistName}`);
        }
      }

      // Step 6: Get top artists
      const topArtistsRes = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=20', {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const topArtistsData = await topArtistsRes.json();

      // Step 7: Upsert top artists
      for (const artist of topArtistsData.items || []) {
        const { id: artistId, name, genres, images, popularity } = artist;
        const imageUrl = images?.[0]?.url || '';

        const { error: artistError } = await supabase.from('top_artists').upsert({
          user_id: userId,
          artist_id: artistId,
          name,
          genres,
          image_url: imageUrl,
          popularity,
          time_range: 'short_term',
        }, {
          onConflict: 'user_id,artist_id,time_range',
        });

        if (artistError) {
          console.error(`Error upserting artist ${name}:`, artistError.message);
        } else {
          console.log(`Upserted artist: ${name}`);
        }
      }

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

app.get('/', (req, res) => {
  res.send('Auth Server is running');
});

app.use('/api', testRoutes);

app.listen(PORT, () => {
  // console.log(`Auth server running at http://127.0.0.1:${PORT}`);
  console.log(`Auth server running on port ${PORT}`);

});
