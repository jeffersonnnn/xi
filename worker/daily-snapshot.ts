import { neon } from '@neondatabase/serverless';
import { getFullXI } from '../lib/aggregate';

const sql = neon(process.env.DATABASE_URL!);

export async function dailySnapshot() {
  console.log('[daily-snapshot] Starting...');

  const xi = await getFullXI();

  const snapshotXI: Record<string, any> = {};
  for (const [slot, data] of Object.entries(xi)) {
    if (data.winner) {
      snapshotXI[slot] = {
        player_id: data.winner.player_id,
        name: data.winner.name,
        photo_url: data.winner.photo_url,
        weight: data.winner.total_weight,
      };
    } else {
      snapshotXI[slot] = null;
    }
  }

  const today = new Date().toISOString().split('T')[0];

  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const prevRows = await sql`
    SELECT xi FROM daily_snapshots WHERE snapshot_date = ${yesterday} LIMIT 1
  `;
  const prevSnapshot = prevRows[0];

  let movers: any[] = [];
  if (prevSnapshot?.xi) {
    for (const [slot, current] of Object.entries(snapshotXI)) {
      const prev = (prevSnapshot.xi as any)[slot];
      if (!current && !prev) continue;
      if (!current && prev) {
        movers.push({ slot, from_player: prev.name, to_player: null, delta: 'vacated' });
      } else if (current && !prev) {
        movers.push({ slot, from_player: null, to_player: current.name, delta: 'new' });
      } else if (current && prev && current.player_id !== prev.player_id) {
        movers.push({
          slot,
          from_player: prev.name,
          to_player: current.name,
          delta: `${current.weight} vs ${prev.weight}`,
        });
      }
    }
  }

  await sql`
    INSERT INTO daily_snapshots (snapshot_date, xi, movers, created_at)
    VALUES (${today}, ${JSON.stringify(snapshotXI)}, ${movers.length > 0 ? JSON.stringify(movers) : null}, ${new Date().toISOString()})
    ON CONFLICT (snapshot_date)
    DO UPDATE SET xi = EXCLUDED.xi, movers = EXCLUDED.movers
  `;

  console.log(`[daily-snapshot] Done. ${movers.length} movers detected.`);
}
