const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbPromise;

async function getDb() {
  if (!dbPromise) {
    dbPromise = open({
      filename: path.join(__dirname, '../db/database.sqlite'),
      driver: sqlite3.Database
    });
  }
  return dbPromise;
}

module.exports = {
  query: async (text, params = []) => {
    const db = await getDb();
    
    let sqliteText = text.trim();
    if (sqliteText.toUpperCase() === 'BEGIN') {
      sqliteText = 'BEGIN TRANSACTION';
    }

    // Convert PG positional parameters ($1, $2) to SQLite (?)
    sqliteText = sqliteText.replace(/\$\d+/g, '?');

    const isSelect = sqliteText.trim().toUpperCase().startsWith('SELECT');
    const hasReturning = sqliteText.toUpperCase().includes('RETURNING ');

    if (isSelect || hasReturning) {
      const rows = await db.all(sqliteText, params);
      return { rows };
    } else {
      const result = await db.run(sqliteText, params);
      return { rows: [], rowCount: result.changes, lastID: result.lastID };
    }
  }
};
