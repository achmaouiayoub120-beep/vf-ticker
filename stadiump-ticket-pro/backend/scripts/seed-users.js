/**
 * Seed demo users with Argon2id hashes. Run: node scripts/seed-users.js
 * Requires: DATABASE_URL, and argon2 installed.
 */
const { Client } = require('pg');
const argon2 = require('argon2');

const users = [
  { nom: 'Admin', prenom: 'One', email: 'admin1@stadium.ma', password: 'DemoAdmin1!', role: 'admin' },
  { nom: 'Admin', prenom: 'Two', email: 'admin2@stadium.ma', password: 'DemoAdmin2!', role: 'admin' },
  { nom: 'User', prenom: 'Demo1', email: 'user1@stadium.ma', password: 'DemoUser1!', role: 'user' },
  { nom: 'User', prenom: 'Demo2', email: 'user2@stadium.ma', password: 'DemoUser2!', role: 'user' },
];

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL || 'postgresql://postgres:example@localhost:5432/tickets' });
  await client.connect();
  for (const u of users) {
    const hash = await argon2.hash(u.password, { type: argon2.argon2id });
    await client.query(
      `INSERT INTO users (nom, prenom, email, password, role, created_at)
       VALUES ($1, $2, $3, $4, $5, now())
       ON CONFLICT (email) DO UPDATE SET password = $4, role = $5`,
      [u.nom, u.prenom, u.email, hash, u.role]
    );
    console.log('Seeded', u.email);
  }
  await client.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
