import { useEffect, useState } from 'react';
import {
  getLastSelectedTimezone,
  saveLastSelectedTimezone,
} from '../database/database';
import { getDeviceTimezone } from '../services/timezoneService';
import { Timezone } from '../database/types';
interface UseSelectedTimezoneResult {
  selectedTimezone: Timezone;
  setSelectedTimezone: (timezone: Timezone) => void;
  loading: boolean;
}

export const useSelectedTimezone = (): UseSelectedTimezoneResult => {
  const [selectedTimezone, setSelectedTimezoneState] = useState<Timezone>(
    getDeviceTimezone(),
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLastSelected = async () => {
      try {
        const lastSelected = await getLastSelectedTimezone();
        if (lastSelected) {
          console.log(`Restored last selected timezone: ${lastSelected}`);
          setSelectedTimezoneState(lastSelected);
        } else {
          console.log(
            `No saved preference, using device timezone: ${selectedTimezone}`,
          );
        }
      } catch (error) {
        console.error('Error loading last selected timezone:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLastSelected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setSelectedTimezone = async (timezone: Timezone) => {
    setSelectedTimezoneState(timezone);
    try {
      await saveLastSelectedTimezone(timezone);
    } catch (error) {
      console.error('Error saving selected timezone:', error);
    }
  };

  return {
    selectedTimezone,
    setSelectedTimezone,
    loading,
  };
};
