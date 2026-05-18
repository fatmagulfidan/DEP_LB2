const pool = require('./pool');

async function migrate() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      done BOOLEAN DEFAULT false
    )
  `);
  console.log('Migration done!');
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});