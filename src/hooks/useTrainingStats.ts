// src/hooks/useTrainingStats.ts
import moment from 'moment';
import { useRef, useEffect, useCallback } from 'react';

import inversify from '@src/commons/inversify';

export const useTrainingStats = (trainingId: string | null) => {
  const completedRef = useRef<boolean>(false);
  const startRef = useRef<string>(moment().toISOString());

  const logStats = useCallback(async () => {
    if (!trainingId) return;

    const end = moment().toISOString();
    const duration = moment(end).diff(moment(startRef.current), 'seconds');

    const result = await inversify.saveTrainingStatUsecase.execute({
      training_id: trainingId,
      start: startRef.current,
      end,
      durationInSeconds: duration,
      completed: completedRef.current,
    });

    if (process.env.DEBUG === 'true') {
      console.log('[TRAINING STATS]', {
        training_id: trainingId,
        start: startRef.current,
        end,
        durationInSeconds: duration,
        completed: completedRef.current,
        result,
      });
    }
  }, [trainingId]);

  useEffect(() => {
    return () => {
      logStats();
    };
  }, [logStats]);

  return {
    start: startRef.current,
    logStats,
    setCompleted: (val: boolean) => {
      completedRef.current = val;
    },
  };
};
