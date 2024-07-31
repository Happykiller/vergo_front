import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Info from './pages/Info';

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
      </Routes>
    </div>
  );
}

export default App;
