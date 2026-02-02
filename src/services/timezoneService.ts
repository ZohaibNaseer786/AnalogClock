import { Timezone } from '../database/types';
import { http } from '../config/http';
import { LIST_TIME_ZONE } from '../config/EndPoint';

interface TimezoneDbZone {
  countryCode: string;
  countryName: string;
  zoneName: string;
  gmtOffset: any;
  timestamp: number;
}

interface TimezoneDbResponse {
  status: string;
  message?: string;
  zones?: TimezoneDbZone[];
}

export const fetchTimezones = async () => {
  try {
    console.log('request ======>');
    const response = await http.get<TimezoneDbResponse>(LIST_TIME_ZONE);
    console.log('response=====', response.data);

    return response.data;
  } catch (error: unknown) {
    console.log('time zones error', error);
    throw error;
  }
};

export const getDeviceTimezone = (): Timezone => {
  try {
    const localNow = new Date();
    const locale = Intl.DateTimeFormat().resolvedOptions();

    return {
      countryCode: locale.locale,
      countryName: locale.locale,
      zoneName: locale.timeZone,
      gmtOffset: localNow.getTimezoneOffset(),
      timestamp: localNow.getTime(),
    };
  } catch (error) {
    console.error('Error getting device timezone:', error);
    return {
      countryCode: '',
      countryName: '',
      zoneName: '',
      gmtOffset: 0,
      timestamp: new Date().getTime(),
    };
  }
};
