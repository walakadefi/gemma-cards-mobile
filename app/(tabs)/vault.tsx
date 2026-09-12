import { VaultScreen as CollectionVault } from '../../src/features/vault/VaultScreen';
import { useRouter } from 'expo-router';
import { useDemoCollection } from '../../src/state/DemoCollectionContext';

export default function VaultScreen() {
  const router = useRouter();
  const { cards } = useDemoCollection();
  return <CollectionVault cards={cards} onBrowsePacks={() => router.push('/')} />;
}
