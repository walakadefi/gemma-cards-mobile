# Collector UI Pass Design

## Scope

Implement the approved UI updates 1–7 only. Do not add pack-history badges, action-colour changes, or post-action celebration effects in this pass.

## Direction

Keep the existing dark GemmaCards visual system. The work makes the collector journey clearer: discover packs, recognise each set, understand rarity, review a dense Binder, see recent pulls, and always have one direct first action.

## Components and data

- Shop gets a visual featured-pack treatment and a recently-pulled strip sourced from the persisted collection.
- Pack detail/reveal/history use the catalog expansion accent color already present in catalog data.
- Binder gets a compact dashboard and more sleeve-like density without altering collection state.
- Rarity maps to reusable color/treatment metadata derived from the existing `CardRarity` union.
- Empty states gain a single action only where the caller provides a safe navigation callback.

## Constraints

- React Native / Expo Router / TypeScript only; no new dependencies.
- Preserve local collection persistence and existing routes.
- Maintain truthful demo labels for all prototype-only behaviour.
- Every visual behaviour has an accessibility label and a regression test where it changes flow or content.
