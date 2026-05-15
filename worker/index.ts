import cron from 'node-cron';
import { refreshWeights } from './refresh-weights';
import { dailySnapshot } from './daily-snapshot';

const WEIGHT_CRON = process.env.WEIGHT_REFRESH_CRON || '*/10 * * * *';
const SNAPSHOT_CRON = process.env.DAILY_SNAPSHOT_CRON || '0 12 * * *';

console.log(`[worker] Starting XI worker process`);
console.log(`[worker] Weight refresh schedule: ${WEIGHT_CRON}`);
console.log(`[worker] Daily snapshot schedule: ${SNAPSHOT_CRON}`);

cron.schedule(WEIGHT_CRON, async () => {
  try {
    await refreshWeights();
  } catch (error) {
    console.error('[worker] refresh-weights job failed:', error);
  }
});

cron.schedule(SNAPSHOT_CRON, async () => {
  try {
    await dailySnapshot();
  } catch (error) {
    console.error('[worker] daily-snapshot job failed:', error);
  }
});

console.log('[worker] Cron jobs registered. Waiting for scheduled runs...');

// Keep the process alive
process.on('SIGTERM', () => {
  console.log('[worker] Received SIGTERM, shutting down...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('[worker] Received SIGINT, shutting down...');
  process.exit(0);
});
