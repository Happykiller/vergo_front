import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Info: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container>
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="80vh"
        textAlign="center"
      >
        <Typography variant="h2">
          {t('info.infoPage')}
        </Typography>
      </Box>
    </Container>
  );
}

export default Info;
