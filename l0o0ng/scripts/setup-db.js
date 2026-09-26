// Creates the url_mappings table in the database at DATABASE_URL. Safe to run more than once.
const fs = require('fs');
const path = require('path');
const { neon } = require('@neondatabase/serverless');

require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set. Add your Neon connection string to l0o0ng/.env');
  }
  const sql = neon(process.env.DATABASE_URL);
  const schema = fs.readFileSync(path.join(__dirname, '..', 'schema.sql'), 'utf8');
  await sql.query(schema);
  const [{ count }] = await sql`SELECT count(*)::int AS count FROM url_mappings`;
  console.log(`url_mappings is ready (${count} rows).`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
