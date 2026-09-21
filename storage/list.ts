import * as SQLite from "expo-sqlite";
import type { IconName } from "../types";

export type SavedList = {
  id: number;
  name: string;
};

export type SavedItem = {
  id: number;
  list_id: number;
  name: string;
  icon: IconName | null;
};

const dbPromise = SQLite.openDatabaseAsync("checklists.db");

async function prepareListsTable(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS lists (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)`,
  );
}

async function prepareItemsTable(db: SQLite.SQLiteDatabase): Promise<void> {
  await prepareListsTable(db);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      icon TEXT,
      FOREIGN KEY (list_id) REFERENCES lists(id)
    )
  `);

  const columns = await db.getAllAsync<{ name: string }>(
    "PRAGMA table_info(items)",
  );
  const hasLegacyListId = columns.some((column) => column.name === "listId");
  const hasListId = columns.some((column) => column.name === "list_id");
  const hasIcon = columns.some((column) => column.name === "icon");

  if (hasLegacyListId && !hasListId) {
    await db.execAsync("ALTER TABLE items RENAME COLUMN listId TO list_id");
  }

  if (!hasIcon) {
    await db.execAsync("ALTER TABLE items ADD COLUMN icon TEXT");
  }
}

export async function getLists(): Promise<SavedList[]> {
  const db = await dbPromise;
  await prepareListsTable(db);
  return db.getAllAsync<SavedList>("SELECT * FROM lists");
}

export async function getList(id: number): Promise<SavedList | null> {
  const db = await dbPromise;
  await prepareListsTable(db);
  return db.getFirstAsync<SavedList>("SELECT * FROM lists WHERE id = ?", id);
}

export async function getItems(listId: number): Promise<SavedItem[]> {
  const db = await dbPromise;
  await prepareItemsTable(db);
  return db.getAllAsync<SavedItem>(
    "SELECT * FROM items WHERE list_id = ?",
    listId,
  );
}

export async function createList(name: string): Promise<number> {
  const db = await dbPromise;
  const result = await db.runAsync(
    `INSERT INTO lists (name) VALUES (?)`,
    name.trim(),
  );
  return result.lastInsertRowId;
}

export async function updateListName(
  id: number,
  newName: string,
): Promise<boolean> {
  const db = await dbPromise;
  const result = await db.runAsync(
    `UPDATE lists SET name = ? WHERE id = ?`,
    newName.trim(),
    id,
  );
  return result.changes > 0;
}

export async function deleteList(id: number): Promise<boolean> {
  const db = await dbPromise;
  const result = await db.runAsync(`DELETE FROM lists WHERE id = ?`, id);
  return result.changes > 0;
}

export async function addItem(
  listId: number,
  itemName: string,
  icon?: IconName,
): Promise<boolean> {
  const db = await dbPromise;
  await prepareItemsTable(db);
  const result = await db.runAsync(
    `INSERT INTO items (list_id, name, icon) VALUES (?, ?, ?)`,
    listId,
    itemName,
    icon ?? null,
  );
  return result.changes > 0;
}
