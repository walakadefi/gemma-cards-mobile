import { VaultScreen as CollectionVault } from '../../src/features/vault/VaultScreen';
import { useDemoCollection } from '../../src/state/DemoCollectionContext';

export default function VaultScreen() {
  const { cards } = useDemoCollection();
  return <CollectionVault cards={cards} />;
}
