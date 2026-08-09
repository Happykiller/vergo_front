// src\App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Done, Key, Visibility, VisibilityOff, Info as InfoIcon, HelpOutlineOutlined, VpnKey, Add, Delete, Person, Lock, Close as CloseIcon } from '@mui/icons-material';

import Info from '@pages/Info';
import Medals from '@pages/Medals';
import Preview from '@pages/Preview';
import Workouts from '@pages/Workouts';
import Training from '@pages/Training';
import Exercice from '@pages/Exercice';
import { Sandbox } from '@pages/Sandbox';
import Trainings from '@pages/Trainings';
import Exercices from '@pages/Exercices';
import Dashboard from '@pages/Dashboard';
import inversify from '@src/commons/inversify';
import Workout_edit from '@pages/Workout_edit';
import Training_edit from '@pages/Training_edit';
import Exercice_edit from '@pages/Exercices_edit';
import { contextStore } from '@stores/contextStore';
import Training_create from '@pages/Training_create';
import Exercice_create from '@pages/Exercice_create';
import LoaderOverlay from '@components/layout/LoaderOverlay';
import { LayoutPublicExt } from '@components/layout/LayoutPublicExt';
import { LayoutProtectedExt } from '@components/layout/LayoutProtectedExt';
import { CGU, FlashMessage, NotFound, Login, Profile } from '@happykiller/sunny-ui';

// Main application component
const App: React.FC = () => {

  return (
    <div>
      <LoaderOverlay />
      {/* Define the application's routing structure */}
      <Routes>
        <Route path="*" element={<LayoutPublicExt><NotFound /></LayoutPublicExt>} />

        {/* Route for the cgu page */}
        <Route path="/cgu" element={<LayoutPublicExt><CGU /></LayoutPublicExt>} />

        {/* Route for the login page */}
        <Route
          path="/login"
          element={
            <LayoutPublicExt><Login
              icons={{
                visibility: <Visibility fontSize="small" />,
                visibilityOff: <VisibilityOff fontSize="small" />,
                help: <InfoIcon fontSize="small" />,
                done: <Done />,
                key: <Key />,
                person: <Person fontSize="small" />,
                lock: <Lock fontSize="small" />
              }}
              services={{
                authUsecase: inversify.authUsecase,
                authPasskeyUsecase: inversify.authPasskeyUsecase,
                loggerService: inversify.loggerService,
              }}
              contextStore={contextStore}
            /></LayoutPublicExt>
          }
        />

        {/* Route for the profil page */}
        <Route path="/profile" element={
          <LayoutProtectedExt>
            <Profile
              icons={{
                visibility: <Visibility fontSize="small" />,
                visibilityOff: <VisibilityOff fontSize="small" />,
                help: <HelpOutlineOutlined fontSize="small" />,
                done: <Done />,
                key: <VpnKey />,
                add: <Add />,
                delete: <Delete />,
              }}
              services={{
                createPasskeyUsecase: inversify.createPasskeyUsecase,
                deletePasskeyUsecase: inversify.deletePasskeyUsecase,
                getPasskeyForUserUsecase: inversify.getPasskeyForUserUsecase,
                updPasswordUsecase: inversify.updPasswordUsecase,
                loggerService: inversify.loggerService,
              }}
              contextStore={contextStore}
            />
          </LayoutProtectedExt>
        } />

        {/* Route for root */}
        <Route path="/" element={<LayoutProtectedExt><Dashboard /></LayoutProtectedExt>} />

        {/* Route for the info page */}
        <Route path="/info" element={<LayoutProtectedExt><Info /></LayoutProtectedExt>} />

        {/* Route for the training page */}
        <Route path="/training" element={<LayoutProtectedExt><Training /></LayoutProtectedExt>} />

        {/* Route for the trainings page */}
        <Route path="/trainings" element={<LayoutProtectedExt><Trainings /></LayoutProtectedExt>} />

        {/* Route for the preview page */}
        <Route path="/preview" element={<LayoutProtectedExt><Preview /></LayoutProtectedExt>} />

        {/* Route for the training edit page */}
        <Route path="/training_edit" element={<LayoutProtectedExt><Training_edit /></LayoutProtectedExt>} />

        {/* Route for the training create page */}
        <Route path="/training_create" element={<LayoutProtectedExt><Training_create /></LayoutProtectedExt>} />

        {/* Route for the exercices page */}
        <Route path="/exercices" element={<LayoutProtectedExt><Exercices /></LayoutProtectedExt>} />

        {/* Route for the exercice page */}
        <Route path="/exercice" element={<LayoutProtectedExt><Exercice /></LayoutProtectedExt>} />

        {/* Route for the exercice page */}
        <Route path="/exercice_edit" element={<LayoutProtectedExt><Exercice_edit /></LayoutProtectedExt>} />

        {/* Route for the exercice page */}
        <Route path="/exercice_create" element={<LayoutProtectedExt><Exercice_create /></LayoutProtectedExt>} />

        {/* Route for the workouts page */}
        <Route path="/workouts" element={<LayoutProtectedExt><Workouts /></LayoutProtectedExt>} />

        {/* Route for the workout_edit page */}
        <Route path="/workouts_edit" element={<LayoutProtectedExt><Workout_edit /></LayoutProtectedExt>} />

        {/* Page for play with components */}
        <Route path="/sandbox" element={<LayoutProtectedExt><Sandbox /></LayoutProtectedExt>} />

        {/* Page for play with components */}
        <Route path="/dashboard" element={<LayoutProtectedExt><Dashboard /></LayoutProtectedExt>} />

        {/* Page display Medals */}
        <Route path="/medals" element={<LayoutProtectedExt><Medals /></LayoutProtectedExt>} />
      </Routes>
      <FlashMessage icons={{ close: <CloseIcon fontSize="small" /> }} />
    </div>
  );
}

export default App;
