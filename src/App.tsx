// src\App.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

import Home from '@pages/Home';
import Info from '@pages/Info';
import { CGU } from '@pages/CGU';
import Preview from '@pages/Preview';
import { Login } from '@pages/Login';
import Workouts from '@pages/Workouts';
import Training from '@pages/Training';
import Exercice from '@pages/Exercice';
import { Sandbox } from '@pages/Sandbox';
import Trainings from '@pages/Trainings';
import { Profile } from '@pages/Profile';
import Exercices from '@pages/Exercices';
import inversify from '@src/commons/inversify';
import Workout_edit from '@pages/Workout_edit';
import Training_edit from '@pages/Training_edit';
import Exercice_edit from '@pages/Exercices_edit';
import { contextStore } from '@stores/contextStore';
import Training_create from '@pages/Training_create';
import Exercice_create from '@pages/Exercice_create';
import { CODES, FlashMessage, Footer, Guard, NotFound } from '@happykiller/sunny-ui';

import '@happykiller/sunny-ui/dist/index.css';

// Main application component
const App: React.FC = () => {
  const { t } = useTranslation();
  const reset = contextStore((state: any) => state.reset);

  const checkSession = () =>
    inversify.sessionInfo.execute().then(response => ({
      success: response.message === CODES.SUCCESS,
      error: response.error,
    }));
  
  const onInvalidSession = () => {
    reset();
    inversify.loggerService.debug(t('errors.session_invalid'));
  };

  return (
    <div>
      {/* Define the application's routing structure */}
      <Routes>
        {/* Route for root */}
        <Route path="/" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Trainings /></Guard>} />

        {/* Route for the home page */}
        <Route path="/home" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Home /></Guard>} />

        {/* Route for the login page */}
        <Route path="/login" element={<Login />} />

        {/* Route for the profil page */}
        <Route path="/profile" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Profile /></Guard>} />

        {/* Route for the info page */}
        <Route path="/info" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Info /></Guard>} />

        {/* Route for the training page */}
        <Route path="/training" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Training /></Guard>} />

        {/* Route for the trainings page */}
        <Route path="/trainings" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Trainings /></Guard>} />

        {/* Route for the preview page */}
        <Route path="/preview" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Preview /></Guard>} />

        {/* Route for the training edit page */}
        <Route path="/training_edit" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Training_edit /></Guard>} />

        {/* Route for the training create page */}
        <Route path="/training_create" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Training_create /></Guard>} />

        {/* Route for the exercices page */}
        <Route path="/exercices" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Exercices /></Guard>} />

        {/* Route for the exercice page */}
        <Route path="/exercice" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Exercice /></Guard>} />

        {/* Route for the exercice page */}
        <Route path="/exercice_edit" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Exercice_edit /></Guard>} />

        {/* Route for the exercice page */}
        <Route path="/exercice_create" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Exercice_create /></Guard>} />

        {/* Route for the workouts page */}
        <Route path="/workouts" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Workouts /></Guard>} />

        {/* Route for the workout_edit page */}
        <Route path="/workouts_edit" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Workout_edit /></Guard>} />

        {/* Page for play with components */}
        <Route path="/sandbox" element={<Guard checkSession={checkSession} onInvalidSession={onInvalidSession}><Sandbox /></Guard>} />

        {/* Route for the cgu page */}
        <Route path="/cgu" element={<CGU />} />

        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Render the Footer component */}
      <Footer
        systemInfoUsecase={inversify.systemInfoUsecase}
        frontVersion={process.env.VERSION ?? '1.0.0'}
        issuesUrl="https://github.com/Happykiller/vergo_front/issues"
        projectUrl="https://github.com/users/Happykiller/projects/4/views/1"
        mailto="fabrice.rosito@gmail.com"
        brandName="Vergo"
      />
      <FlashMessage icons={{ close: <CloseIcon fontSize="small" /> }} />
    </div>
  );
}

export default App;
