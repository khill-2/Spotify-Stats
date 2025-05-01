import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();
  const alreadyFetched = useRef(false); // 🛡 prevents multiple POSTs

  useEffect(() => {
    if (alreadyFetched.current) return;

    const query = new URLSearchParams(window.location.search);
    const code = query.get('code');

    if (code) {
      alreadyFetched.current = true;

      fetch('http://localhost:3001/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })
        .then(res => {
          if (!res.ok) throw new Error('Token exchange failed');
          return res.json();
        })
        .then(data => {
          localStorage.setItem('spotify_token', data.access_token);
          navigate('/');
        })
        .catch(err => {
          console.error('❌ Frontend fetch failed:', err);
        });
    }
  }, [navigate]);

  return <p>Logging you in...</p>;
};

export default Callback;
