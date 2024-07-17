import { drop, factory, nullable, primaryKey } from '@mswjs/data';
import { Database } from '@mswjs/data/lib/db/Database';
import { nanoid } from 'nanoid';

const models = {
  playlist: {
    id: primaryKey(nanoid),
    spotifyPlaylist: {
      collaborative: Boolean,
      description: String,
      images: Array,
      primary_color: String,
      public: Boolean,
      type: String,
      external_urls: {
        spotify: String,
      },
      followers: {
        href: nullable(String),
        total: Number,
      },
      href: String,
      id: String,
      name: String,
      owner: {
        display_name: String,
        external_urls: {
          spotify: String,
        },
        href: String,
        id: String,
        type: String,
        uri: String,
      },
      snapshot_id: String,
      uri: String,
    },
    madeForAllPlaylist: {
      collaborative: Boolean,
      description: String,
      images: Array,
      primary_color: String,
      public: Boolean,
      type: String,
      external_urls: {
        spotify: String,
      },
      followers: {
        href: nullable(String),
        total: Number,
      },
      href: String,
      id: String,
      name: String,
      owner: {
        display_name: String,
        external_urls: {
          spotify: String,
        },
        href: String,
        id: String,
        type: String,
        uri: String,
      },
      snapshot_id: String,
      uri: String,
      createdAt: Date,
    },
  },
};

if (import.meta.env.TEST) {
  /**
   * https://github.com/mswjs/data/issues/275
   * https://github.com/mswjs/data/pull/276
   *  @ts-expect-error: Database instance is shared between tests, supposedly fixed, but issue persists on vite. Required to allow parallel test suites */
  Database.prototype.generateId = () => nanoid();
}

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
  drop(db);
  window.localStorage.clear();
};
