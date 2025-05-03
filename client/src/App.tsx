import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);  // To handle loading state

  useEffect(() => {
    // Check if there's a token already stored in localStorage
    const token = localStorage.getItem('spotify_token');

    if (token) {
      // If token exists, redirect to profile page (since the user is already logged in)
      navigate('/profile');
    } else {
      setIsLoading(false); // Stop loading when no token is found
    }
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // Show loading until we check for the token
  }

  return (
    <div>
      <h1>Welcome to WrappedNow</h1>
      <p>If you're not logged in, you can <a href="/login">login here</a>.</p>
    </div>
  );
};

export default App;
