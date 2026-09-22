import * as SQLite from "expo-sqlite";
import type { IconName } from "../types";

export type SavedList = {
  id: number;
  name: string;
};

export type SavedListItem = {
  id: number;
  list_id: number;
  item_key: string;
  name: string;
  icon: IconName | null;
  checked: 0 | 1;
  is_custom: 0 | 1;
};

const dbPromise = SQLite.openDatabaseAsync("checklists-v3.db");

async function prepareListsTable(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS lists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    );
  `);
}

async function prepareListItemsTable(
  db: SQLite.SQLiteDatabase,
): Promise<void> {
  await prepareListsTable(db);
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS list_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      list_id INTEGER NOT NULL,
      item_key TEXT NOT NULL,
      name TEXT NOT NULL,
      icon TEXT,
      checked INTEGER NOT NULL DEFAULT 0,
      is_custom INTEGER NOT NULL DEFAULT 0,
      UNIQUE (list_id, item_key),
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

export async function getListItems(listId: number): Promise<SavedListItem[]> {
  const db = await dbPromise;
  await prepareListItemsTable(db);
  return db.getAllAsync<SavedListItem>(
    "SELECT * FROM list_items WHERE list_id = ?",
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

export async function toggleListItem(
  listId: number,
  itemKey: string,
  itemName: string,
  icon?: IconName,
): Promise<"added" | "removed"> {
  const db = await dbPromise;
  await prepareListItemsTable(db);

  const deleted = await db.runAsync(
    `DELETE FROM list_items
     WHERE list_id = ? AND item_key = ?`,
    listId,
    itemKey,
  );

  if (deleted.changes > 0) {
    return "removed";
  }

  await db.runAsync(
    `INSERT INTO list_items
      (list_id, item_key, name, icon, is_custom)
     VALUES (?, ?, ?, ?, 0)`,
    listId,
    itemKey,
    itemName,
    icon ?? null,
  );
  return "added";
}

export async function toggleListItemChecked(itemId: number): Promise<boolean> {
  const db = await dbPromise;
  await prepareListItemsTable(db);
  const result = await db.runAsync(
    `UPDATE list_items
     SET checked = CASE checked WHEN 0 THEN 1 ELSE 0 END
     WHERE id = ?`,
    itemId,
  );
  return result.changes > 0;
}
