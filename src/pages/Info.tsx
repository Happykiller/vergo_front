import React from 'react';
import { Container, Typography, Box } from '@mui/material'; // Import Material-UI components
import { useTranslation } from 'react-i18next'; // Import translation hook for i18n

import Header from '@components/Header';

const Info: React.FC = () => {
  // Use the translation hook to get the translation function
  const { t } = useTranslation();

  return (<>
    <Header/>
    <Container>
      {/* Box component to center the content vertically and horizontally */}
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh" // Minimum height of 80% of the viewport height
        textAlign="center" // Center text alignment
      >
        {/* Typography component to display the page title */}
        <Typography variant="h2">
          {t('info.infoPage')} {/* Translation key for the page title */}
        </Typography>
      </Box>
    </Container>
  </>);
}

export default Info;
