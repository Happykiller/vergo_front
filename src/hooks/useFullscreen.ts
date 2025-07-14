// src/hooks/useFullscreen.ts
import { useCallback } from 'react';
import { volatileStore } from '@stores/volatileStore';
import { contextStore } from '@stores/contextStore';

export const useFullscreen = () => {
  const context = contextStore();
  const volatileContext = volatileStore();

  const isFullscreen = volatileContext.fullscreen;

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {
      (document as any).mozCancelFullScreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
    volatileStore.setState({ ...context, fullscreen: false });
  }, [context]);

  const enterFullscreen = useCallback(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).mozRequestFullScreen) {
      (elem as any).mozRequestFullScreen();
    } else if ((elem as any).msRequestFullscreen) {
      (elem as any).msRequestFullscreen();
    }
    volatileStore.setState({ ...context, fullscreen: true });
  }, [context]);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, exitFullscreen, enterFullscreen]);

  return { isFullscreen, toggleFullscreen, enterFullscreen, exitFullscreen };
};
