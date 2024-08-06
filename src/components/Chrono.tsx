import { Trans } from 'react-i18next';
import { Button, Box, Typography } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';

// Définir les types des props
interface CountdownProps {
  duration: number;
  onComplete: () => void;
}

const Chrono: React.FC<CountdownProps> = ({ duration, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour jouer un son
  const playSound = (frequency: number, duration: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
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

  const nextTime = async (prevTime: number) => {
    if (prevTime === 1) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      // Jouer la sonnerie à la fin
      await playSound(440, 1000); // 440 Hz pendant 1 seconde
      onComplete();
      return 0;
    }
    if (prevTime === 4) await playSound(880, 500); // 3s restant (880 Hz pendant 0.5 seconde)
    if (prevTime === 3) await playSound(880, 500); // 2s restant (880 Hz pendant 0.5 seconde)
    if (prevTime === 2) await playSound(880, 500); // 1s restant (880 Hz pendant 0.5 seconde)
    if (prevTime < 0) clearInterval(intervalRef.current as NodeJS.Timeout);
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

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h3" gutterBottom>
        {timeLeft}s
      </Typography>
      <Box display="flex" gap={2}>
        <Button variant="contained" color="primary" onClick={handlePause}>
          {isPaused ? <Trans>chrono.resume</Trans> : <Trans>chrono.pause</Trans>}
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleReset}>
          <Trans>chrono.reset</Trans>
        </Button>
      </Box>
    </Box>
  );
};

export default Chrono;
