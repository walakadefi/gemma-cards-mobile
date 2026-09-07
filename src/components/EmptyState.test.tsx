import { render, screen } from '@testing-library/react-native';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('states that unfinished actions are a demo', () => {
    render(
      <EmptyState
        eyebrow="MY PACKS"
        title="Nothing sealed yet"
        body="Demo mode — no purchase was made."
      />,
    );

    expect(screen.getByText(/Demo mode/i)).toBeTruthy();
  });
});
