# Collector UI Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the GemmaCards prototype feel more premium and collectible across Shop, pack, Binder, and empty states.

**Architecture:** Existing feature screens remain route owners. Small presentation helpers expose reusable rarity and pack-accent metadata, while current collection context supplies recent pulls and dashboard totals. Each task changes one screen flow and preserves the local demo model.

**Tech Stack:** Expo SDK 54, React Native, Expo Router, TypeScript, Jest, React Native Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-12-collector-ui-pass-design.md`

## Global Constraints

- Implement approved updates 1–7 only.
- Use no new packages and preserve the existing persisted demo collection schema.
- Keep demo-only actions and estimates explicitly labelled.
- Run the targeted Jest suite, `npm run typecheck`, `npm run lint`, and `npm run build` for every completed task.

---

### Task 1: Visual Shop landing

**Files:** Modify `src/features/shop/ShopScreen.tsx`; `app/(tabs)/index.tsx`; tests in `src/features/shop/ShopScreen.test.tsx`.

- [ ] Write a test asserting that the first featured pack has a visible hot/new label and that recent pulls render from collection cards.
- [ ] Run `npm test -- --runInBand src/features/shop/ShopScreen.test.tsx` and verify red.
- [ ] Render the leading pack as the visual featured card and accept `recentCards?: DemoCard[]` in `ShopScreen`.
- [ ] Re-run the targeted test, typecheck, lint, and web build.
- [ ] Commit `feat: improve visual shop landing`.

### Task 2: Expansion identity

**Files:** Create `src/features/packs/expansionPresentation.ts`; modify pack detail, reveal, and history screens; tests in the relevant pack suites.

- [ ] Write a test asserting a known expansion returns its catalog accent color.
- [ ] Run that test red.
- [ ] Add the presentation helper and apply the color to pack headings and borders.
- [ ] Verify tests, typecheck, lint, and web build.
- [ ] Commit `feat: add expansion visual identity`.

### Task 3: Binder sleeve grid

**Files:** Modify `src/features/binder/BinderScreen.tsx`; test `BinderScreen.test.tsx`.

- [ ] Write a test for an accessible compact Binder dashboard.
- [ ] Run it red.
- [ ] Add the dashboard and denser card sleeve presentation without changing selection logic.
- [ ] Verify tests, typecheck, lint, and web build.
- [ ] Commit `feat: refine binder sleeve grid`.

### Task 4: Rarity visual language

**Files:** Create `src/features/binder/rarityPresentation.ts`; modify Binder and reveal surfaces; add unit tests.

- [ ] Write a test for common, rare, and illustration-rare presentations.
- [ ] Run it red.
- [ ] Add reusable colors, labels, and glow/border properties and consume them in cards.
- [ ] Verify tests, typecheck, lint, and web build.
- [ ] Commit `feat: strengthen rarity visual language`.

### Task 5: Recently pulled strip

**Files:** Modify Shop and tab route; Shop tests.

- [ ] Write a test showing the latest pulls in newest-first order.
- [ ] Run it red.
- [ ] Render the compact strip from revealed collection cards.
- [ ] Verify tests, typecheck, lint, and web build.
- [ ] Commit `feat: show recently pulled cards`.

### Task 6: Empty-state actions

**Files:** Modify `src/components/EmptyState.tsx` and caller screens; component tests.

- [ ] Write a test for an optional one-action empty state.
- [ ] Run it red.
- [ ] Add an optional accessible CTA prop and connect safe Shop navigation from Binder/My Packs.
- [ ] Verify tests, typecheck, lint, and web build.
- [ ] Commit `feat: add guided empty state actions`.

### Task 7: Collection dashboard

**Files:** Modify Binder dashboard and tests.

- [ ] Write a test that exposes value, best pull, card count, and next goal in a compact dashboard.
- [ ] Run it red.
- [ ] Render the dashboard using existing collection totals and goal rules.
- [ ] Verify tests, typecheck, lint, and web build.
- [ ] Commit `feat: add compact binder dashboard`.
