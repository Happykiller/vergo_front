// src\components\Chrono.tsx
import { Box, Typography } from '@mui/material';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import React, { useState, useEffect, useRef } from 'react';
import NotStartedIcon from '@mui/icons-material/NotStarted';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';

import LargeIconButton from '@components/LargeIconButton';

// Définir les types des props
interface CountdownProps {
  duration: number;
  onComplete: () => void;
  volume?: number;
}

const Chrono: React.FC<CountdownProps> = ({ duration, onComplete, volume = 1 }) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const playSound = (frequency: number, duration: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        gainNode.gain.value = volume;
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        oscillator.start();
        
        setTimeout(() => {
          oscillator.stop();
          context.close();
          resolve();
        }, duration);
      } catch (error) {
        reject(error);
      }
    });
  };  

  const start = () => {
    clearInterval(intervalRef.current as NodeJS.Timeout);
    intervalRef.current = setInterval(() => {
      handleSecond();
    }, 1000);
  }

  const pause = () => {
    setIsPaused(true);
  }

  const resume = () => {
    setIsPaused(false);
  }

  const reset = () => {
    clearInterval(intervalRef.current as NodeJS.Timeout);
    setTimeLeft(duration);
    setIsPaused(true);
  }

  const nextTime = (prevTime: number) => {
    if (prevTime === 1) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      playSound(440, 1000); // Son à 440 Hz
      onComplete();
      return 0;
    }
    if (prevTime <= 4 && prevTime > 1) playSound(880, 500); // Sons restants
    return prevTime - 1;
  };

  const handleSecond = async () => {
    if (!isPaused) {
      const next = await nextTime(timeLeft);
      if (next > 0) {
        setTimeLeft(next);
      } else {
        clearInterval(intervalRef.current as NodeJS.Timeout);
      }
    }
  }

  useEffect(() => {
    start();
  });

  const handlePause = () => {
    if(isPaused) {
      resume();
    } else {
      pause();
    }
  };

  const handleReset = () => {
    reset();
  };

  const handleSkip = () => {
    clearInterval(intervalRef.current as NodeJS.Timeout);
    onComplete();
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={2}>
      <LargeIconButton
        onClick={handlePause}
      >
        {isPaused ? <NotStartedIcon/> : <PauseCircleIcon/>}
      </LargeIconButton>
      <Typography variant="h3" gutterBottom>
        {timeLeft}s
      </Typography>
      <LargeIconButton
        onClick={handleReset}
      >
        <RestartAltIcon/>
      </LargeIconButton>
      <LargeIconButton
        onClick={handleSkip}
      >
        <SkipNextIcon/>
      </LargeIconButton>
    </Box>
  );
};

export default Chrono;
