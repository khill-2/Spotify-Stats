// const Login = () => {
//   const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
//   // const REDIRECT_URI = 'http://127.0.0.1:3000/callback';
//   const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
//   const SCOPES = [
//     'user-read-email',
//     'user-read-private',
//     'user-top-read',
//   ].join(' ');

//   const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

//   return (
//     <div className="text-white bg-black h-screen flex flex-col items-center justify-center">
//       <h1 className="text-3xl mb-4">Welcome to Spotify Stats Dashboard</h1>
//       <a
//         href={AUTH_URL}
//         className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
//       >
//         Login with Spotify
//       </a>
//     </div>
//   );
// };

// export default Login;

const Login = () => {
  const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

  const SCOPES = [
    'user-read-email',
    'user-read-private',
    'user-top-read',
  ].join(' ');

  const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-zinc-900 via-black to-zinc-800 flex items-center justify-center">
      <div className="text-center space-y-6 px-6">
        <h1 className="text-4xl font-semibold text-white">
          Your Spotify Wrapped, Anytime
        </h1>
        <p className="text-zinc-300 text-lg max-w-md mx-auto">
          Dive into your top tracks, artists, and listening stats — all in real time.
        </p>
        <a
          href={AUTH_URL}
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200"
        >
          Login with Spotify
        </a>
      </div>
    </div>
  );
};

export default Login;

