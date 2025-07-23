import './Login.css';

const Login = () => {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  // const REDIRECT_URI = 'http://127.0.0.1:3000/callback';
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
  const SCOPES = [
    'user-read-email',
    'user-read-private',
    'user-top-read',
  ].join(' ');

  const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

  return (
    <div className="login-container">
      {/* Spotify Logo ABOVE the header */}
      <img
        src="/spotify-logo.png"
        alt="Spotify Logo"
        className="spotify-logo-centered"
      />

      <h1>Welcome to Spotify Stats Dashboard</h1>
      <a href={AUTH_URL} className="login-button">
        Login with Spotify®
      </a>
    </div>
  );
};

export default Login;

