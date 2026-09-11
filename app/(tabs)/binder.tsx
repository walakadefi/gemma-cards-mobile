import { BinderScreen as BinderCollectionScreen } from '../../src/features/binder/BinderScreen';
import { useRouter } from 'expo-router';
import { useDemoCollection } from '../../src/state/DemoCollectionContext';

export default function BinderScreen() {
  const router = useRouter();
  const { cards } = useDemoCollection();
  return <BinderCollectionScreen cards={cards} onShip={() => router.push('/vault')} />;
}
