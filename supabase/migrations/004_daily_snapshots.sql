create table if not exists daily_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_date date not null unique,
  xi jsonb not null,
  movers jsonb,
  created_at timestamptz not null default now()
);
