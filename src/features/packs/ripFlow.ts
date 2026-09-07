export type RipFlowState =
  | { phase: 'sealed'; visibleIndex: null }
  | { phase: 'browsing'; visibleIndex: number }
  | { phase: 'suspense'; visibleIndex: 8 }
  | { phase: 'complete'; visibleIndex: 9 };

export type RipFlowAction = { type: 'RIP' } | { type: 'NEXT' } | { type: 'SUSPENSE_FINISHED' };
export const FINAL_CARD_SUSPENSE_MS = 500;

export const initialRipState: RipFlowState = { phase: 'sealed', visibleIndex: null };

export function ripFlowReducer(state: RipFlowState, action: RipFlowAction): RipFlowState {
  if (action.type === 'RIP' && state.phase === 'sealed') return { phase: 'browsing', visibleIndex: 0 };
  if (action.type === 'NEXT' && state.phase === 'browsing') {
    if (state.visibleIndex === 8) return { phase: 'suspense', visibleIndex: 8 };
    if (state.visibleIndex < 8) return { phase: 'browsing', visibleIndex: state.visibleIndex + 1 };
  }
  if (action.type === 'SUSPENSE_FINISHED' && state.phase === 'suspense') return { phase: 'complete', visibleIndex: 9 };
  return state;
}
