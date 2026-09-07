import { AppHeader } from '../../src/components/AppHeader';
import { AppScreen } from '../../src/components/AppScreen';
import { EmptyState } from '../../src/components/EmptyState';

export default function RewardsScreen() {
  return <AppScreen><AppHeader balance={1000} /><EmptyState eyebrow="REWARDS" title="Daily and weekly drops" body="Prototype view — reward claims cannot change a real Gemma balance." /></AppScreen>;
}
