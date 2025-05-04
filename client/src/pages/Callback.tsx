import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');
  
    if (code) {
      fetch('http://127.0.0.1:3001/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }), // Send the code to the backend
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token && data.refresh_token) {
            // Save the access and refresh tokens in localStorage
            localStorage.setItem('spotify_token', data.access_token);
            localStorage.setItem('spotify_refresh_token', data.refresh_token);
  
            navigate('/profile'); // Redirect to profile after successful login
          } else {
            console.error('❌ Token exchange failed: Missing access_token or refresh_token');
            alert('Error during login. Please try again.');
          }
        })
        .catch((err) => {
          console.error('❌ Token exchange failed:', err);
          alert('Error during login. Please try again.');
        });
    } else {
      console.error('No authorization code found in URL');
      alert('No authorization code found in URL');
    }
  }, [navigate]);

  return <div>Logging you in...</div>;
};

export default Callback;
