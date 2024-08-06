import React, { useState, useEffect } from 'react';

const ImageFetcher = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`http://localhost:3000/image/man-doing-seated.jpg?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2RlIjoiYWRtaW4iLCJpZCI6IjY2YjBiOGFkM2FjYmExMTdiMjdjNjA3YyIsImlhdCI6MTcyMjk1NDU0NywiZXhwIjoxNzIyOTgzMzQ3fQ.l4ydrKHxLsZlq6R_o08qWrlQZ9XSX2Laneyj5Df964o`, {
          method: 'GET',
          mode: 'cors', // no-cors, *cors, same-origin
        });
        if (!response.ok) {
          throw new Error('Erreur lors du fetch');
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>
      <img src={imageUrl} alt="Fetched content" />
    </div>
  );
};

export default ImageFetcher;
