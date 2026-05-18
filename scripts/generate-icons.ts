import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const SIZES = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512, 1024];
const BG = '#0A0F0C';
const GOLD = '#F5C518';
const CHALK = '#EDEDED';

function generateSVG(size: number): Buffer {
  const fontSize = Math.round(size * 0.38);
  const dollarSize = Math.round(size * 0.22);
  const yCenter = Math.round(size * 0.55);
  const dollarX = Math.round(size * 0.22);
  const xiX = Math.round(size * 0.55);
  const shieldPad = Math.round(size * 0.08);

  const svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.18)}" fill="${BG}"/>
  <rect x="${shieldPad}" y="${shieldPad}" width="${size - shieldPad * 2}" height="${size - shieldPad * 2}" rx="${Math.round(size * 0.12)}" fill="none" stroke="${GOLD}" stroke-width="${Math.max(1, Math.round(size * 0.02))}" opacity="0.4"/>
  <text x="${dollarX}" y="${yCenter}" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="${dollarSize}" fill="${GOLD}" text-anchor="middle" dominant-baseline="central">$</text>
  <text x="${xiX}" y="${yCenter}" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="${fontSize}" fill="${CHALK}" text-anchor="middle" dominant-baseline="central">XI</text>
</svg>`;
  return Buffer.from(svg);
}

async function main() {
  const outDir = path.join(process.cwd(), 'public', 'icons');
  fs.mkdirSync(outDir, { recursive: true });

  for (const size of SIZES) {
    const svg = generateSVG(size);
    const png = await sharp(svg).resize(size, size).png().toBuffer();

    if (size === 16) {
      fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon-16x16.png'), png);
    } else if (size === 32) {
      fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon-32x32.png'), png);
    } else if (size === 180) {
      fs.writeFileSync(path.join(process.cwd(), 'public', 'apple-touch-icon.png'), png);
    } else if (size === 1024) {
      fs.mkdirSync(path.join(process.cwd(), 'resources'), { recursive: true });
      fs.writeFileSync(path.join(process.cwd(), 'resources', 'icon.png'), png);
    }

    if (size !== 16 && size !== 32 && size !== 180) {
      fs.writeFileSync(path.join(outDir, `icon-${size}x${size}.png`), png);
    }
  }

  // Generate splash screen (2732x2732 with centered logo)
  const splashSize = 2732;
  const logoSize = 512;
  const logoSvg = generateSVG(logoSize);
  const logoPng = await sharp(logoSvg).resize(logoSize, logoSize).png().toBuffer();

  const splash = await sharp({
    create: { width: splashSize, height: splashSize, channels: 4, background: BG },
  })
    .composite([{
      input: logoPng,
      left: Math.round((splashSize - logoSize) / 2),
      top: Math.round((splashSize - logoSize) / 2),
    }])
    .png()
    .toBuffer();

  fs.mkdirSync(path.join(process.cwd(), 'resources'), { recursive: true });
  fs.writeFileSync(path.join(process.cwd(), 'resources', 'splash.png'), splash);

  // Generate OG image (1200x630)
  const ogWidth = 1200;
  const ogHeight = 630;
  const ogLogoSize = 200;
  const ogLogoSvg = generateSVG(ogLogoSize);
  const ogLogoPng = await sharp(ogLogoSvg).resize(ogLogoSize, ogLogoSize).png().toBuffer();

  const taglineSvg = Buffer.from(`<svg width="800" height="60" xmlns="http://www.w3.org/2000/svg">
    <text x="400" y="35" font-family="Arial,Helvetica,sans-serif" font-weight="700" font-size="28" fill="${CHALK}" text-anchor="middle" dominant-baseline="central" letter-spacing="6">THE PEOPLE'S STARTING XI</text>
  </svg>`);

  const subtitleSvg = Buffer.from(`<svg width="600" height="40" xmlns="http://www.w3.org/2000/svg">
    <text x="300" y="22" font-family="Arial,Helvetica,sans-serif" font-weight="400" font-size="18" fill="${GOLD}" text-anchor="middle" dominant-baseline="central" letter-spacing="3">2026 FIFA WORLD CUP</text>
  </svg>`);

  const og = await sharp({
    create: { width: ogWidth, height: ogHeight, channels: 4, background: BG },
  })
    .composite([
      { input: ogLogoPng, left: Math.round((ogWidth - ogLogoSize) / 2), top: 140 },
      { input: await sharp(taglineSvg).png().toBuffer(), left: 200, top: 380 },
      { input: await sharp(subtitleSvg).png().toBuffer(), left: 300, top: 440 },
    ])
    .png()
    .toBuffer();

  fs.writeFileSync(path.join(process.cwd(), 'public', 'og-image.png'), og);

  console.log('Generated all icons, splash screen, and OG image.');
}

main().catch(console.error);
