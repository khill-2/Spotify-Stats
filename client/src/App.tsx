import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);  // To handle loading state
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('spotify_token');
    const refreshToken = localStorage.getItem('spotify_refresh_token');
  
    if (token) {
      fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (response.ok) {
            navigate('/profile'); // Token is valid, proceed to profile
          } else {
            // Token is invalid or expired, proceed to login
            localStorage.removeItem('spotify_token');
            localStorage.removeItem('spotify_refresh_token');
            navigate('/login');
          }
        })
        .catch((err) => {
          // Handle errors (e.g., network issues)
          console.error('Error validating token:', err);
          localStorage.removeItem('spotify_token');
          localStorage.removeItem('spotify_refresh_token');
          navigate('/login');
        });
    } else {
      setIsLoading(false);
      navigate('/login'); // No token found, go to login
    }
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <div>Redirecting...</div>; // You shouldn't reach here, as navigate should always occur
};

export default App;
