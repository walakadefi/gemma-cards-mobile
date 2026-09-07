import { useLocalSearchParams, useRouter } from 'expo-router';

import { PackDetailScreen } from '../../src/features/shop/PackDetailScreen';
import { useDemoCollection } from '../../src/state/DemoCollectionContext';

export default function PackDetailRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const router = useRouter();
  const { addPack } = useDemoCollection();
  const expansionId = Array.isArray(id) ? id[0] : (id ?? '');
  return <PackDetailScreen expansionId={expansionId} onClose={() => router.replace('/')} onAddDemoPack={(value) => { addPack(value); router.replace('/packs'); }} />;
}
