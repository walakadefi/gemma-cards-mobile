import { useRouter } from 'expo-router';

import { ShopScreen } from '../../src/features/shop/ShopScreen';
import { useDemoCollection } from '../../src/state/DemoCollectionContext';

export default function ShopRoute() {
  const router = useRouter();
  const { cards, packs } = useDemoCollection();
  const sealedPackCount = packs.filter((pack) => pack.status === 'sealed').length;
  return <ShopScreen onOpenPack={(id) => router.push(`/pack/${id}`)} recentCards={[...cards].reverse().slice(0, 5)} sealedPackCount={sealedPackCount} onViewMyPacks={() => router.push('/packs')} />;
}
