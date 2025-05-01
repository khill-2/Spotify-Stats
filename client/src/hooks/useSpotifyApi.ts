import { useState, useEffect } from 'react';

const useSpotifyApi = (endpoint: string, token: string | null) => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!token) {
      setError('No token available');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch data from Spotify');
        const result = await res.json();
        setData(result);
      } catch (err: any) { // Specify the error type as 'any'
        setError(err.message); // Use 'err.message' for error details
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, token]);

  return { data, error, loading };
};

export default useSpotifyApi;
