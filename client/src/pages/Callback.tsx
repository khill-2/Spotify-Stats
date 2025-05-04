import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Get the authorization code from the URL query parameters
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');
    console.log('Received code:', code); // Log the received code for debugging

    if (code) {
      fetch('http://localhost:3001/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }), // Send the code to the backend
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Received token data:', data); // Log the token data for debugging
          
          // Store the access token in localStorage
          localStorage.setItem('spotify_token', data.access_token);
          
          // Redirect to the profile page after successful login
          navigate('/profile'); // This redirects to the profile page
        })
        .catch((err) => {
          console.error('❌ Token exchange failed:', err);
        });
    } else {
      console.error('No code found in the URL');
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
};

export default Callback;
