# Gemma Pack Rip Animation Plan

**Goal:** Replace the prototype reveal with a native rip-and-swipe experience for 10 deterministic cards using Gemma's canonical pack artwork.

## Interaction

1. A sealed pack displays its commitment and canonical artwork. Drag the top tear strip to the right, or use the accessible Rip pack action.
2. Reveal cards 1–9 one at a time. Swipe left, or use Next card, to advance.
3. Advancing from card 9 enters suspense. Shake the hidden final-card stack for exactly 500 ms, then reveal card 10.
4. Completing the sequence adds all 10 cards to the demo Binder and exposes verification data.

## Implementation

- Extend catalog fixtures with canonical Gemma pack-image URLs.
- Change deterministic pack outcomes from one card to 10 cards.
- Add a pure rip-flow reducer with sealed, browsing, suspense, and complete phases.
- Build the gesture UI with React Native `Animated` and `PanResponder`, including reduced-motion and button alternatives.
- Update Binder and tests for multi-card packs.

No payments, backend calls, runtime randomness, or publisher artwork is bundled into the app. Remote image URLs come from Gemma's live pack catalog.
