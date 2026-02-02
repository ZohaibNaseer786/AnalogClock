export interface Timezone {
  countryCode: string;
  countryName: string;
  zoneName: string;
  gmtOffset: any;
  timestamp: number;
}

export const DB_CONFIG = {
  name: 'WorldClockApp.db',
  location: 'default',
};

export const TABLES = {
  TIMEZONES: 'timezones',
  PREFERENCES: 'preferences',
} as const;
