// src/hooks/useFullscreen.ts
import { volatileStore } from '@stores/volatileStore';
import { useCallback, useEffect, useState } from 'react';

export const useFullscreen = () => {
  // Subscribe to store; assume it has a `fullscreen` boolean
  const isFullscreen = volatileStore((s) => s.fullscreen);
  const [supported, setSupported] = useState<boolean>(true);

  // Keep store in sync with the real DOM fullscreen state
  useEffect(() => {
    const handleChange = () => {
      const active = !!document.fullscreenElement;
      // Functional update to avoid overwriting other volatile keys
      volatileStore.setState((s: any) => ({ ...s, fullscreen: active }));
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        await (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        await (document as any).msExitFullscreen();
      } else {
        setSupported(false);
      }
    } finally {
      // Always reflect intention in store even if API fails
      volatileStore.setState((s: any) => ({ ...s, fullscreen: false }));
    }
  }, []);

  const enterFullscreen = useCallback(async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        await (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).mozRequestFullScreen) {
        await (elem as any).mozRequestFullScreen();
      } else if ((elem as any).msRequestFullscreen) {
        await (elem as any).msRequestFullscreen();
      } else {
        setSupported(false);
      }
    } finally {
      volatileStore.setState((s: any) => ({ ...s, fullscreen: true }));
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) return exitFullscreen();
    return enterFullscreen();
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  return { isFullscreen, toggleFullscreen, enterFullscreen, exitFullscreen, supported };
};
