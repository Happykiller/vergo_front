// src\components\WakeLock.tsx
import HourglassDisabledIcon from '@mui/icons-material/HourglassDisabled';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

const WakeLockComponent = () => {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);

  const requestWakeLock = async () => {
    try {
      wakeLockRef.current = await navigator.wakeLock.request('screen');
      setIsWakeLockActive(true);
      
      wakeLockRef.current.addEventListener('release', () => {
        setIsWakeLockActive(false);
        console.log('Wake Lock has been released');
      });

      console.log('Wake Lock is active');
    } catch (err:any) {
      console.error(`Error requesting wake lock: ${err.name}, ${err.message}`);
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      await wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  };

  useEffect(() => {
    requestWakeLock();

    return () => {
      releaseWakeLock();
    };
  }, []);

  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center"
      }}>
      {isWakeLockActive ? <HourglassDisabledIcon/> : <HourglassEmptyIcon/>}
    </Box>
  );
};

export default WakeLockComponent;
