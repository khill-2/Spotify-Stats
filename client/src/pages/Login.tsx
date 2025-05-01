const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = 'http://127.0.0.1:3000/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'code';
const SCOPES = [
  'user-top-read',
  'user-read-email',
  'user-read-private',
];

const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
  REDIRECT_URI
)}&response_type=${RESPONSE_TYPE}&scope=${SCOPES.join('%20')}`;

const Login = () => {
  return (
    <div>
      <h1>Welcome to WrappedNow</h1>
      <a href={loginUrl}>
        <button>Login with Spotify</button>
      </a>
    </div>
  );
};

export default Login;
