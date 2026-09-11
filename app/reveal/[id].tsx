import { useLocalSearchParams, useRouter } from 'expo-router';
import { EmptyState } from '../../src/components/EmptyState';
import { AppScreen } from '../../src/components/AppScreen';
import { RevealScreen } from '../../src/features/packs/RevealScreen';
import { expansions } from '../../src/fixtures/catalog';
import { useDemoCollection } from '../../src/state/DemoCollectionContext';

export function generateStaticParams() {
  return expansions.map(({ id }) => ({ id: `demo-${id}` }));
}

export default function RevealRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const packId = Array.isArray(id) ? id[0] : (id ?? '');
  const router = useRouter();
  const { packs, openPack, hydrated } = useDemoCollection();
  const pack = packs.find((item) => item.id === packId);
  if (!hydrated && !pack) return <AppScreen><EmptyState eyebrow="YOUR COLLECTION" title="Loading your pack…" body="Restoring your saved collection." /></AppScreen>;
  if (!pack) return <AppScreen><EmptyState eyebrow="PACK NOT FOUND" title="This demo pack is unavailable" body="Return to My Packs and choose an available pack." /></AppScreen>;
  const existingCardNames = packs.filter((item) => item.id !== pack.id).flatMap((item) => item.revealedCards ?? []).map((card) => card.name);
  return <RevealScreen key={pack.id} pack={pack} existingCardNames={existingCardNames} onRip={() => openPack(pack.id)} onClose={() => router.replace('/packs')} onViewBinder={() => router.replace('/binder')} onBrowsePacks={() => router.replace('/')} />;
}
