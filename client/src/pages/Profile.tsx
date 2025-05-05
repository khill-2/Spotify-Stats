import { useEffect, useState } from 'react';

const Profile = () => {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    if (!token) return;

    fetchUserStats(token).then((data) => {
      setUserData(data);
      setIsLoading(false);
    });
  }, []);

  const fetchUserStats = async (token: string) => {
    try {
      const [profileRes, tracksRes, artistsRes] = await Promise.all([
        fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=short_term', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('https://api.spotify.com/v1/me/top/artists?limit=20&time_range=short_term', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const profileData = await profileRes.json();
      const tracksData = await tracksRes.json();
      const artistsData = await artistsRes.json();

      return {
        display_name: profileData.display_name,
        email: profileData.email,
        country: profileData.country,
        topTracks: tracksData.items || [],
        topArtists: artistsData.items || [],
      };
    } catch (err) {
      console.error('❌ Failed to fetch user stats:', err);
      return {
        display_name: 'Unknown',
        email: '',
        country: '',
        topTracks: [],
        topArtists: [],
      };
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

      <div className="mb-6">
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Country:</strong> {userData.country}</p>
      </div>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Top Tracks</h2>
      <ul className="space-y-4">
        {userData.topTracks.map((track: any) => (
          <li key={track.id} className="flex items-center space-x-4">
            <img src={track.album.images[0]?.url} alt={track.name} width={50} />
            <div>
              <p className="font-semibold">{track.name}</p>
              <p className="text-sm text-gray-400">
                {track.artists.map((artist: any) => artist.name).join(', ')}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-12 mb-4">Top Artists</h2>
      <ul className="space-y-4">
        {userData.topArtists.map((artist: any) => (
          <li key={artist.id} className="flex items-center space-x-4">
            <img src={artist.images[0]?.url} alt={artist.name} width={50} />
            <div>
              <p className="font-semibold">{artist.name}</p>
              <p className="text-sm text-gray-400">{artist.genres.slice(0, 3).join(', ')}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
