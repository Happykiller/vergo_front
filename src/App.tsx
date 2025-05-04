// src\App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import { Done, Key, Visibility, VisibilityOff, Info as InfoIcon, HelpOutline, VpnKey, Add, Delete, Email, BugReport, Map, LightMode, DarkMode, Person, Lock, Language, Cloud } from '@mui/icons-material';

import Info from '@pages/Info';
import Preview from '@pages/Preview';
import Workouts from '@pages/Workouts';
import Training from '@pages/Training';
import Exercice from '@pages/Exercice';
import { Sandbox } from '@pages/Sandbox';
import Trainings from '@pages/Trainings';
import Exercices from '@pages/Exercices';
import inversify from '@src/commons/inversify';
import Workout_edit from '@pages/Workout_edit';
import Training_edit from '@pages/Training_edit';
import Exercice_edit from '@pages/Exercices_edit';
import { contextStore } from '@stores/contextStore';
import Training_create from '@pages/Training_create';
import Exercice_create from '@pages/Exercice_create';
import { LayoutProtectedExt } from '@src/components/layout/LayoutProtectedExt';

import '@happykiller/sunny-ui/dist/index.css';
import { CGU, FlashMessage, Footer, NotFound, Login, Profile } from '@happykiller/sunny-ui';

// Main application component
const App: React.FC = () => {
  const mode = contextStore((s) => s.themeMode);
  const toggleTheme = contextStore((s) => s.toggleTheme);

  return (
    <div>
      {/* Define the application's routing structure */}
      <Routes>
        {/* Route for root */}
        <Route path="/" element={<LayoutProtectedExt><Trainings /></LayoutProtectedExt>} />

        {/* Route for the login page */}
        <Route
          path="/login"
          element={
            <Login
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
            />
          }
        />

        {/* Route for the profil page */}
        <Route path="/profile" element={
          <LayoutProtectedExt>
            <Profile
              icons={{
                visibility: <Visibility fontSize="small" />,
                visibilityOff: <VisibilityOff fontSize="small" />,
                help: <HelpOutline fontSize="small" />,
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
        icons={{
          email: <Email fontSize="small" />,
          issues: <BugReport fontSize="small" />,
          roadmap: <Map fontSize="small" />,
          language: <Language fontSize="small" />,
          cloud: <Cloud fontSize="small" />
        }}
        onToggleTheme={toggleTheme}
        iconThemeToggle={mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
      />
      <FlashMessage icons={{ close: <CloseIcon fontSize="small" /> }} />
    </div>
  );
}

export default App;
