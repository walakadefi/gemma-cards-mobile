import { useLocalSearchParams, useRouter } from 'expo-router';
import { EmptyState } from '../../src/components/EmptyState';
import { AppScreen } from '../../src/components/AppScreen';
import { RevealScreen } from '../../src/features/packs/RevealScreen';
import { useDemoCollection } from '../../src/state/DemoCollectionContext';

export default function RevealRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const packId = Array.isArray(id) ? id[0] : (id ?? '');
  const router = useRouter();
  const { packs, revealPack } = useDemoCollection();
  const pack = packs.find((item) => item.id === packId);
  if (!pack) return <AppScreen><EmptyState eyebrow="PACK NOT FOUND" title="This demo pack is unavailable" body="Return to My Packs and choose an available pack." /></AppScreen>;
  return <RevealScreen pack={pack} onReveal={(index) => revealPack(pack.id, index)} onClose={() => router.replace('/packs')} />;
}
