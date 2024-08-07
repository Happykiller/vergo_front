import React, { useState, useEffect } from 'react';
import { contextStore, ContextStoreModel } from '@src/stores/contextStore';

const ImageFetcher = (dto: {
  name: string,
  width?: number,
  height?: number,
  title?: string
}) => {
  const context:ContextStoreModel = contextStore();
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async (dto: {
      name: string,
      width?: number,
      height?: number
    }) => {
      try {
        
        const response = await fetch(`${process.env.API_URL}/image/${dto.name}?token=${context.access_token}${(dto.width)?`&width=${dto.width}`:''}${(dto.height)?`&height=${dto.height}`:''}`, {
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

    fetchImage(dto);
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div>
      <img src={imageUrl} alt={dto.title} />
    </div>
  );
};

export default ImageFetcher;