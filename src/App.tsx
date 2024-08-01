import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from '@pages/Home';
import Info from '@pages/Info';
import { CGU } from '@pages/CGU';
import Training from '@pages/Training';
import Header from '@components/Header';
import { Footer } from '@components/Footer';

// Main application component
const App: React.FC = () => {
  return (
    <div>
      {/* Render the Header component */}
      <Header />

      {/* Define the application's routing structure */}
      <Routes>
        {/* Route for the home page */}
        <Route path="/" element={<Home />} />

        {/* Route for the info page */}
        <Route path="/info" element={<Info />} />

        {/* Route for the workout page */}
        <Route path="/workout" element={<Training />} />

        {/* Route for the cgu page */}
        <Route path="/cgu" element={<CGU />} />
      </Routes>
      
      {/* Render the Footer component */}
      <Footer />
    </div>
  );
}

export default App;
