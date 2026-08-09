import { useLoaderStore } from '@stores/loader';
import { useCallback, useState } from 'react';

export const useAsyncTask = () => {
  const setLoading = useLoaderStore((s) => s.setLoading);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async <T>(task: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await task();
      return result;
    } catch (err: any) {
      const msg = err?.message ?? 'Unknown error';
      console.error('[AsyncTask] Error:', err);
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [setLoading]);

  return { execute, error };
};
