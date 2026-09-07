# Gemma Shop Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable Expo mobile prototype with Gemma branding, five-tab navigation, a fixture-backed pack shop, game filters, and a pack-detail modal.

**Architecture:** Expo Router owns route composition while focused feature modules own domain data and UI. The Shop reads typed deterministic fixtures through pure selectors; shared theme and primitive components keep the visual language consistent. Non-Shop tabs are honest prototype empty states and no action contacts a production service.

**Tech Stack:** Expo, React Native, Expo Router, TypeScript, React Native Testing Library, Jest, ESLint

**Spec:** `docs/superpowers/specs/2026-09-07-gemma-mobile-app-design.md`

## Global Constraints

- One cross-platform Expo/React Native codebase with strict TypeScript.
- Use near-black surfaces, violet primary actions, emerald positive states, and high-contrast typography.
- The first slice is fixture-backed and must not perform authentication, payments, draws, buybacks, swaps, reward claims, or shipping orders.
- All prototype actions must be visibly labeled as demos.
- Support accessible labels, minimum 44-point tap targets, reduced motion, loading, empty, and error states.
- Use integer minor units for money and integers for coin amounts.
- Run the locally installed `qwen2.5-coder:14b` model through Ollama to generate implementation changes; Codex validates the result.

## File map

- `package.json`: Expo scripts and test/type/lint commands.
- `app.json`, `babel.config.js`, `tsconfig.json`, `eslint.config.js`, `jest.config.js`, `expo-env.d.ts`: project configuration.
- `app/_layout.tsx`: root providers, status bar, and Stack configuration.
- `app/(tabs)/_layout.tsx`: five-tab navigation and labels.
- `app/(tabs)/index.tsx`: Shop route delegating to `ShopScreen`.
- `app/(tabs)/packs.tsx`, `binder.tsx`, `vault.tsx`, `rewards.tsx`: prototype empty routes.
- `app/pack/[id].tsx`: pack detail modal route.
- `src/theme/tokens.ts`: colors, spacing, typography sizes, radii, and shadows.
- `src/domain/catalog.ts`: catalog types and pure filtering/formatting functions.
- `src/fixtures/catalog.ts`: deterministic expansion data.
- `src/components/AppScreen.tsx`: safe-area-aware screen layout.
- `src/components/AppHeader.tsx`: brand, demo balance, and profile affordance.
- `src/components/FilterChip.tsx`: accessible game filter control.
- `src/components/PackCard.tsx`: expansion summary and navigation affordance.
- `src/components/EmptyState.tsx`: reusable prototype/empty state.
- `src/features/shop/ShopScreen.tsx`: featured panel, filter state, and expansion list.
- `src/features/shop/PackDetailScreen.tsx`: selected expansion facts and demo action.
- `src/domain/catalog.test.ts`: pure domain tests.
- `src/features/shop/ShopScreen.test.tsx`: Shop interaction tests.
- `src/features/shop/PackDetailScreen.test.tsx`: pack detail and demo-safety tests.

---

### Task 1: Scaffold and catalog domain

**Files:**
- Create: `package.json`
- Create: `app.json`
- Create: `babel.config.js`
- Create: `tsconfig.json`
- Create: `eslint.config.js`
- Create: `jest.config.js`
- Create: `expo-env.d.ts`
- Create: `src/domain/catalog.ts`
- Create: `src/fixtures/catalog.ts`
- Test: `src/domain/catalog.test.ts`

**Interfaces:**
- Produces: `Game = 'pokemon' | 'onepiece'`
- Produces: `GameFilter = 'all' | Game`
- Produces: `Expansion` with `id`, `game`, `name`, `code`, `coinPrice`, `topCardValueCents`, `volatility`, `accent`, `description`, and `odds`
- Produces: `filterExpansions(items, filter): Expansion[]`
- Produces: `formatEuro(cents): string`
- Produces: `formatCoins(coins): string`

- [ ] **Step 1: Write the catalog tests**

```ts
import { filterExpansions, formatCoins, formatEuro } from './catalog';
import { expansions } from '../fixtures/catalog';

describe('catalog helpers', () => {
  it('filters Pokemon independently from One Piece', () => {
    expect(filterExpansions(expansions, 'pokemon').every((item) => item.game === 'pokemon')).toBe(true);
    expect(filterExpansions(expansions, 'onepiece').every((item) => item.game === 'onepiece')).toBe(true);
  });

  it('formats integer values for the interface', () => {
    expect(formatCoins(1000)).toBe('1,000');
    expect(formatEuro(144200)).toBe('€1,442');
  });
});
```

- [ ] **Step 2: Run the focused test and confirm the red state**

Run: `npm test -- --runInBand src/domain/catalog.test.ts`
Expected: FAIL because the domain module and project configuration do not exist yet.

- [ ] **Step 3: Add project configuration and the minimal pure domain implementation**

```ts
export type Game = 'pokemon' | 'onepiece';
export type GameFilter = 'all' | Game;

export interface OddsTier {
  label: string;
  chancePercent: number;
  minimumValueCents: number;
}

export interface Expansion {
  id: string;
  game: Game;
  name: string;
  code: string;
  coinPrice: number;
  topCardValueCents: number;
  volatility: 1 | 2 | 3 | 4 | 5;
  accent: string;
  description: string;
  odds: OddsTier[];
}

export const filterExpansions = (items: Expansion[], filter: GameFilter) =>
  filter === 'all' ? items : items.filter((item) => item.game === filter);

export const formatCoins = (coins: number) => new Intl.NumberFormat('en-US').format(coins);
export const formatEuro = (cents: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(cents / 100);
```

Create at least six fixture expansions split across both games, including Pitch Black, Ascended Heroes, The Time of Battle, and Adventure on Kami's Island. Give each item at least three odds tiers.

- [ ] **Step 4: Install dependencies and run the focused test**

Run: `npm install`
Expected: dependency installation completes successfully.

Run: `npm test -- --runInBand src/domain/catalog.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit the domain foundation**

```bash
git add package.json package-lock.json app.json babel.config.js tsconfig.json eslint.config.js jest.config.js expo-env.d.ts src/domain src/fixtures
git commit -m "chore: scaffold Gemma mobile catalog"
```

### Task 2: Theme, primitives, and navigation shell

**Files:**
- Create: `src/theme/tokens.ts`
- Create: `src/components/AppScreen.tsx`
- Create: `src/components/AppHeader.tsx`
- Create: `src/components/FilterChip.tsx`
- Create: `src/components/EmptyState.tsx`
- Create: `app/_layout.tsx`
- Create: `app/(tabs)/_layout.tsx`
- Create: `app/(tabs)/packs.tsx`
- Create: `app/(tabs)/binder.tsx`
- Create: `app/(tabs)/vault.tsx`
- Create: `app/(tabs)/rewards.tsx`

**Interfaces:**
- Consumes: `formatCoins(coins: number): string`
- Produces: `theme` token object
- Produces: `AppScreen({ children, scroll? })`
- Produces: `AppHeader({ balance })`
- Produces: `FilterChip({ label, selected, onPress })`
- Produces: `EmptyState({ eyebrow, title, body, actionLabel? })`

- [ ] **Step 1: Add a component smoke test for the prototype disclosure**

Add `src/components/EmptyState.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react-native';
import { EmptyState } from './EmptyState';

it('states that unfinished actions are a demo', () => {
  render(<EmptyState eyebrow="MY PACKS" title="Nothing sealed yet" body="Demo mode — no purchase was made." />);
  expect(screen.getByText(/Demo mode/i)).toBeTruthy();
});
```

- [ ] **Step 2: Run the smoke test and confirm it fails**

Run: `npm test -- --runInBand src/components/EmptyState.test.tsx`
Expected: FAIL because `EmptyState` does not exist.

- [ ] **Step 3: Implement tokens, primitives, and routes**

The token module must expose exact semantic colors:

```ts
export const colors = {
  background: '#050506',
  surface: '#111114',
  surfaceRaised: '#19191D',
  text: '#F5F5F7',
  textMuted: '#A9A9B2',
  violet: '#8B5CF6',
  violetStrong: '#7239E0',
  emerald: '#00B67A',
  border: '#2A2A30',
  danger: '#FF6B7A',
} as const;
```

Configure tabs with route names `index`, `packs`, `binder`, `vault`, and `rewards`; visible labels are Shop, My Packs, Binder, Vault, and Rewards. Every tab must have an accessibility label. The four unfinished feature routes use `EmptyState` and say that they are part of the prototype.

- [ ] **Step 4: Run the component test and type checker**

Run: `npm test -- --runInBand src/components/EmptyState.test.tsx`
Expected: PASS.

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit the shell**

```bash
git add app src/theme src/components
git commit -m "feat: add Gemma navigation shell"
```

### Task 3: Shop catalog and filters

**Files:**
- Create: `src/components/PackCard.tsx`
- Create: `src/features/shop/ShopScreen.tsx`
- Create: `app/(tabs)/index.tsx`
- Test: `src/features/shop/ShopScreen.test.tsx`

**Interfaces:**
- Consumes: `Expansion`, `GameFilter`, `filterExpansions`, `formatCoins`, `formatEuro`, and `expansions`
- Produces: `PackCard({ expansion, onPress })`
- Produces: `ShopScreen()`

- [ ] **Step 1: Write the Shop interaction test**

```tsx
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ShopScreen } from './ShopScreen';

it('filters the visible expansion cards by game', () => {
  render(<ShopScreen />);
  expect(screen.getByText('Pitch Black')).toBeTruthy();
  expect(screen.getByText('The Time of Battle')).toBeTruthy();
  fireEvent.press(screen.getByRole('button', { name: 'Show One Piece packs' }));
  expect(screen.queryByText('Pitch Black')).toBeNull();
  expect(screen.getByText('The Time of Battle')).toBeTruthy();
});
```

- [ ] **Step 2: Run the Shop test and confirm it fails**

Run: `npm test -- --runInBand src/features/shop/ShopScreen.test.tsx`
Expected: FAIL because `ShopScreen` does not exist.

- [ ] **Step 3: Implement the Shop screen**

Render an `AppHeader` with a 1,000-coin demo balance, a featured panel containing “Rip real packs, online.”, three accessible filter chips, and a two-column list of `PackCard` components. Cards must show game, set name, coin price, top-card euro value, and a text volatility indicator. Navigation opens `/pack/[id]`.

Use `useReducedMotion` or the platform accessibility setting to disable decorative scale/opacity transitions when reduced motion is enabled. Keep list items at least 160 points wide and let the layout fall back to one column on narrow screens.

- [ ] **Step 4: Run Shop tests, type checking, and lint**

Run: `npm test -- --runInBand src/features/shop/ShopScreen.test.tsx`
Expected: PASS.

Run: `npm run typecheck`
Expected: PASS.

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 5: Commit the Shop**

```bash
git add 'app/(tabs)/index.tsx' src/components/PackCard.tsx src/features/shop
git commit -m "feat: build fixture-backed pack shop"
```

### Task 4: Pack detail modal and safe demo action

**Files:**
- Create: `src/features/shop/PackDetailScreen.tsx`
- Create: `app/pack/[id].tsx`
- Test: `src/features/shop/PackDetailScreen.test.tsx`

**Interfaces:**
- Consumes: catalog fixture and formatting helpers
- Produces: `PackDetailScreen({ expansionId })`

- [ ] **Step 1: Write pack-detail safety tests**

```tsx
import { fireEvent, render, screen } from '@testing-library/react-native';
import { PackDetailScreen } from './PackDetailScreen';

it('shows transparent odds and never labels the prototype action as a purchase', () => {
  render(<PackDetailScreen expansionId="pitch-black" />);
  expect(screen.getByText(/Odds and value ranges/i)).toBeTruthy();
  expect(screen.getByText(/18\+/i)).toBeTruthy();
  expect(screen.getByRole('button', { name: /Add demo pack/i })).toBeTruthy();
  expect(screen.queryByRole('button', { name: /Buy now/i })).toBeNull();
});

it('acknowledges a demo pack without external activity', () => {
  render(<PackDetailScreen expansionId="pitch-black" />);
  fireEvent.press(screen.getByRole('button', { name: /Add demo pack/i }));
  expect(screen.getByText(/Demo pack prepared/i)).toBeTruthy();
});
```

- [ ] **Step 2: Run the detail test and confirm it fails**

Run: `npm test -- --runInBand src/features/shop/PackDetailScreen.test.tsx`
Expected: FAIL because the detail screen does not exist.

- [ ] **Step 3: Implement the detail modal**

Find the expansion by route id. Render a helpful not-found state for an unknown id. For a known expansion show price, top-card value, volatility, all odds tiers, a fairness callout, the non-cash coin disclosure, and an 18+ notice. The only action is `Add demo pack`; it changes local screen copy to `Demo pack prepared — no coins charged.` and performs no navigation or network request.

- [ ] **Step 4: Run all automated checks**

Run: `npm test -- --runInBand`
Expected: all tests PASS.

Run: `npm run typecheck`
Expected: PASS.

Run: `npm run lint`
Expected: PASS.

- [ ] **Step 5: Commit the detail flow**

```bash
git add app/pack src/features/shop/PackDetailScreen.tsx src/features/shop/PackDetailScreen.test.tsx
git commit -m "feat: add transparent pack detail prototype"
```

### Task 5: Runtime and visual validation

**Files:**
- Modify only files implicated by validation failures.

**Interfaces:**
- Consumes: the complete first slice
- Produces: a validated development build with no known blocking failures

- [ ] **Step 1: Start Expo in web mode for deterministic local review**

Run: `npx expo start --web --non-interactive`
Expected: the development server starts and reports a localhost URL without a compilation error.

- [ ] **Step 2: Review the phone viewport**

Open the reported localhost URL at a phone-sized viewport. Verify the header, tabs, featured panel, filter chips, two/one-column transition, pack cards, modal content, demo disclosure, and not-found handling. Record each concrete issue before editing.

- [ ] **Step 3: Fix only observed defects and add regression tests**

For each observed behavioral defect, add a focused test that fails, make the smallest correction, and rerun that test. For purely visual clipping, adjust the responsible component's layout token or style and recheck the same viewport.

- [ ] **Step 4: Run the final gate**

Run: `npm test -- --runInBand && npm run typecheck && npm run lint`
Expected: all commands exit 0.

- [ ] **Step 5: Commit validation fixes if any**

```bash
git add app src package.json package-lock.json
git commit -m "fix: complete Gemma shop validation"
```
