# Gemma Cards - Mobile App Pitch Deck Summary

## 📱 Product Overview

Gemma Cards brings the digital collectible trading experience to iOS and Android devices, inspired by the real-world gemma.cards platform (https://gemma.cards) where users buy packs, tear them open in-game, and trade or sell cards via coin buyback.

---

## 🎯 Key Features

### Pack Opening
- **Realistic pack opening** – Drag the top of each pack to "tear" it open for immersion
- **Suspense animation** – Last card reveals with 0.5s suspense shake
- **10-card draw sequence** – One-by-one reveal build-up (card rarity color-coded)

### Collection & Trading
- **Digital binder** – Store cards in organized collection grid, drag to swap or keep
- **Live density display** – Shows card value changes as you collect rarer ones
- **Buyback system** – Instant 75% coin buyback option for selling selected cards

### Profile & Rewards
- **Guest login** – No account friction, coins balance displayed in UI
- **Rewards hub** – Points for daily activity, referrals, completion milestones
- **Collection stats** – Progress bars per set, total count, completeness

### Settings & Customization
- Theme toggle (dark/light) – System preference respects device settings  
- Currency selector – USD/EUR/GBP toggles price display
- Export collection data – JSON backup for your cards

---

## 🛠️ Technology Stack

- Expo SDK 51 (mobile-first framework), TypeScript (.tsx) codebase, Expo Router navigation
- Ionicons 6 library for consistent mobile UI icons across all devices
- IndexedDB client-side storage for local persistence (offline collections)
- EAS Distribution cloud builds – no Apple Developer membership needed for Android APK delivery

---

## 📱 Deployment Options

### Free Right Now:
- Web PWA (Add to Home Screen): https://gemma-cards-mobile.expo.app  
- Android APK via Expo Distribution build (cloud-generated preview links)  

### Paid Tier ($99/yr):
- TestFlight for iOS beta testing with friend Apple IDs  
- App Store submission via your existing paid account  

---

## 💰 Business Model

### Revenue Streams:
1. **Pack sales** – Buy PBL, ASC, OP16, OP15, OP13 packs within app (~$7.99-$9.99)
2. **Buyback fees** – Take 25% when users sell cards to Gemma coins
3. **Premium tiers** (future): Exclusive card drops, limited editions, subscription bonuses

---

## 📊 Target Users

Collectors who want a frictionless mobile experience: no login walls or complicated setups—just buy, rip, keep, trade or sell. The prototype demonstrates this flow clearly without needing backend access yet.

---

## 🚀 Next Steps for Production

1. Connect payment gateway (Stripe/Sagepay)
2. Build real-time card draw API with server
3. Deploy iOS via your Apple Developer account ($99/year minimum)
4. Push Android builds to Google Play or sideload APKs

---

## ✅ Current Status

Prototype v0.3 complete and ready for demo: all core animations, UI polish, and mobile flows implemented locally. Live web link available for testing now (https://gemma-cards-mobile.expo.app) — add to home screen on Android/iOS to experience the full pack opening journey immediately.
