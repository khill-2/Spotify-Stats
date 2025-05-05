// import { useEffect, useState } from 'react';

// const Profile = () => {
//   const [userData, setUserData] = useState<any>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('spotify_token');
//     if (!token) return;

//     fetchUserStats(token).then((data) => {
//       setUserData(data);
//       setIsLoading(false);
//     });
//   }, []);

//   const fetchUserStats = async (token: string) => {
//     try {
//       const [profileRes, tracksRes, artistsRes] = await Promise.all([
//         fetch('https://api.spotify.com/v1/me', {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch('https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=short_term', {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=short_term', {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       const profileData = await profileRes.json();
//       const tracksData = await tracksRes.json();
//       const artistsData = await artistsRes.json();

//       return {
//         display_name: profileData.display_name,
//         email: profileData.email,
//         country: profileData.country,
//         topTracks: tracksData.items || [],
//         topArtists: artistsData.items || [],
//       };
//     } catch (err) {
//       console.error('❌ Failed to fetch user stats:', err);
//       return {
//         display_name: 'Unknown',
//         email: '',
//         country: '',
//         topTracks: [],
//         topArtists: [],
//       };
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
//     <div className="bg-black text-white p-8">
//       <h1 className="text-3xl font-bold mb-4">Welcome, {userData.display_name}</h1>

//       <div className="mb-6">
//         <p><strong>Email:</strong> {userData.email}</p>
//         <p><strong>Country:</strong> {userData.country}</p>
//       </div>

//       <h2 className="text-2xl font-semibold mt-8 mb-4">Top Tracks</h2>
//       <ul className="space-y-4">
//         {userData.topTracks.map((track: any) => (
//           <li key={track.id} className="flex items-center space-x-4">
//             <img src={track.album.images[0]?.url} alt={track.name} width={50} />
//             <div>
//               <p className="font-semibold">{track.name}</p>
//               <p className="text-sm text-gray-400">
//                 {track.artists.map((artist: any) => artist.name).join(', ')}
//               </p>
//             </div>
//           </li>
//         ))}
//       </ul>

//       <h2 className="text-2xl font-semibold mt-12 mb-4">Top Artists</h2>
//       <ul className="space-y-4">
//         {userData.topArtists.map((artist: any) => (
//           <li key={artist.id} className="flex items-center space-x-4">
//             <img src={artist.images[0]?.url} alt={artist.name} width={50} />
//             <div>
//               <p className="font-semibold">{artist.name}</p>
//               <p className="text-sm text-gray-400">{artist.genres.slice(0, 3).join(', ')}</p>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Profile;
import { useEffect, useState } from 'react';

const SUPABASE_URL = 'https://cvigdtwvkcsmwglfugqr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2aWdkdHd2a2NzbXdnbGZ1Z3FyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MTU3ODUsImV4cCI6MjA2MTk5MTc4NX0.JI6-Ui2fI2kzjRB9yIsWgUN_xTe0oyOQ3vwMtq4wHv8';

const Profile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (!token) return;

    fetchFromSupabase(token).then((data) => {
      setUserData(data.user);
      setTopTracks(data.topTracks);
      setTopArtists(data.topArtists);
      setIsLoading(false);
    });
  }, []);

  const fetchFromSupabase = async (token: string) => {
    try {
      // Get Spotify user profile to extract spotify_id
      const profileRes = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profile = await profileRes.json();

      // Step 1: Get user ID from Supabase using spotify_id
      const userRes = await fetch(`${SUPABASE_URL}/rest/v1/users?select=id,display_name,email,country&spotify_id=eq.${profile.id}`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      const userData = await userRes.json();
      if (!userData.length) throw new Error('User not found in DB');
      const user = userData[0];

      // Step 2: Get top tracks
      const tracksRes = await fetch(`${SUPABASE_URL}/rest/v1/top_tracks?user_id=eq.${user.id}&select=*`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      const tracks = await tracksRes.json();

      // Step 3: Get top artists
      const artistsRes = await fetch(`${SUPABASE_URL}/rest/v1/top_artists?user_id=eq.${user.id}&select=*`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      const artists = await artistsRes.json();

      return { user, topTracks: tracks, topArtists: artists };
    } catch (err) {
      console.error('❌ Error fetching from Supabase:', err);
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
    <div className="bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome, {userData.display_name}</h1>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Country:</strong> {userData.country}</p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">Top Tracks</h2>
      {topTracks.length > 0 ? (
        <ul className="space-y-3 mb-8">
          {topTracks.map((track: any) => (
            <li key={track.track_id} className="flex items-center space-x-4">
              {/* <img src={track.image_url} alt={track.name} className="w-6 h-6 rounded" /> */}
              <img src={track.image_url} alt={track.name} style={{ width: '120px', height: '120px', borderRadius: '4px' }} />
              <div>
                <p className="font-semibold">{track.name}</p>
                <p className="text-sm text-gray-400">{track.artist}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : <p>No tracks found.</p>}

      <h2 className="text-2xl font-semibold mb-2">Top Artists</h2>
      {topArtists.length > 0 ? (
        <ul className="space-y-3">
          {topArtists.map((artist: any) => (
            <li key={artist.artist_id} className="flex items-center space-x-4">
              {/* <img src={artist.image_url} alt={artist.name} className="w-6 h-6 rounded" /> */}
              <img src={artist.image_url} alt={artist.name} style={{ width: '120px', height: '120px', borderRadius: '4px' }} />
              <div>
                <p className="font-semibold">{artist.name}</p>
                <p className="text-sm text-gray-400">Popularity: {artist.popularity}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : <p>No artists found.</p>}
    </div>
  );
};

export default Profile;
