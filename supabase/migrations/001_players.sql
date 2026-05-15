create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  short_name text,
  nationality_code text not null,
  nationality_name text not null,
  club text,
  primary_position text not null,
  eligible_slots text[] not null,
  photo_url text,
  birthdate date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_players_position on players (primary_position);
create index if not exists idx_players_nationality on players (nationality_code);
