import * as SQLite from "expo-sqlite";
import type { IconName } from "../types";

export type SavedList = {
  id: number;
  name: string;
};

export type SavedItem = {
  id: number;
  list_id: number;
  catalog_item_id: string;
  name: string;
  icon: IconName | null;
  checked: 0 | 1;
};

const dbPromise = SQLite.openDatabaseAsync("checklists-v2.db");

async function prepareListsTable(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `);
}

async function prepareItemsTable(db: SQLite.SQLiteDatabase): Promise<void> {
  await prepareListsTable(db);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL,
      catalog_item_id TEXT NOT NULL,
      name TEXT NOT NULL,
      icon TEXT,
      checked INTEGER NOT NULL DEFAULT 0,
      UNIQUE (list_id, catalog_item_id),
      FOREIGN KEY (list_id) REFERENCES lists(id) ON DELETE CASCADE
    );
  `);
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
  await prepareListsTable(db);
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
  await prepareListsTable(db);
  const result = await db.runAsync(
    `UPDATE lists SET name = ? WHERE id = ?`,
    newName.trim(),
    id,
  );
  return result.changes > 0;
}

export async function deleteList(id: number): Promise<boolean> {
  const db = await dbPromise;
  await prepareListsTable(db);
  const result = await db.runAsync(`DELETE FROM lists WHERE id = ?`, id);
  return result.changes > 0;
}

export async function toggleItem(
  listId: number,
  catalogItemId: string,
  itemName: string,
  icon?: IconName,
): Promise<"added" | "removed"> {
  const db = await dbPromise;
  await prepareItemsTable(db);

  const deleted = await db.runAsync(
    `DELETE FROM items
     WHERE list_id = ? AND catalog_item_id = ?`,
    listId,
    catalogItemId,
  );

  if (deleted.changes > 0) {
    return "removed";
  }

  await db.runAsync(
    `INSERT INTO items
      (list_id, catalog_item_id, name, icon)
     VALUES (?, ?, ?, ?)`,
    listId,
    catalogItemId,
    itemName,
    icon ?? null,
  );
  return "added";
}

export async function toggleItemChecked(itemId: number): Promise<boolean> {
  const db = await dbPromise;
  await prepareItemsTable(db);
  const result = await db.runAsync(
    `UPDATE items
     SET checked = CASE checked WHEN 0 THEN 1 ELSE 0 END
     WHERE id = ?`,
    itemId,
  );
  return result.changes > 0;
}
