import { BinderScreen as BinderCollectionScreen } from '../../src/features/binder/BinderScreen';
import { useRouter } from 'expo-router';
import { useDemoCollection } from '../../src/state/DemoCollectionContext';

export default function BinderScreen() {
  const router = useRouter();
  const { cards, hydrated } = useDemoCollection();
  return <BinderCollectionScreen hydrated={hydrated} cards={cards} onShip={() => router.push('/vault')} onTrade={() => router.push('/swap' as never)} onBrowsePacks={() => router.push('/')} />;
}
