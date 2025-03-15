import React, { createContext, useContext, useState, useEffect } from 'react';
import { SQLiteDatabase } from 'expo-sqlite';
import { initDatabase } from '@/database/schema';
import { MarkerData, ImageData } from '../types';

interface DatabaseContextType {
  addMarker: (latitude: number, longitude: number) => Promise<number>;
  deleteMarker: (id: number) => Promise<void>;
  getMarkers: () => Promise<MarkerData[]>;
  addImage: (markerId: number, uri: string) => Promise<void>;
  deleteImage: (id: number) => Promise<void>;
  getMarkerImages: (markerId: number) => Promise<ImageData[]>;
  isLoading: boolean;
  error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType>({} as DatabaseContextType);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<SQLiteDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        const database = await initDatabase();
        setDb(database);
      } catch (err) {
        setError(err as Error);
        console.error('Ошибка инициализации Базы данных:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDB();
  }, []);

  const addMarker = async (latitude: number, longitude: number): Promise<number> => {
    if (!db) throw new Error('База данных не инициализирована');
    try {
      const result = await db.runAsync(
        'INSERT INTO markers (latitude, longitude) VALUES (?, ?)',
        [latitude, longitude]
      );
      return result.lastInsertRowId as number;
    } catch (err) {
      throw new Error('Ошибка при добавлении маркера');
    }
  };

  const getMarkers = async (): Promise<MarkerData[]> => {
    if (!db) throw new Error('База данных не инициализирована');
    try {
      return await db.getAllAsync<MarkerData>('SELECT * FROM markers');
    } catch (err) {
      throw new Error('Ошибка при получении маркеров');
    }
  };

  const deleteMarker = async (id: number): Promise<void> => {
    if (!db) throw new Error('База данных не инициализирована');
    try {
      await db.runAsync('DELETE FROM markers WHERE id = ?', [id]);
    } catch (err) {
      throw new Error('Ошибка при удалении маркера');
    }
  };

  const addImage = async (markerId: number, uri: string): Promise<void> => {
    if (!db) throw new Error('База данных не инициализирована');
    try {
      await db.runAsync(
        'INSERT INTO marker_images (marker_id, uri) VALUES (?, ?)',
        [markerId, uri]
      );
    } catch (err) {
      throw new Error('Ошибка при добавлении фото');
    }
  };

  const getMarkerImages = async (markerId: number): Promise<ImageData[]> => {
    if (!db) throw new Error('База данных не инициализирована');
    try {
      return await db.getAllAsync<ImageData>(
        'SELECT * FROM marker_images WHERE marker_id = ?',
        [markerId]
      );
    } catch (err) {
      throw new Error('Ошибка при получении изображений');
    }
  };

  const deleteImage = async (id: number): Promise<void> => {
    if (!db) throw new Error('База данных не инициализирована');
    try {
      await db.runAsync('DELETE FROM marker_images WHERE id = ?', [id]);
    } catch (err) {
      throw new Error('Ошибка при удалении изображения');
    }
  };

  return (
    <DatabaseContext.Provider
      value={{
        addMarker,
        deleteMarker,
        getMarkers,
        addImage,
        deleteImage,
        getMarkerImages,
        isLoading,
        error,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase должен использоваться внутри DatabaseProvider');
  }
  return context;
};