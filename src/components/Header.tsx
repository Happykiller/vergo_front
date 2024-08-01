import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material'; // Import Material-UI components for app bar, toolbar, typography, and buttons
import { Link } from 'react-router-dom'; // Import `Link` component for navigation
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook for i18n support

const Header: React.FC = () => {
  const { t } = useTranslation(); // Initialize the translation function

  return (
    <AppBar position="static"> {/* AppBar component for the top navigation bar */}
      <Toolbar> {/* Toolbar component to align items within the AppBar */}
        {/* Typography component for displaying the title */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {t('header.title')} {/* Title text from translation */}
        </Typography>
        {/* Button components for navigation links */}
        <Button color="inherit" component={Link} to="/">{t('header.home')}</Button> {/* Link to the home page */}
        <Button color="inherit" component={Link} to="/info">{t('header.info')}</Button> {/* Link to the info page */}
        <Button color="inherit" component={Link} to="/workout">{t('header.workout')}</Button> {/* Link to the workout page */}
      </Toolbar>
    </AppBar>
  );
}

export default Header;
