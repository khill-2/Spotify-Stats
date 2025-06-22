// import { useEffect, useState } from 'react';
// import './Profile.css';

// const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
// const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;


// const Profile = () => {
//   const [userData, setUserData] = useState<any>(null);
//   const [topTracks, setTopTracks] = useState<any[]>([]);
//   const [topArtists, setTopArtists] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('spotify_token');
//     if (!token) return;

//     fetchFromSupabase(token).then((data) => {
//       setUserData(data.user);
//       setTopTracks(data.topTracks);
//       setTopArtists(data.topArtists);
//       setIsLoading(false);
//     });
//   }, []);

//   const fetchFromSupabase = async (token: string) => {
//     try {
//       // Get Spotify user profile to extract spotify_id
//       const profileRes = await fetch('https://api.spotify.com/v1/me', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const profile = await profileRes.json();

//       // Step 1: Get user ID from Supabase using spotify_id
//       const userRes = await fetch(`${SUPABASE_URL}/rest/v1/users?select=id,display_name,email,country&spotify_id=eq.${profile.id}`, {
//         headers: {
//           apikey: SUPABASE_ANON_KEY,
//           Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
//         },
//       });
//       const userData = await userRes.json();
//       if (!userData.length) throw new Error('User not found in DB');
//       const user = userData[0];

//       // Step 2: Get top tracks
//       const tracksRes = await fetch(`${SUPABASE_URL}/rest/v1/top_tracks?user_id=eq.${user.id}&select=*`, {
//         headers: {
//           apikey: SUPABASE_ANON_KEY,
//           Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
//         },
//       });
//       const tracks = await tracksRes.json();

//       // Step 3: Get top artists
//       const artistsRes = await fetch(`${SUPABASE_URL}/rest/v1/top_artists?user_id=eq.${user.id}&select=*`, {
//         headers: {
//           apikey: SUPABASE_ANON_KEY,
//           Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
//         },
//       });
//       const artists = await artistsRes.json();

//       return { user, topTracks: tracks, topArtists: artists };
//     } catch (err) {
//       console.error('Error fetching from Supabase:', err);
//       return { user: { display_name: 'Unknown' }, topTracks: [], topArtists: [] };
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-xl">
//         <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mb-4" />
//         <p>Loading your Spotify stats...</p>
//       </div>
//     );
//   }
//   return (
//     <div className="profile-container">
//     <h1 className="profile-header">Welcome, {userData.display_name}</h1>
//     <div className="profile-info">
//       <p><strong>Email:</strong> {userData.email}</p>
//       <p><strong>Country:</strong> {userData.country}</p>
//     </div>

//     <h2 className="section-title">Top Tracks</h2>
//     {topTracks.length > 0 ? (
//       <div className="grid">
//         {topTracks.map((track: any) => (
//           <div key={track.track_id} className="card">
//             <img src={track.image_url} alt={track.name} />
//             <div className="card-content">
//               <p className="title">{track.name}</p>
//               <p className="subtitle">{track.artist}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : <p>No tracks found.</p>}

//     <h2 className="section-title">Top Artists</h2>
//     {topArtists.length > 0 ? (
//       <div className="grid">
//         {topArtists.map((artist: any) => (
//           <div key={artist.artist_id} className="card">
//             <img src={artist.image_url} alt={artist.name} />
//             <div className="card-content">
//               <p className="title">{artist.name}</p>
//               <p className="subtitle">Popularity: {artist.popularity}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     ) : <p>No artists found.</p>}
//   </div>
//   );
  
// };

// export default Profile;
import { useEffect, useState } from 'react';
import './Profile.css';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const Profile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (!token) return;

    fetchAndSyncUserData(token).then((data) => {
      setUserData(data.user);
      setTopTracks(data.topTracks);
      setTopArtists(data.topArtists);
      setIsLoading(false);
    });
  }, []);

  const fetchAndSyncUserData = async (token: string) => {
    try {
      // Get Spotify profile
      const profileRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profile = await profileRes.json();

      // Check for existing user in Supabase
      const userRes = await fetch(
        `${SUPABASE_URL}/rest/v1/users?select=*&spotify_id=eq.${profile.id}`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      );
      const users = await userRes.json();
      let user = users[0];

      if (!user) {
        // Insert new user
        const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            spotify_id: profile.id,
            display_name: profile.display_name,
            email: profile.email,
            country: profile.country,
          }),
        });

        const inserted = await insertRes.json();
        user = inserted[0];

        // Fetch top tracks from Spotify
        const tracksRes = await fetch(
          'https://api.spotify.com/v1/me/top/tracks?limit=10',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const tracksData = await tracksRes.json();
        const topTracks = tracksData.items.map((track: any) => ({
          user_id: user.id,
          track_id: track.id,
          name: track.name,
          artist: track.artists.map((a: any) => a.name).join(', '),
          image_url: track.album.images?.[0]?.url,
        }));

        await fetch(`${SUPABASE_URL}/rest/v1/top_tracks`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(topTracks),
        });

        // Fetch top artists from Spotify
        const artistsRes = await fetch(
          'https://api.spotify.com/v1/me/top/artists?limit=10',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const artistsData = await artistsRes.json();
        const topArtists = artistsData.items.map((artist: any) => ({
          user_id: user.id,
          artist_id: artist.id,
          name: artist.name,
          popularity: artist.popularity,
          image_url: artist.images?.[0]?.url,
        }));

        await fetch(`${SUPABASE_URL}/rest/v1/top_artists`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(topArtists),
        });

        return { user, topTracks, topArtists };
      } else {
        // Fetch cached data from Supabase
        const tracksRes = await fetch(
          `${SUPABASE_URL}/rest/v1/top_tracks?user_id=eq.${user.id}&select=*`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        );
        const topTracks = await tracksRes.json();

        const artistsRes = await fetch(
          `${SUPABASE_URL}/rest/v1/top_artists?user_id=eq.${user.id}&select=*`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            },
          }
        );
        const topArtists = await artistsRes.json();

        return { user, topTracks, topArtists };
      }
    } catch (err) {
      console.error('Error fetching/syncing user:', err);
      return { user: { display_name: 'Unknown' }, topTracks: [], topArtists: [] };
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white text-xl">
        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full mb-4" />
        <p>Loading your Spotify stats...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h1 className="profile-header">Welcome, {userData.display_name}</h1>
      <div className="profile-info">
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Country:</strong> {userData.country}</p>
      </div>

      <h2 className="section-title">Top Tracks</h2>
      {topTracks.length > 0 ? (
        <div className="grid">
          {topTracks.map((track: any) => (
            <div key={track.track_id} className="card">
              <img src={track.image_url} alt={track.name} />
              <div className="card-content">
                <p className="title">{track.name}</p>
                <p className="subtitle">{track.artist}</p>
              </div>
            </div>
          ))}
        </div>
      ) : <p>No tracks found.</p>}

      <h2 className="section-title">Top Artists</h2>
      {topArtists.length > 0 ? (
        <div className="grid">
          {topArtists.map((artist: any) => (
            <div key={artist.artist_id} className="card">
              <img src={artist.image_url} alt={artist.name} />
              <div className="card-content">
                <p className="title">{artist.name}</p>
                <p className="subtitle">Popularity: {artist.popularity}</p>
              </div>
            </div>
          ))}
        </div>
      ) : <p>No artists found.</p>}
    </div>
  );
};

export default Profile;
