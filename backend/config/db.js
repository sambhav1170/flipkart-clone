const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let dbPromise;

async function getDb() {
  if (!dbPromise) {
    let dbPath = path.join(__dirname, '../db/database.sqlite');
    
    // VERCEL HOTFIX: Vercel functions are strictly read-only! 
    // We physically copy the DB to the /tmp folder at runtime so users can write to it temporarily!
    if (process.env.VERCEL) {
      const fs = require('fs');
      const tmpPath = '/tmp/database.sqlite';
      if (!fs.existsSync(tmpPath)) {
        fs.copyFileSync(dbPath, tmpPath);
      }
      dbPath = tmpPath;
    }

    dbPromise = open({
      filename: dbPath,
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
