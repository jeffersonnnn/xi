export const SLOTS = ['GK','LB','CB_L','CB_R','RB','CM_L','CM_C','CM_R','LW','ST','RW'] as const;
export type SlotCode = typeof SLOTS[number];

export const SLOT_LABELS: Record<SlotCode, string> = {
  GK: 'Goalkeeper',
  LB: 'Left Back',
  CB_L: 'Left Centre Back',
  CB_R: 'Right Centre Back',
  RB: 'Right Back',
  CM_L: 'Left Midfielder',
  CM_C: 'Central Midfielder',
  CM_R: 'Right Midfielder',
  LW: 'Left Winger',
  ST: 'Striker',
  RW: 'Right Winger',
};

export const SLOT_ELIGIBLE_POSITIONS: Record<SlotCode, string[]> = {
  GK: ['GK'],
  LB: ['DEF'],
  CB_L: ['DEF'],
  CB_R: ['DEF'],
  RB: ['DEF'],
  CM_L: ['MID'],
  CM_C: ['MID'],
  CM_R: ['MID'],
  LW: ['FWD', 'MID'],
  ST: ['FWD'],
  RW: ['FWD', 'MID'],
};

export const PITCH_POSITIONS: Record<SlotCode, { x: number; y: number }> = {
  GK:   { x: 50, y: 90 },
  LB:   { x: 15, y: 72 },
  CB_L: { x: 35, y: 75 },
  CB_R: { x: 65, y: 75 },
  RB:   { x: 85, y: 72 },
  CM_L: { x: 25, y: 50 },
  CM_C: { x: 50, y: 55 },
  CM_R: { x: 75, y: 50 },
  LW:   { x: 15, y: 25 },
  ST:   { x: 50, y: 20 },
  RW:   { x: 85, y: 25 },
};

export const KICKOFF_DATE = new Date('2026-06-11T00:00:00Z');
