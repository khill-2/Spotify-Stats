import testRoutes from './testRoutes.js';
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
// app.post('/auth/token', async (req, res) => {
//   const { code } = req.body;
//   const redirect_uri = 'http://127.0.0.1:3000/callback'; // Your redirect URI (match this with the one in your Spotify Developer Dashboard)

//   // Ensure client ID and secret are available
//   if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
//     return res.status(500).json({ error: 'Client ID or Secret missing' });
//   }

//   const tokenUrl = 'https://accounts.spotify.com/api/token';

//   const params = new URLSearchParams();
//   params.append('grant_type', 'authorization_code');
//   params.append('code', code); // The authorization code from Spotify
//   params.append('redirect_uri', redirect_uri); // The redirect URI (make sure this matches the one in the Spotify Developer Dashboard)
//   params.append('client_id', SPOTIFY_CLIENT_ID);
//   params.append('client_secret', SPOTIFY_CLIENT_SECRET);

//   try {
//     // Exchange the authorization code for an access token
//     const response = await fetch(tokenUrl, {
//       method: 'POST',
//       body: params,
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     });

//     const data = await response.json();
//     console.log('Token exchange data from Spotify:', data); // Debugging log to see the full response

//     // Check if we received the access token and refresh token
//     if (data.access_token && data.refresh_token) {
//       return res.json({
//         access_token: data.access_token,
//         refresh_token: data.refresh_token,
//       });
//     } else {
//       console.error('Token exchange failed:', data);
//       return res.status(400).json({ error: 'Failed to exchange token' });
//     }
//   } catch (err) {
//     console.error('Error during token exchange:', err);
//     return res.status(500).json({ error: 'Internal server error' });
//   }
// });
app.post('/auth/token', async (req, res) => {
  const { code } = req.body;
  const redirect_uri = 'http://127.0.0.1:3000/callback';

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    return res.status(500).json({ error: 'Client ID or Secret missing' });
  }

  const tokenUrl = 'https://accounts.spotify.com/api/token';

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirect_uri);
  params.append('client_id', SPOTIFY_CLIENT_ID);
  params.append('client_secret', SPOTIFY_CLIENT_SECRET);

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = await response.json();
    console.log('Token exchange data from Spotify:', data);

    if (data.access_token && data.refresh_token) {
      const access_token = data.access_token;

      // Step 1: Fetch the user profile from Spotify
      const profileRes = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const profile = await profileRes.json();
      console.log('Spotify profile:', profile);
      if (!profile.id) {
        console.error('❌ Failed to get Spotify profile:', profile);
        return res.status(500).json({ error: 'Failed to fetch profile' });
      }
      

      // Step 2: Save the user to Supabase
      const supabase = (await import('./supabaseClient.js')).default;

      const { error } = await supabase.from('users').upsert({
        spotify_id: profile.id,
        display_name: profile.display_name,
        email: profile.email,
      }, {
        onConflict: 'spotify_id',
      });
      if (error) {
        console.error('❌ Supabase insert error:', error.message);
      } else {
        console.log('✅ User inserted into Supabase:', profile.display_name);
      }
      // Step 3: Fetch user's top tracks from Spotify
const topTracksRes = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=20', {
  headers: {
    Authorization: `Bearer ${access_token}`,
  },
});
const topTracksData = await topTracksRes.json();

if (!topTracksData.items) {
  console.error('❌ Failed to fetch top tracks:', topTracksData);
} else {
  console.log(`🎧 Got ${topTracksData.items.length} top tracks`);
}

// Step 4: Get the Supabase user ID
const { data: userRows, error: userError } = await supabase
  .from('users')
  .select('id')
  .eq('spotify_id', profile.id)
  .single();

if (userError || !userRows) {
  console.error('❌ Could not find user in Supabase:', userError);
  return;
}

const userId = userRows.id;

// Step 5: Insert top tracks into Supabase
for (const track of topTracksData.items) {
  const { id: trackId, name, artists, album } = track;
  const artistName = artists[0]?.name || '';
  const albumName = album?.name || '';
  const imageUrl = album?.images?.[0]?.url || '';

  const { error: insertError } = await supabase.from('top_tracks').insert({
    user_id: userId,
    track_id: trackId,
    name,
    artist: artistName,
    album: albumName,
    image_url: imageUrl,
    time_range: 'short_term',
  });

  if (insertError) {
    console.error(`❌ Error inserting track ${trackId}:`, insertError.message);
  } else {
    console.log(`✅ Inserted track: ${name} by ${artistName}`);
  }
}

// ✅ Step 6: Fetch top artists from Spotify (outside the track loop!)
const topArtistsRes = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=20', {
  headers: {
    Authorization: `Bearer ${access_token}`,
  },
});

const topArtistsData = await topArtistsRes.json();
console.log('🎨 Top artists response:', topArtistsData);

if (!topArtistsData.items || !Array.isArray(topArtistsData.items)) {
  console.error('❌ Failed to get top artists:', topArtistsData);
} else {
  console.log(`🎨 Got ${topArtistsData.items.length} top artists`);
}

// Step 7: Insert each artist into Supabase
for (const artist of topArtistsData.items) {
  const { id: artistId, name, genres, images, popularity } = artist;
  const imageUrl = images?.[0]?.url || '';

  const { error: artistInsertErr } = await supabase.from('top_artists').insert({
    user_id: userId,
    artist_id: artistId,
    name,
    genres,
    image_url: imageUrl,
    popularity,
    time_range: 'short_term'
  });

  if (artistInsertErr) {
    console.error(`❌ Error inserting artist ${name}:`, artistInsertErr.message);
  } else {
    console.log(`✅ Inserted artist: ${name}`);
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

// Endpoint to test server
app.get('/', (req, res) => {
  res.send('Auth Server is running');
});

app.use('/api', testRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Auth server running at http://127.0.0.1:${PORT}`);
});
