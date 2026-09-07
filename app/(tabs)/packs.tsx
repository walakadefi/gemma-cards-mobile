import { AppHeader } from '../../src/components/AppHeader';
import { AppScreen } from '../../src/components/AppScreen';
import { EmptyState } from '../../src/components/EmptyState';

export default function PacksScreen() {
  return <AppScreen><AppHeader balance={1000} /><EmptyState eyebrow="MY PACKS" title="Nothing sealed yet" body="Demo mode — pack purchases and reveals arrive in the next feature." /></AppScreen>;
}
