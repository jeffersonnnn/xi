# Google Play Developer Account Setup

You already have Apple Developer. Here's how to get Google Play.

---

## Steps

### 1. Create Account
- Go to: https://play.google.com/console/signup
- Sign in with a Google account
- Pay the one-time $25 registration fee

### 2. Complete Identity Verification
- Google now requires identity verification for all new developer accounts
- You'll need to provide:
  - Government-issued ID
  - A phone number for verification
  - Physical address
- Verification can take 2-7 days

### 3. Create Your First App
- Once verified, go to "Create app" in Play Console
- Fill in:
  - App name: "$XI - People's Starting XI"
  - Default language: English
  - App or game: App
  - Free or paid: Free
- Accept policies

### 4. Complete Store Listing
- Use the content from [google-play-listing.md](google-play-listing.md)
- Upload screenshots (at least 2, up to 8)
- Upload hi-res icon (512x512 — use `public/icons/icon-512x512.png`)
- Upload feature graphic (1024x500)

### 5. Build the AAB
```bash
# From your project directory
npx cap sync android
npx cap open android
# In Android Studio: Build → Generate Signed Bundle / APK
# Select "Android App Bundle" (AAB) — required by Play Store
```

### 6. Upload and Submit
- Go to Production → Create new release
- Upload the .aab file
- Add release notes
- Review and submit

### 7. The Tweet

> $XI submitted to Google Play.
> iOS App Store ✓
> Google Play ✓
> The People's Starting XI is going mobile.

---

## Timeline

| Step | Time |
|------|------|
| Account creation | 10 minutes |
| Identity verification | 2-7 days |
| App build + upload | 1-2 hours |
| Google review | 1-7 days |

## Cost

- Developer account: $25 (one-time)
