-- XI Database Schema for Neon Postgres
-- Run this in the Neon SQL Editor after creating your project.

CREATE TABLE players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  nationality_code TEXT NOT NULL,
  nationality_name TEXT,
  club TEXT,
  primary_position TEXT NOT NULL,
  eligible_slots TEXT[] NOT NULL,
  photo_url TEXT,
  birthdate DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE votes (
  wallet TEXT NOT NULL,
  slot TEXT NOT NULL,
  player_id UUID NOT NULL REFERENCES players(id),
  weight_at_vote TEXT NOT NULL DEFAULT '0',
  signature TEXT NOT NULL,
  message TEXT NOT NULL,
  voted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (wallet, slot)
);

CREATE TABLE wallet_balances (
  wallet TEXT PRIMARY KEY,
  weight TEXT NOT NULL DEFAULT '0',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE daily_snapshots (
  snapshot_date DATE PRIMARY KEY,
  xi JSONB,
  movers JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_votes_slot ON votes(slot);
CREATE INDEX idx_votes_wallet ON votes(wallet);
CREATE INDEX idx_wallet_balances_weight ON wallet_balances(weight);
CREATE INDEX idx_players_active ON players(active);
