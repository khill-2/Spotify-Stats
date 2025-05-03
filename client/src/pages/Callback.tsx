import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the 'code' parameter from the URL (the authorization code from Spotify)
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');
    
    if (code) {
      // Send the code to the backend to exchange for an access token
      fetch('http://localhost:3001/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }), // Send the code to the backend
      })
        .then((res) => res.json())
        .then((data) => {
          // Check if token data is returned successfully
          if (data.access_token && data.refresh_token) {
            // Store the access token and refresh token in localStorage
            localStorage.setItem('spotify_token', data.access_token);
            localStorage.setItem('spotify_refresh_token', data.refresh_token);

            // Redirect to profile page after successful login
            navigate('/profile');
          } else {
            console.error('Token exchange failed: Missing access_token or refresh_token');
          }
        })
        .catch((err) => {
          console.error('❌ Token exchange failed:', err);
        });
    } else {
      console.error('No authorization code found in URL');
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default Callback;
