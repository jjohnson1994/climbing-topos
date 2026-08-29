import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { Crag } from '@climbingtopos/types';

const DB_NAME = 'climbingtopos-offline';
const DB_VERSION = 1;
const STORE_NAME = 'crags';

export interface OfflineCragRecord {
  slug: string;
  title: string;
  image: string;
  savedAt: number;
  approxBytes: number;
  crag: Crag;
}

interface OfflineDB extends DBSchema {
  crags: {
    key: string;
    value: OfflineCragRecord;
  };
}

let dbPromise: Promise<IDBPDatabase<OfflineDB>> | undefined;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<OfflineDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'slug' });
      },
    });
  }
  return dbPromise;
}

export async function putOfflineCrag(record: OfflineCragRecord) {
  const db = await getDb();
  await db.put(STORE_NAME, record);
}

export async function getOfflineCragRecord(slug: string) {
  const db = await getDb();
  return db.get(STORE_NAME, slug);
}

export async function deleteOfflineCragRecord(slug: string) {
  const db = await getDb();
  await db.delete(STORE_NAME, slug);
}

export async function listOfflineCragRecords() {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}
