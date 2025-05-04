import { useState } from 'react';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'http://127.0.0.1:3000/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'code';
const SCOPES = ['user-top-read', 'user-read-email', 'user-read-private'];

const Login = () => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);  // Track login state

  const handleLoginClick = () => {
    if (isLoggingIn) return;  // Prevent multiple clicks

    setIsLoggingIn(true);  // Set the state to indicate login is in progress
    const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join('%20')}`;

    window.location.href = loginUrl;  // Redirect to Spotify login
  };

  return (
    <div>
      <h1>Welcome to WrappedNow</h1>
      <button onClick={handleLoginClick} disabled={isLoggingIn}>
        {isLoggingIn ? 'Logging you in...' : 'Login with Spotify'}
      </button>
    </div>
  );
};

export default Login;
