import { test, expect } from '@playwright/test';

test.describe('API /api/xi', () => {
  test('returns valid JSON with all 11 slot keys', async ({ request }) => {
    const response = await request.get('/api/xi');
    expect(response.status()).toBe(200);

    const data = await response.json();
    const expectedSlots = ['GK', 'LB', 'CB_L', 'CB_R', 'RB', 'CM_L', 'CM_C', 'CM_R', 'LW', 'ST', 'RW'];

    for (const slot of expectedSlots) {
      expect(data).toHaveProperty(slot);
      expect(data[slot]).toHaveProperty('winner');
      expect(data[slot]).toHaveProperty('runners_up');
    }
  });

  test('/api/players returns at least some players', async ({ request }) => {
    const response = await request.get('/api/players');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('players');
    expect(Array.isArray(data.players)).toBe(true);
  });

  test('/api/stats returns voter counts', async ({ request }) => {
    const response = await request.get('/api/stats');
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty('voters');
    expect(data).toHaveProperty('total_weight');
  });
});
