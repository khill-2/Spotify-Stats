import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // To handle loading state
  const [token, setToken] = useState<string | null>(null); // To hold token state

  // Stop loading after checking token and do not automatically redirect to profile
  useEffect(() => {
    // Check if the token exists in localStorage
    const storedToken = localStorage.getItem('spotify_token');
    if (storedToken) {
      setToken(storedToken); // Set token if exists
      navigate('/profile'); // Redirect to profile page if token is found
    }
    setIsLoading(false); // Stop loading if no token found
  }, [navigate]);

  // Handle login redirection to Spotify
  const handleLogin = () => {
    const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const REDIRECT_URI = 'http://127.0.0.1:3000/callback'; // Must match the one in the Spotify dashboard
    const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
    const RESPONSE_TYPE = 'code'; // Spotify's expected response type for OAuth
    const SCOPES = [
      'user-top-read',
      'user-read-email',
      'user-read-private',
    ];

    // Construct the login URL
    const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join('%20')}`;

    // Redirect the user to the Spotify login page
    window.location.href = loginUrl; // This will redirect to Spotify
  };

  if (isLoading) {
    return <div>Loading...</div>; // Show loading until we check for the token
  }

  return (
    <div>
      <h1>Welcome to WrappedNow</h1>
      {/* Show login button if no token is found */}
      {!token ? (
        <button onClick={handleLogin}>Login with Spotify</button>
      ) : (
        <p>You are already logged in. Redirecting to profile...</p>
      )}
    </div>
  );
};

export default App;
