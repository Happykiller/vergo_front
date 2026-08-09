// src/hooks/useTrainingStats.ts
import inversify from '@src/commons/inversify';
import moment from 'moment';
import { useCallback,useEffect, useRef } from 'react';

const MIN_DURATION_SEC = 120;

/** Pure helper exported for tests */
export const shouldPersistTraining = (durationSec: number, completed: boolean): boolean => {
  // Persist if completed OR duration >= threshold
  return completed || durationSec >= MIN_DURATION_SEC;
};

export const useTrainingStats = (trainingId: string | null) => {
  const completedRef = useRef<boolean>(false);
  const startRef = useRef<string>(moment().toISOString());
  const sentRef = useRef<boolean>(false);

  const logStats = useCallback(async () => {
    if (!trainingId) return;
    if (sentRef.current) return;

    const end = moment().toISOString();
    const duration = moment(end).diff(moment(startRef.current), 'seconds');

    // Guard: skip noisy stats
    if (!shouldPersistTraining(duration, completedRef.current)) {
      if (process.env.DEBUG === 'true') {
        console.log('[TRAINING STATS][SKIP]', { trainingId, duration, completed: completedRef.current });
      }
      return;
    }

    sentRef.current = true;

    try {
      const result = await inversify.saveTrainingStatUsecase.execute({
        training_id: trainingId,
        start: startRef.current,
        end,
        durationInSeconds: duration,
        completed: completedRef.current,
      });

      if (process.env.DEBUG === 'true') {
        console.log('[TRAINING STATS][SENT]', {
          training_id: trainingId,
          start: startRef.current,
          end,
          durationInSeconds: duration,
          completed: completedRef.current,
          result,
        });
      }
    } catch (error) {
      sentRef.current = false;
      throw error;
    }
  }, [trainingId]);

  useEffect(() => {
    return () => {
      // Send (or skip) on unmount
      void logStats();
    };
  }, [logStats]);

  return {
    start: startRef.current,
    logStats,
    setCompleted: (val: boolean) => { completedRef.current = val; },
  };
};
