import { neon } from '@neondatabase/serverless';
import * as fs from 'fs';
import * as path from 'path';

const sql = neon(process.env.DATABASE_URL!);

async function seed() {
  const raw = fs.readFileSync(path.join(__dirname, '../data/players.seed.json'), 'utf-8');
  const players = JSON.parse(raw);
  console.log(`Seeding ${players.length} players...`);

  let inserted = 0;
  for (const p of players) {
    try {
      await sql`
        INSERT INTO players (name, short_name, nationality_code, nationality_name, club, primary_position, eligible_slots, photo_url, birthdate)
        VALUES (${p.name}, ${p.short_name}, ${p.nationality_code}, ${p.nationality_name}, ${p.club}, ${p.primary_position}, ${p.eligible_slots}, ${p.photo_url}, ${p.birthdate})
        ON CONFLICT DO NOTHING
      `;
      inserted++;
    } catch (error: any) {
      console.error(`Error inserting ${p.name}:`, error.message);
    }
  }

  console.log(`Seed complete. Inserted ${inserted} players.`);
}

seed();
