import SQLite from 'react-native-sqlite-storage';
import { DB_CONFIG, TABLES, Timezone } from './types';

SQLite.enablePromise(true);

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  try {
    if (db) {
      return db;
    }

    db = await SQLite.openDatabase(DB_CONFIG);

    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS ${TABLES.TIMEZONES} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        countryName TEXT NOT NULL,
        zoneName TEXT NOT NULL,
        gmtOffset INTEGER NOT NULL,
        timestamp INTEGER NOT NULL
      )`,
    );

    await db.executeSql(
      `CREATE TABLE IF NOT EXISTS ${TABLES.PREFERENCES} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        countryCode TEXT NOT NULL,
        countryName TEXT NOT NULL,
        zoneName TEXT NOT NULL,
        gmtOffset INTEGER NOT NULL,
        timestamp INTEGER NOT NULL
      )`,
    );
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!db) {
    return initDatabase();
  }
  return db;
};

export const saveTimezones = async (timezones: Timezone[]): Promise<void> => {
  try {
    const database = await getDatabase();
    const timezonesToSave = timezones.slice(0, 500);

    await database.transaction(tx => {
      tx.executeSql(`DELETE FROM ${TABLES.TIMEZONES}`);

      const batchSize = 50;
      for (let i = 0; i < timezonesToSave.length; i += batchSize) {
        const batch = timezonesToSave.slice(i, i + batchSize);
        const placeholders = batch.map(() => '(?, ?, ?, ?)').join(', ');
        const values = batch.flatMap(tz => [
          tz.countryName,
          tz.zoneName,
          tz.gmtOffset,
          tz.timestamp,
        ]);

        tx.executeSql(
          `INSERT INTO ${TABLES.TIMEZONES} (countryName, zoneName, gmtOffset, timestamp) VALUES ${placeholders}`,
          values,
        );
      }
    });

    console.log(`Saved ${timezonesToSave.length} timezones to database`);
  } catch (error) {
    console.error('Error saving timezones:', error);
    console.warn('Continuing without database cache...');
  }
};

export const getTimezones = async (): Promise<Timezone[]> => {
  try {
    const database = await getDatabase();
    const [results] = await database.executeSql(
      `SELECT * FROM ${TABLES.TIMEZONES} ORDER BY countryName ASC`,
    );

    const timezones: Timezone[] = [];
    for (let i = 0; i < results.rows.length; i++) {
      timezones.push({
        countryCode: results.rows.item(i).countryCode,
        countryName: results.rows.item(i).countryName,
        zoneName: results.rows.item(i).zoneName,
        gmtOffset: results.rows.item(i).gmtOffset,
        timestamp: results.rows.item(i).timestamp,
      });
    }

    console.log(`Retrieved ${timezones.length} timezones from database`);
    return timezones;
  } catch (error) {
    console.error('Error getting timezones:', error);
    throw error;
  }
};

export const saveLastSelectedTimezone = async (
  timezone: Timezone,
): Promise<void> => {
  try {
    const database = await getDatabase();
    const placeholders = '?, ?, ?, ?';
    const values = [
      timezone.countryName,
      timezone.zoneName,
      timezone.gmtOffset,
      timezone.timestamp,
    ];
    await database.executeSql(
      `INSERT OR REPLACE INTO timezones (countryName, zoneName, gmtOffset, timestamp) VALUES (${placeholders})`,
      values,
    );
    console.log(`Saved last selected timezone: ${timezone}`);
  } catch (error) {
    console.error('Error saving last selected timezone:', error);
    throw error;
  }
};

export const getLastSelectedTimezone = async (): Promise<Timezone | null> => {
  try {
    const database = await getDatabase();
    const [results] = await database.executeSql(
      `SELECT * FROM ${TABLES.PREFERENCES} `,
    );

    if (results.rows.length > 0) {
      const timezone = results.rows.item(0).value;
      console.log(`Retrieved last selected timezone: ${timezone}`);
      return timezone as Timezone;
    }

    return null;
  } catch (error) {
    console.error('Error getting last selected timezone:', error);
    return null;
  }
};

export const clearTimezones = async (): Promise<void> => {
  try {
    const database = await getDatabase();
    await database.executeSql(`DELETE FROM ${TABLES.TIMEZONES}`);
    console.log('Cleared all timezones from database');
  } catch (error) {
    console.error('Error clearing timezones:', error);
    throw error;
  }
};

export const closeDatabase = async (): Promise<void> => {
  if (db) {
    await db.close();
    db = null;
    console.log('Database connection closed');
  }
};
