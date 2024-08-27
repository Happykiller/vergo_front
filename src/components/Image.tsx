import { CircularProgress } from '@mui/material';
import React, { useState, useEffect } from 'react';

import { contextStore, ContextStoreModel } from '@stores/contextStore';

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
        fetch(`${process.env.API_URL}/image/${dto.name}?token=${context.access_token}${(dto.width)?`&width=${dto.width}`:''}${(dto.height)?`&height=${dto.height}`:''}`, {
          method: 'GET',
          mode: 'cors', // no-cors, *cors, same-origin
        }).then(async (response:any) => {
          if (!response.ok) {
            throw new Error('Erreur lors du fetch');
          } else {
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setImageUrl(url);
          }
        }).catch((err:any) => {
          throw new Error('Erreur lors du fetch');
        });
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchImage(dto);
  }, []);

  if (imageUrl === '') {
    return <>
      <CircularProgress />
    </>
  }

  if (loading) {
    return <>
      <CircularProgress />
    </>
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
