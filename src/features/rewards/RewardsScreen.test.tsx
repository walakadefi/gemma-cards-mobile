import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RewardsScreen } from './RewardsScreen';

it('remembers a preview claim after reopening Rewards', async () => {
  await AsyncStorage.clear();
  const view = render(<RewardsScreen />);
  await waitFor(() => expect(screen.getByRole('button', { name: 'Claim daily preview' }).props.accessibilityState.disabled).toBe(false));
  fireEvent.press(screen.getByRole('button', { name: 'Claim daily preview' }));
  await waitFor(() => expect(screen.getByText('Daily preview claimed. No coins were added.')).toBeTruthy());
  view.unmount();
  render(<RewardsScreen />);
  await waitFor(() => expect(screen.getByText('Claimed this period')).toBeTruthy());
  expect(screen.getByRole('button', { name: 'Claim daily preview' }).props.accessibilityState.disabled).toBe(true);
  expect(screen.getByRole('button', { name: 'Claim weekly preview' }).props.accessibilityState.disabled).toBe(false);
});
