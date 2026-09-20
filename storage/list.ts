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

export async function createList(name: string): Promise<number> {
  const db = await dbPromise;
  const result = await db.runAsync(
    `INSERT INTO lists (name) VALUES (?)`,
    name.trim(),
  );
  return result.lastInsertRowId;
}

export async function deleteList(id: number): Promise<boolean> {
  const db = await dbPromise;
  const result = await db.runAsync(`DELETE FROM lists WHERE id = ?`, id);
  return result.changes > 0;
}

export async function addItem(listId: number, addItem: string): Promise<void> {
  const db = await dbPromise;
  await db.runAsync(
    `INSERT INTO items (list_id, name) VALUES (?, ?)`,
    listId,
    addItem,
  );
}
