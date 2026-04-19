// src\components\ImageFetcher.tsx
import React, { useState, useEffect } from 'react';
import { CircularProgress, Box } from '@mui/material';
import { contextStore, ContextStoreModel } from '@stores/contextStore';

interface Props {
  name: string;
  width?: number;
  height?: number;
  title?: string;
  v2?: boolean;
  style?: React.CSSProperties;
}

const ImageFetcher: React.FC<Props> = ({ name, width, height, title, v2 = false, style }) => {
  const context: ContextStoreModel = contextStore();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const url = `${process.env.API_URL}/image/${name}?${v2 ? 'v2=true&' : ''}token=${context.access_token}${width ? `&width=${width}` : ''}${height ? `&height=${height}` : ''}`;
        const response = await fetch(url, { method: 'GET', mode: 'cors' });

        if (!response.ok) throw new Error('Image fetch failed');

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setImageUrl(objectUrl);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchImage();
  }, [name, width, height, v2, context.access_token]);

  if (error) return <Box color="error.main">Erreur: {error}</Box>;
  if (!imageUrl) return <CircularProgress />;

  return (
    <Box
      component="img"
      src={imageUrl}
      alt={title ?? name}
      width={width}
      height={height}
      onLoad={() => setLoaded(true)}
      sx={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 600ms ease-in-out',
        display: 'block',
        objectFit: 'contain',
        borderRadius: '16px',
        boxShadow: loaded ? '0 0 12px rgba(0,0,0,0.1)' : 'none',
        backgroundColor: loaded ? 'transparent' : '#f5f5f5',
        ...style,
      }}
    />
  );
};

export default ImageFetcher;
