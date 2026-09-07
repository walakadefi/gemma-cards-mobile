# Gemma Mobile App Design

Date: 2026-09-07
Status: Approved direction, implementation brief

## Product objective

Create a polished cross-platform mobile app for GemmaCards that carries the existing website's product model into a native-feeling iOS and Android experience. The app should make the main loop fast and understandable: acquire Gemma coins, choose a Pokemon or One Piece expansion, receive a sealed pack, reveal the committed result, then keep, swap, ship, or sell cards back for coins.

The first implementation is a front-end prototype. It must be useful for design review and interaction testing without claiming to perform real purchases, real draws, account changes, or fulfillment. Production services will be connected through explicit adapters after Gemma's private API contracts are available.

## Audience and principles

The primary audience is adult trading-card collectors who value the excitement of a reveal but need confidence that pricing, odds, ownership, and delivery are legitimate.

The experience must therefore be:

- Collectible-first: pack art and card results are the visual focus.
- Trust-forward: commitment hashes, market values, buyback terms, and shipping costs are visible before decisions.
- Fast: a returning user should reach a pack in two taps from launch.
- Honest: coins are platform credit and cannot be converted to cash; randomized products are 18+.
- Accessible: controls have readable labels, adequate contrast, reduced-motion support, and large tap targets.

## Platform and technical architecture

Build one codebase with Expo, React Native, Expo Router, and TypeScript. Use the current stable Expo toolchain available in the local environment when implementation begins.

Organize the app by feature rather than by file type:

- `app/`: route composition and navigation only.
- `src/features/shop`: expansion catalog, filtering, pack details, and purchase-preview surfaces.
- `src/features/packs`: sealed-pack queue, fairness commitment display, and reveal experience.
- `src/features/binder`: owned cards, values, filtering, and card actions.
- `src/features/vault`: shipment selection, cost summary, and tracking states.
- `src/features/rewards`: daily and weekly reward states.
- `src/features/profile`: account, language, support, responsible-use, and legal links.
- `src/components`: shared visual primitives with narrow public interfaces.
- `src/services`: interfaces for catalog, account, draws, pricing, rewards, and shipping.
- `src/fixtures`: deterministic prototype data isolated from production adapters.
- `src/theme`: colors, type scale, spacing, radii, elevation, and motion tokens.

Use TanStack Query for server-state boundaries once real services exist. Keep temporary UI state local unless multiple routes need it; use a small Zustand store only for cross-route prototype state such as the coin balance, owned packs, and binder contents. Persist prototype state locally and label it as demo data.

## Visual direction

Preserve the website's established identity:

- Near-black backgrounds with slightly lifted charcoal surfaces.
- Violet as the main action and Gemma brand color.
- Emerald for ownership, delivery, and positive status.
- White primary text with muted gray supporting text.
- Inter/system sans typography, bold compact headlines, and generous card radii.
- Pack and card imagery remains vivid against restrained chrome.

The mobile app should not reproduce the website's desktop sidebar. It uses a compact header and native bottom navigation. Motion is concentrated in the pack reveal and micro-feedback; ordinary navigation stays quick and quiet.

## Information architecture

The signed-in mobile shell has five primary destinations:

1. Shop: featured expansions, Pokemon/One Piece filters, prices, volatility, and top-card value.
2. My Packs: paid and committed packs waiting to be revealed.
3. Binder: owned pulls, live value summaries, filters, and keep/buyback/swap actions.
4. Vault: cards selected for shipment, shipping quote, order, and tracking states.
5. Rewards: daily and weekly claim timers and reward history.

The header shows the Gemma mark, coin balance, and profile access. Secondary pages include collection progress, swap, Pack Rush, fair-play explanation, verification, shipping, FAQ, support, and legal information.

## Core journeys

### Browse and choose a pack

The Shop opens on a featured section followed by expansion cards. Each expansion card shows game, set name, pack art, coin price, volatility, and top-card market value. Filters support All, Pokemon, and One Piece. Selecting a pack opens a detail sheet with odds, market-value ranges, fairness explanation, and the action to continue.

### Acquire and reveal a pack

In the prototype, continuing creates a clearly labeled demo pack without contacting a payment provider. The pack enters My Packs with a deterministic commitment hash. Opening it presents the commitment before reveal, asks the user to choose a pack position, then runs an accessible reveal sequence. Reduced-motion mode replaces tearing and flips with fades.

The result view shows each card's name, set, rarity, market value, and available actions. It also exposes the revealed seed and a verification entry point. Fixture outcomes are deterministic so automated tests can reproduce them.

### Manage cards

Cards land in Binder automatically. A card detail page allows the user to keep it, mark it for Vault, preview a 75% coin buyback, or enter the Swap flow. Prototype actions update local demo state and always identify themselves as simulations.

### Ship cards

Vault groups selected cards into a shipment. The quote follows the public site rules: the first three eligible cards cost EUR 10 flat, each additional card costs EUR 5, and cards worth under EUR 10 cost EUR 5 each without consuming the base allowance. The app shows supported destinations, an itemized quote, and a disabled production checkout action in the prototype.

## Data contracts

Feature code consumes typed service interfaces rather than importing fixtures directly. Required domain entities are `Expansion`, `PackOffer`, `OddsTier`, `SealedPack`, `Commitment`, `Card`, `OwnedCard`, `CoinWallet`, `RewardWindow`, `ShipmentQuote`, and `Shipment`.

All money values use integer minor units and an ISO currency code. Coin amounts use integers. Market-price timestamps are explicit. Draw verification data includes the commitment hash, revealed seed, selected pack index, algorithm version, and previous-chain fingerprint.

Production adapters are intentionally out of scope until the existing Gemma backend exposes authenticated API documentation. No client-side code may manufacture a production draw, trust a client-supplied card value, or treat local state as authoritative.

## Error and offline behavior

The prototype includes purposeful loading, empty, offline, and retry states. Cached catalog and binder content may be read offline; purchases, reward claims, buybacks, swaps, and shipments must be blocked when a production connection is unavailable. Errors use plain language and preserve the user's place. A reveal already committed by the server must remain recoverable after an interruption.

## Security, trust, and compliance surfaces

- Present the commitment before a production purchase and the seed after reveal.
- Never log tokens, payment details, seeds before reveal, or personal shipping information.
- Store future authentication tokens only in platform secure storage.
- Display the 18+ and non-cash coin disclosure near purchase-related actions.
- Keep shipping totals and the 75% buyback calculation explicit.
- Do not imply affiliation with Pokemon, Bandai, or LimitlessTCG.
- Treat App Store review, randomized-product policy, age-gating, and payment eligibility as a dedicated production-readiness task before public distribution.

## First implementation task

Build the app foundation and a reviewable Shop slice:

1. Scaffold Expo Router with strict TypeScript and lint/test scripts.
2. Add the Gemma theme and reusable screen, header, chip, button, value, and pack-card primitives.
3. Add the five-tab navigation shell with placeholder empty states for non-Shop tabs.
4. Implement Shop with deterministic fixture expansions, game filters, a featured panel, and pack detail sheet.
5. Add accessibility labels, reduced-motion-aware behavior, loading/empty/error states, and responsive phone layouts.
6. Add component/unit tests for filters, formatting, and pack-detail behavior.

This task does not implement authentication, real coin purchases, real pack draws, real buybacks, real swaps, or shipping orders.

## Validation

The first slice is complete when:

- Dependencies install without warnings that block development.
- Type checking, linting, and tests pass.
- The Expo development server starts successfully.
- Shop renders on a phone viewport with working game filters and pack details.
- All five primary tabs are reachable.
- Prototype-only actions are visibly labeled and cannot trigger external transactions.
- The primary screens are visually reviewed for clipping, contrast, tap targets, and empty/error states.

## Implementation model constraint

Generate the implementation by running the locally installed `qwen2.5-coder:14b` model through Ollama. Provide Qwen this specification and the repository state. Codex supervises the result: inspect every change, run validation, repair defects through further focused Qwen prompts where practical, and report exact evidence. Qwen output is not accepted merely because generation completed.
