create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  wallet text not null,
  slot text not null,
  player_id uuid not null references players(id),
  weight_at_vote numeric not null,
  signature text not null,
  message text not null,
  voted_at timestamptz not null default now(),
  unique (wallet, slot)
);

create index if not exists idx_votes_slot on votes (slot);
create index if not exists idx_votes_player on votes (player_id);
create index if not exists idx_votes_wallet on votes (wallet);
