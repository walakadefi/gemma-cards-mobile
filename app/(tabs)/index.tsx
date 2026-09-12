import { useRouter } from 'expo-router';

import { ShopScreen } from '../../src/features/shop/ShopScreen';
import { useDemoCollection } from '../../src/state/DemoCollectionContext';

export default function ShopRoute() {
  const router = useRouter();
  const { cards } = useDemoCollection();
  return <ShopScreen onOpenPack={(id) => router.push(`/pack/${id}`)} recentCards={[...cards].reverse().slice(0, 5)} />;
}
