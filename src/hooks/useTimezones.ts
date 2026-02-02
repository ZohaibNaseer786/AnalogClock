import { useEffect, useState } from 'react';
import { Timezone } from '../database/types';
import { getTimezones, saveTimezones } from '../database/database';
import { fetchTimezones } from '../services/timezoneService';

interface UseTimezonesResult {
  timezones: Timezone[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useTimezones = (): UseTimezonesResult => {
  const [timezones, setTimezones] = useState<Timezone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTimezones = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading timezones...');

      let cachedTimezones: Timezone[] = [];
      try {
        cachedTimezones = await getTimezones();
      } catch (cacheError) {
        console.warn('Failed to load from cache:', cacheError);
      }

      if (cachedTimezones.length > 0) {
        console.log(`Loaded ${cachedTimezones.length} timezones from cache`);
        setTimezones(cachedTimezones);
        setLoading(false);
        return;
      }

      console.log('Cache is empty, fetching from API...');
      const fetchedTimezones = await fetchTimezones();

      if (
        fetchedTimezones.status === 'OK' &&
        fetchedTimezones.zones &&
        fetchedTimezones.zones.length > 0
      ) {
        try {
          await saveTimezones(fetchedTimezones.zones);
          console.log('Saved timezones to cache');
        } catch (saveError) {
          console.warn('Failed to save to cache:', saveError);
        }
        setTimezones(fetchedTimezones.zones);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load timezones';
      console.error('Error loading timezones:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTimezones();
  }, []);

  return {
    timezones,
    loading,
    error,
    refetch: loadTimezones,
  };
};
