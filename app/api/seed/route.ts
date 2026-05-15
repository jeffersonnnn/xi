import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import * as fs from 'fs';
import * as path from 'path';

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed endpoint disabled in production' }, { status: 403 });
  }

  try {
    const seedPath = path.join(process.cwd(), 'data', 'players.seed.json');
    const raw = fs.readFileSync(seedPath, 'utf-8');
    const players = JSON.parse(raw);

    let inserted = 0;
    for (const p of players) {
      try {
        await sql`
          INSERT INTO players (name, short_name, nationality_code, nationality_name, club, primary_position, eligible_slots, photo_url, birthdate)
          VALUES (${p.name}, ${p.short_name}, ${p.nationality_code}, ${p.nationality_name}, ${p.club}, ${p.primary_position}, ${p.eligible_slots}, ${p.photo_url}, ${p.birthdate})
          ON CONFLICT DO NOTHING
        `;
        inserted++;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes('duplicate')) continue;
        console.error(`Insert error for ${p.name}:`, msg);
      }
    }

    return NextResponse.json({ success: true, inserted });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
