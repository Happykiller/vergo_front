// src\pages\Info.tsx
import CurrentBreakpoint from '@components/CurrentBreakpoint';
import { Box,Container, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

const Info: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Container>
        {/* Box component to center the content vertically and horizontally */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            minHeight: "80vh",
            textAlign: "center"
          }}>
          {/* Typography component to display the page title */}
          <Typography variant="h2">
            {t('info.infoPage')} {/* Translation key for the page title */}
          </Typography>
          <CurrentBreakpoint/>
        </Box>
      </Container>
    </>
  );
}

export default Info;
