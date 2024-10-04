import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '@pages/Home';
import Info from '@pages/Info';
import { CGU } from '@pages/CGU';
import Preview from '@pages/Preview';
import { Login } from '@pages/Login';
import Flash from '@components/Flash';
import Training from '@pages/Training';
import Exercice from '@pages/Exercice';
import Trainings from '@pages/Trainings';
import { Profile } from '@pages/Profile';
import Exercices from '@pages/Exercices';
import { Guard } from '@components/Guard';
import { Footer } from '@components/Footer';
import Training_edit from '@pages/Training_edit';
import Exercice_edit from '@pages/Exercices_edit';
import Training_create from '@pages/Training_create';
import Exercice_create from '@pages/Exercice_create';

// Main application component
const App: React.FC = () => {

  return (
    <div>
      {/* Define the application's routing structure */}
      <Routes>
        {/* Route for root */}
        <Route path="/" element={<Guard><Trainings /></Guard>} />

        {/* Route for the home page */}
        <Route path="/home" element={<Guard><Home /></Guard>} />

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

        {/* Route for the training edit page */}
        <Route path="/training_edit" element={<Guard><Training_edit /></Guard>} />

        {/* Route for the training create page */}
        <Route path="/training_create" element={<Guard><Training_create /></Guard>} />

        {/* Route for the exercices page */}
        <Route path="/exercices" element={<Guard><Exercices /></Guard>} />

        {/* Route for the exercice page */}
        <Route path="/exercice" element={<Guard><Exercice /></Guard>} />

        {/* Route for the exercice page */}
        <Route path="/exercice_edit" element={<Guard><Exercice_edit /></Guard>} />

        {/* Route for the exercice page */}
        <Route path="/exercice_create" element={<Guard><Exercice_create /></Guard>} />

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
