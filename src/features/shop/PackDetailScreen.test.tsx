import { fireEvent, render, screen } from '@testing-library/react-native';

import { PackDetailScreen } from './PackDetailScreen';

describe('PackDetailScreen', () => {
  it('shows only source-backed pack facts and never labels the prototype action as a purchase', () => {
    render(<PackDetailScreen expansionId="pitch-black" />);

    expect(screen.getByText(/What this demo mirrors/i)).toBeTruthy();
    expect(screen.getByText(/Every pull lands in your Binder/i)).toBeTruthy();
    expect(screen.queryByText(/Odds and value ranges/i)).toBeNull();
    expect(screen.queryByText(/Volatility/i)).toBeNull();
    expect(screen.getByText(/18\+/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /Add demo pack/i })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Buy now/i })).toBeNull();
  });

  it('acknowledges a demo pack without external activity', () => {
    render(<PackDetailScreen expansionId="pitch-black" />);

    fireEvent.press(screen.getByRole('button', { name: /Add demo pack/i }));

    expect(screen.getByText(/Demo pack prepared/i)).toBeTruthy();
  });

  it('provides a visible way to close the modal', () => {
    const onClose = jest.fn();
    render(<PackDetailScreen expansionId="pitch-black" onClose={onClose} />);

    expect(screen.getByTestId('pack-details-close-icon').props.name).toBe('close');
    fireEvent.press(screen.getByRole('button', { name: 'Close pack details' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
