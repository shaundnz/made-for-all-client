import { factory, primaryKey } from '@mswjs/data';
import { nanoid } from 'nanoid';

const models = {
  playlist: {
    spotifyPlaylistId: primaryKey(nanoid),
    madeForAllPlaylistId: () => nanoid(),
  },
};

export const db = factory(models);

export type Model = keyof typeof models;

export const loadDb = async () => {
  // If we are running in a browser environment
  return Object.assign(
    JSON.parse(window.localStorage.getItem('msw-db') || '{}'),
  );
};

export const storeDb = async (data: string) => {
  // If we are running in a browser environment
  window.localStorage.setItem('msw-db', data);
};

export const persistDb = async (model: Model) => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }
  const data = await loadDb();
  data[model] = db[model].getAll();
  await storeDb(JSON.stringify(data));
};

export const initializeDb = async () => {
  const database = await loadDb();
  Object.entries(db).forEach(([key, model]) => {
    const dataEntries = database[key];
    if (dataEntries) {
      dataEntries?.forEach((entry: Record<string, any>) => {
        model.create(entry);
      });
    }
  });
};

export const resetDb = () => {
  window.localStorage.clear();
};
