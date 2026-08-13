// Simple migration runner: reads schema.sql and executes it against the
// configured database. Run with: node src/config/migrate.js
// This avoids manually pasting SQL into pgAdmin every time the schema changes.
const fs = require('fs');
const path = require('path');
const db = require('./db');

async function migrate() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  try {
    await db.query(schemaSql);
    console.log('Migration successful: users and analyses tables are ready.');
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exitCode = 1;
  } finally {
    await db.pool.end();
  }
}

migrate();
