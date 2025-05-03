import { useEffect, useState } from 'react';

const Profile = () => {
  const [user, setUser] = useState<any>(null);
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [topArtists, setTopArtists] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    
    if (token) {
      // Fetch basic user profile data from Spotify API
      fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          console.error('Error fetching user profile:', err);
        });

      // Fetch user's top tracks
      fetch('https://api.spotify.com/v1/me/top/tracks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTopTracks(data.items); // Store top tracks
        })
        .catch((err) => {
          console.error('Error fetching top tracks:', err);
        });

      // Fetch user's top artists
      fetch('https://api.spotify.com/v1/me/top/artists', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setTopArtists(data.items); // Store top artists
        })
        .catch((err) => {
          console.error('Error fetching top artists:', err);
        });
    } else {
      console.error('No token found!');
    }
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{user.display_name}'s Profile</h1>
      <img src={user.images[0]?.url} alt="Profile" style={{ width: '200px', borderRadius: '50%' }} />
      <p>Email: {user.email}</p>
      <p>Followers: {user.followers.total}</p>

      <h2>Top Tracks</h2>
      <ul>
        {topTracks.length > 0 ? (
          topTracks.map((track: any) => (
            <li key={track.id}>
              <p>{track.name}</p>
              <p>Artists: {track.artists.map((artist: any) => artist.name).join(', ')}</p>
              <img src={track.album.images[0]?.url} alt={track.name} style={{ width: '100px' }} />
            </li>
          ))
        ) : (
          <p>No top tracks available.</p>
        )}
      </ul>

      <h2>Top Artists</h2>
      <ul>
        {topArtists.length > 0 ? (
          topArtists.map((artist: any) => (
            <li key={artist.id}>
              <p>{artist.name}</p>
              <img src={artist.images[0]?.url} alt={artist.name} style={{ width: '100px' }} />
            </li>
          ))
        ) : (
          <p>No top artists available.</p>
        )}
      </ul>
    </div>
  );
};

export default Profile;
