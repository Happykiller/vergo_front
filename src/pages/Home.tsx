import React from 'react';
import { Container, Typography, Box } from '@mui/material'; // Import Material-UI components for layout and typography
import { useTranslation } from 'react-i18next'; // Import the `useTranslation` hook for i18n

const Home: React.FC = () => {
  // Get the `t` function from the `useTranslation` hook to handle translations
  const { t } = useTranslation();

  return (
    <Container>
      {/* Box component to center the content both horizontally and vertically */}
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh" // Minimum height of 80% of the viewport height
        textAlign="center" // Center text alignment
      >
        {/* Typography component for displaying the heading */}
        <Typography variant="h2">
          {t('home.helloWorld')} {/* Translation key for the text to be displayed */}
        </Typography>
      </Box>
    </Container>
  );
}

export default Home;
