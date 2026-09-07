import { fireEvent, render, screen } from '@testing-library/react-native';

import { PackDetailScreen } from './PackDetailScreen';

describe('PackDetailScreen', () => {
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
});
