// src/hooks/useTrainingStats.ts
import { useRef, useEffect, useCallback } from 'react';
import moment from 'moment';

export const useTrainingStats = (trainingId: string | null) => {
  const completedRef = useRef<boolean>(false);
  const startRef = useRef<string>(moment().toISOString());

  const logStats = useCallback(() => {
    if (!trainingId) return;
    const end = moment().toISOString();
    const duration = moment(end).diff(moment(startRef.current), 'seconds');

    console.log('[TRAINING STATS]', {
      training_id: trainingId,
      start: startRef.current,
      end,
      durationInSeconds: duration,
      completed: completedRef.current,
    });
  }, [trainingId]);

  useEffect(() => {
    return () => {
      logStats();
    };
  }, [logStats]);

  return {
    start: startRef.current,
    logStats,
    setCompleted: (val: boolean) => { completedRef.current = val },
  };
};
