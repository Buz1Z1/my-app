import * as SQLite from 'expo-sqlite';
import { MarkerData, ImageData } from '../types';

export const dbOperations = {
  addMarker: async (db: SQLite.SQLiteDatabase, latitude: number, longitude: number): Promise<number> => {
    const result = await db.runAsync(
      'INSERT INTO markers (latitude, longitude) VALUES (?, ?)',
      [latitude, longitude]
    );
    return result.lastInsertRowId;
  },

  getMarkers: async (db: SQLite.SQLiteDatabase): Promise<MarkerData[]> => {
    return await db.getAllAsync('SELECT * FROM markers');
  },

  deleteMarker: async (db: SQLite.SQLiteDatabase, id: number) => {
    await db.runAsync('DELETE FROM markers WHERE id = ?', [id]);
  },

  addImage: async (db: SQLite.SQLiteDatabase, markerId: number, uri: string): Promise<number> => {
    const result = await db.runAsync(
      'INSERT INTO marker_images (marker_id, uri) VALUES (?, ?)',
      [markerId, uri]
    );
    return result.lastInsertRowId;
  },

  getMarkerImages: async (db: SQLite.SQLiteDatabase, markerId: number): Promise<ImageData[]> => {
    return await db.getAllAsync(
      'SELECT id, uri FROM marker_images WHERE marker_id = ?',
      [markerId]
    );
  },

  deleteImage: async (db: SQLite.SQLiteDatabase, id: number) => {
    await db.runAsync('DELETE FROM marker_images WHERE id = ?', [id]);
  },
};