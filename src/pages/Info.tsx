import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Box } from '@mui/material';

import Header from '@components/Header';
import CurrentBreakpoint from '@components/CurrentBreakpoint';

const Info: React.FC = () => {
  const { t } = useTranslation();

  return (<>
    <Header/>
    <Container>
      {/* Box component to center the content vertically and horizontally */}
      <Box 
        display="flex" 
        justifyContent="center" 
        flexDirection="column"
        minHeight="80vh"
        textAlign="center"
      >
        {/* Typography component to display the page title */}
        <Typography variant="h2">
          {t('info.infoPage')} {/* Translation key for the page title */}
        </Typography>
        <CurrentBreakpoint/>
      </Box>
    </Container>
  </>);
}

export default Info;
