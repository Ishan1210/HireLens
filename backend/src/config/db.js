// A connection pool (not a single client) so multiple requests can query
// the database concurrently without waiting on each other. The pg library
// manages a set of reusable connections under the hood.
const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.name,
  user: env.db.user,
  password: env.db.password,
});

pool.on('error', (err) => {
  // Fires if an idle client in the pool throws an unexpected error
  // (e.g. DB connection dropped). Log it instead of crashing the process.
  console.error('Unexpected PostgreSQL pool error:', err);
});

// Small helper so route/controller code can just do `db.query(sql, params)`
// instead of importing pg directly everywhere.
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
