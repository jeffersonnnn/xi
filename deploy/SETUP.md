# VPS Deployment Runbook

Step-by-step guide for deploying $XI on Ubuntu 22.04.

## 1. Provision VPS

Any Ubuntu 22.04 VPS with 1-2GB RAM (Hetzner CX22, Vultr, DigitalOcean).

```bash
# Create non-root sudo user
adduser deploy
usermod -aG sudo deploy

# Firewall
ufw allow 22
ufw allow 80
ufw allow 443
ufw enable
```

## 2. Install Dependencies

```bash
# Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# nginx + certbot
sudo apt-get install -y nginx certbot python3-certbot-nginx git

# PM2
sudo npm install -g pm2

# tsx (for worker)
sudo npm install -g tsx
```

## 3. Clone and Build

```bash
sudo mkdir -p /app && sudo chown deploy:deploy /app
cd /app
git clone YOUR_REPO_URL .
npm ci

# Create env file
cat > /app/.env << 'EOF'
NEXT_PUBLIC_XI_TOKEN_MINT=YOUR_MINT_ADDRESS
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
HELIUS_API_KEY=YOUR_HELIUS_KEY
SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
MIN_VOTE_BALANCE=1
ALLOW_TEST_VOTES=false
PORT=3000
WEIGHT_REFRESH_CRON=*/10 * * * *
DAILY_SNAPSHOT_CRON=0 12 * * *
EOF

npm run build
```

## 4. Database

Run the migrations against your Supabase instance (or local Postgres).

### Supabase (recommended)

Run each migration file in the Supabase SQL Editor:
- `supabase/migrations/001_players.sql`
- `supabase/migrations/002_votes.sql`
- `supabase/migrations/003_wallet_balances.sql`
- `supabase/migrations/004_daily_snapshots.sql`

### Local Postgres

```bash
sudo apt-get install -y postgresql
sudo -u postgres psql -c "CREATE DATABASE xi;"
sudo -u postgres psql -c "CREATE USER xi WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE xi TO xi;"

for f in supabase/migrations/*.sql; do
  sudo -u postgres psql -d xi -f "$f"
done
```

### Seed players

```bash
cd /app
npm run seed
```

## 5. PM2 Setup

```bash
cd /app
pm2 start deploy/ecosystem.config.js
pm2 save
pm2 startup
# Run the command that pm2 startup prints
```

Verify:
```bash
pm2 list
pm2 logs web --lines 20
pm2 logs worker --lines 20
```

## 6. nginx + TLS

```bash
# Copy nginx config
sudo cp deploy/nginx.conf /etc/nginx/sites-available/xi
sudo ln -sf /etc/nginx/sites-available/xi /etc/nginx/sites-enabled/xi
sudo rm -f /etc/nginx/sites-enabled/default

# Edit the config to replace YOUR_DOMAIN with your actual domain
sudo nano /etc/nginx/sites-available/xi

# Test and reload (will fail until certbot runs, that's fine)
sudo nginx -t

# Get TLS cert
sudo certbot --nginx -d YOUR_DOMAIN

# Verify auto-renewal
sudo certbot renew --dry-run
sudo systemctl status certbot.timer
```

## 7. Verify

Run through the production verification checklist (spec section 19):

```bash
# Check site responds
curl -I https://YOUR_DOMAIN

# Check API
curl https://YOUR_DOMAIN/api/players | jq '.players | length'
curl https://YOUR_DOMAIN/api/xi | jq 'keys'

# Check PM2
pm2 list

# Test worker jobs manually
cd /app
npm run job:refresh-weights
npm run job:daily-snapshot

# Check PM2 survives reboot
pm2 save
# Confirm pm2 startup was configured
```

## 8. Redeploy

```bash
cd /app
git pull
npm ci
npm run build
pm2 reload deploy/ecosystem.config.js
```
