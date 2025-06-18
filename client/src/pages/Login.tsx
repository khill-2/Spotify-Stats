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
    <div className="text-white bg-black h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">Welcome to Spotify Stats Dashboard</h1>
      <a
        href={AUTH_URL}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
      >
        Login with Spotify
      </a>
    </div>
  );
};

export default Login;
