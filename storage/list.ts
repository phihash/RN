import * as SQLite from "expo-sqlite";

export type SavedList = {
  id: number;
  name: string;
};

const dbPromise = SQLite.openDatabaseAsync("checklists.db");

export async function getLists(): Promise<SavedList[]> {
  const db = await dbPromise;
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS lists  (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)`,
  );
  return db.getAllAsync<SavedList>("SELECT * FROM lists");
}
