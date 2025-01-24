import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Box } from '@mui/material';

import Header from '@components/Header';

const Home: React.FC = () => {
  const { t } = useTranslation();

  return (<>
    <Header/>
    <Container>
      {/* Box component to center the content both horizontally and vertically */}
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        textAlign="center"
      >
        {/* Typography component for displaying the heading */}
        <Typography variant="h2">
          {t('home.helloWorld')} {/* Translation key for the text to be displayed */}
        </Typography>
      </Box>
    </Container>
  </>);
}

export default Home;
