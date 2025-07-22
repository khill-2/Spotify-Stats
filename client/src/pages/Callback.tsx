//correct logic for callback code authorization
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Loading.css';

const Callback = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      setIsLoading(true);
      // fetch('http://127.0.0.1:3001/auth/token', {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token && data.refresh_token) {
            localStorage.setItem('spotify_token', data.access_token);
            navigate('/profile');
            localStorage.setItem('spotify_refresh_token', data.refresh_token);

            // clean url (remove ?code=...)
            window.history.replaceState({}, document.title, '/profile');
            navigate('/profile');
          } else {
            console.warn('Token exchange failed — possibly reused or expired code.');
            setIsLoading(false);
            navigate('/login');
          }
        })
        .catch((err) => {
          console.error('Error during login:', err);
          setIsLoading(false);
          navigate('/login');
        });
    }
  }, [navigate]);

  return (
    <div className="loading-container">
      {isLoading ? (
        <>
          <div className="spinner" />
          <p>Loading your Spotify stats...</p>
        </>
      ) : (
        <p>Logging you in...</p>
      )}
    </div>
  );
};

export default Callback;
