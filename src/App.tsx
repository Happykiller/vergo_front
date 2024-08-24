import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '@pages/Home';
import Info from '@pages/Info';
import { CGU } from '@pages/CGU';
import Preview from '@pages/Preview';
import { Login } from '@pages/Login';
import Flash from '@components/Flash';
import Training from '@pages/Training';
import Trainings from '@pages/Trainings';
import { Profile } from '@pages/Profile';
import { Guard } from '@components/Guard';
import { Footer } from '@components/Footer';

// Main application component
const App: React.FC = () => {

  return (
    <div>
      {/* Define the application's routing structure */}
      <Routes>
        {/* Route for the home page */}
        <Route path="/" element={<Guard><Home /></Guard>} />

        {/* Route for the login page */}
        <Route path="/login" element={<Login />} />

        {/* Route for the profil page */}
        <Route path="/profile" element={<Guard><Profile /></Guard>} />

        {/* Route for the info page */}
        <Route path="/info" element={<Guard><Info /></Guard>} />

        {/* Route for the training page */}
        <Route path="/training" element={<Guard><Training /></Guard>} />

        {/* Route for the trainings page */}
        <Route path="/trainings" element={<Guard><Trainings /></Guard>} />

        {/* Route for the preview page */}
        <Route path="/preview" element={<Guard><Preview /></Guard>} />

        {/* Route for the cgu page */}
        <Route path="/cgu" element={<CGU />} />
      </Routes>
      
      {/* Render the Footer component */}
      <Footer />
      <Flash/>
    </div>
  );
}

export default App;
