// import React, { useEffect, useState } from 'react';
import { useEffect, useState } from 'react';

import useSpotifyApi from '../hooks/useSpotifyApi'; // Import your custom hook

const Profile = () => {
  const token = localStorage.getItem('spotify_token'); // Get token from localStorage
  const [topTracks, setTopTracks] = useState<any[]>([]); // To store top tracks data

  // Fetch user profile data
  const { data: profileData, error, loading } = useSpotifyApi('me', token); // Fetch profile data

  // Fetch top tracks (you can adjust limit and time_range here)
  useEffect(() => {
    if (token) {
      const fetchTopTracks = async () => {
        try {
          const response = await fetch('https://api.spotify.com/v1/me/top/tracks', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setTopTracks(data.items); // Save top tracks data
        } catch (err) {
          console.error('Error fetching top tracks:', err);
        }
      };
      fetchTopTracks();
    }
  }, [token]); // Run only when token changes

  if (loading) return <p>Loading profile...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Spotify Profile</h1>
      {profileData && (
        <div>
          <p><strong>Name:</strong> {profileData.display_name}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Country:</strong> {profileData.country}</p>
        </div>
      )}

      <h2>Top Tracks</h2>
      {topTracks.length > 0 ? (
        <ul>
          {topTracks.map((track: any) => (
            <li key={track.id}>
              <img src={track.album.images[0]?.url} alt={track.name} width={50} />
              <p>{track.name}</p>
              <p>{track.artists.map((artist: any) => artist.name).join(', ')}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading top tracks...</p>
      )}
    </div>
  );
};

export default Profile;
