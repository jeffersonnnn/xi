create table if not exists wallet_balances (
  wallet text primary key,
  weight numeric not null default 0,
  updated_at timestamptz not null default now()
);
