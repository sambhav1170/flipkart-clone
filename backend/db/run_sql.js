const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function run() {
  try {
    const db = await open({
      filename: path.join(__dirname, 'database.sqlite'),
      driver: sqlite3.Database
    });
    
    console.log('Running schema.sql...');
    const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf-8');
    await db.exec(schemaSql);
    console.log('Schema applied successfully.');

    console.log('\nRunning seed.sql (inserting default data)...');
    const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
    await db.exec(seedSql);
    console.log('Database Seed applied successfully!');
    
    console.log('\nAll complete! You can safely run `npm run dev` now.');
    process.exit(0);
  } catch (err) {
    console.error('Error executing SQL against Database:', err);
    process.exit(1);
  }
}

run();
