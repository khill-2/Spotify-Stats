import React from 'react';
import { Link } from 'react-router-dom';

const App: React.FC = () => {
  return (
    <div>
      <h1>WrappedNow</h1>
      <p>Start by logging in with your Spotify account:</p>
      <Link to="/login">
        <button>Login with Spotify</button>
      </Link>
    </div>
  );
};

export default App;
