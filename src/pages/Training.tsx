import React from 'react';
import { useTranslation } from 'react-i18next'; // Import translation hook for i18n
import { Container, Box } from '@mui/material'; // Import Material-UI components

import Chrono from '@components/Chrono';

const Training: React.FC = () => {
  // Use the translation hook to get the translation function
  const { t } = useTranslation();

  return (
    <Container>
      {/* Box component to center the content vertically and horizontally */}
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh" // Minimum height of 80% of the viewport height
        textAlign="center" // Center text alignment
      >
        <Chrono duration={60} onComplete={() => console.log('Décompte terminé !')} />
      </Box>
    </Container>
  );
}

export default Training;
