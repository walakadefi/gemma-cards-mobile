import { AppHeader } from '../../src/components/AppHeader';
import { AppScreen } from '../../src/components/AppScreen';
import { EmptyState } from '../../src/components/EmptyState';

export default function VaultScreen() {
  return <AppScreen><AppHeader balance={1000} /><EmptyState eyebrow="VAULT" title="No cards ready to ship" body="Demo mode — shipment quotes and orders are disabled in this prototype." /></AppScreen>;
}
