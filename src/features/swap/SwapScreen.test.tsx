import { render, screen } from '@testing-library/react-native';

import { SwapScreen } from './SwapScreen';

describe('SwapScreen', () => {
  it('waits for saved cards instead of showing an empty swap state during restore', () => {
    render(<SwapScreen cards={[]} hydrated={false} onClose={jest.fn()} />);

    expect(screen.getByText('Restoring your pulls')).toBeTruthy();
    expect(screen.queryByText('No pulls to trade yet')).toBeNull();
  });
});
