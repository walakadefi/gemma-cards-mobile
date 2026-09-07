# Gemma Demo Pack Opening Plan

**Goal:** Connect the existing demo-pack action to a deterministic, local-only sealed-pack reveal and binder flow.

**Architecture:** A React context mounted at the root owns prototype packs and binder cards. Pure domain functions create a stable commitment and map a selected slot to a fixture card. Expo Router routes handle pack detail, My Packs, reveal, and Binder screens. No persistence, payment, network activity, or runtime randomness is introduced.

## Task 1: Domain and state

- Add pack, card, and verification types plus deterministic fixture outcomes.
- Add pure `createDemoPack` and `revealDemoPack` functions with unit tests.
- Add a `DemoCollectionProvider` exposing add/reveal operations.

## Task 2: Acquire and view sealed pack

- Update pack details so Add demo pack writes to shared state and opens My Packs.
- Replace the My Packs placeholder with sealed/revealed pack cards.
- Test acquisition and sealed-pack rendering.

## Task 3: Reveal and binder

- Add `/reveal/[id]` with commitment-first selection and explicit reveal.
- Show card value and complete verification fields only after reveal.
- Replace Binder placeholder with revealed fixture cards.
- Test pre-reveal secrecy, deterministic selection, and binder output.

## Task 4: Verify

- Run Jest, TypeScript, ESLint, production web export, and phone-viewport browser checks.
- Confirm no network calls, payments, or `Math.random` were added.
