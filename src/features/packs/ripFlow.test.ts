import { FINAL_CARD_SUSPENSE_MS, initialRipState, ripFlowReducer } from './ripFlow';

describe('pack rip state machine', () => {
  it('holds final-card suspense for half a second', () => {
    expect(FINAL_CARD_SUSPENSE_MS).toBe(500);
  });
  it('holds the pack in a tearing state until the top has lifted away', () => {
    const tearing = ripFlowReducer(initialRipState, { type: 'START_RIP' });
    expect(tearing).toEqual({ phase: 'tearing', visibleIndex: null });
    expect(ripFlowReducer(tearing, { type: 'RIP_OPENED' })).toEqual({ phase: 'browsing', visibleIndex: 0 });
  });

  it('shows cards one through nine before suspense', () => {
    let state = ripFlowReducer(ripFlowReducer(initialRipState, { type: 'START_RIP' }), { type: 'RIP_OPENED' });
    for (let index = 0; index < 8; index += 1) state = ripFlowReducer(state, { type: 'NEXT' });
    expect(state).toEqual({ phase: 'browsing', visibleIndex: 8 });
    expect(ripFlowReducer(state, { type: 'NEXT' })).toEqual({ phase: 'suspense', visibleIndex: 8 });
  });

  it('reveals card ten only after suspense finishes', () => {
    const suspense = { phase: 'suspense', visibleIndex: 8 } as const;
    expect(ripFlowReducer(suspense, { type: 'SUSPENSE_FINISHED' })).toEqual({ phase: 'complete', visibleIndex: 9 });
    expect(ripFlowReducer({ phase: 'complete', visibleIndex: 9 }, { type: 'NEXT' })).toEqual({ phase: 'complete', visibleIndex: 9 });
  });
});
