#!/bin/bash
set -e

APP_DIR="/var/www/xi"
REPO="https://github.com/jeffersonnnn/xi.git"
DOMAIN="worldcupxi.xyz"

echo "========================================="
echo "  $XI VPS Deploy - worldcupxi.xyz"
echo "========================================="

# 1. Install Node 20 if missing
if ! command -v node &>/dev/null || [[ "$(node -v)" != v20* && "$(node -v)" != v22* ]]; then
  echo "[1/8] Installing Node.js 20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
else
  echo "[1/8] Node $(node -v) already installed"
fi

# 2. Install global tools
echo "[2/8] Installing PM2 and tsx..."
npm install -g pm2 tsx 2>/dev/null

# 3. Clone or pull repo
if [ -d "$APP_DIR/.git" ]; then
  echo "[3/8] Pulling latest code..."
  cd "$APP_DIR"
  git pull origin main
else
  echo "[3/8] Cloning repo..."
  rm -rf "$APP_DIR"
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# 4. Create .env.local if missing
if [ ! -f "$APP_DIR/.env.local" ]; then
  echo "[4/8] Creating .env.local from template..."
  cp .env.example .env.local
  echo ""
  echo "  !! IMPORTANT: Edit .env.local before continuing !!"
  echo "  Run: nano $APP_DIR/.env.local"
  echo ""
  echo "  Required values:"
  echo "    NEXT_PUBLIC_XI_TOKEN_MINT=<your-token-mint>"
  echo "    NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta"
  echo "    NEXT_PUBLIC_PRIVY_APP_ID=cmp6zuxgj00fv0cjr87gh4yq5"
  echo "    HELIUS_API_KEY=<your-key>"
  echo "    DATABASE_URL=<your-neon-url>"
  echo "    ALLOW_TEST_VOTES=false"
  echo ""
  read -p "  Press Enter after editing .env.local (or Ctrl+C to abort)..."
else
  echo "[4/8] .env.local already exists"
fi

# 5. Install dependencies
echo "[5/8] Installing dependencies..."
npm ci --legacy-peer-deps

# 6. Build
echo "[6/8] Building Next.js..."
npm run build

# 7. Start/reload PM2
echo "[7/8] Starting PM2 processes..."
pm2 delete xi-web xi-worker 2>/dev/null || true
pm2 start deploy/ecosystem.config.js
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

# 8. Configure nginx
echo "[8/8] Configuring nginx..."
cp deploy/nginx.conf /etc/nginx/sites-available/xi
ln -sf /etc/nginx/sites-available/xi /etc/nginx/sites-enabled/xi
rm -f /etc/nginx/sites-enabled/default 2>/dev/null

if nginx -t 2>/dev/null; then
  systemctl reload nginx
  echo "  Nginx configured and reloaded"
else
  echo "  !! Nginx config test failed - check manually"
fi

# SSL cert (skip if already exists)
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
  echo ""
  echo "  Setting up SSL certificate..."
  apt-get install -y certbot python3-certbot-nginx 2>/dev/null
  certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m aijeffersonighalo@gmail.com
else
  echo "  SSL cert already exists for $DOMAIN"
fi

echo ""
echo "========================================="
echo "  Deploy complete!"
echo "  Site: https://$DOMAIN"
echo "========================================="
echo ""
pm2 list
