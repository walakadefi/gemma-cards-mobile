import { useRouter } from 'expo-router';

import { ShopScreen } from '../../src/features/shop/ShopScreen';

export default function ShopRoute() {
  const router = useRouter();
  return <ShopScreen onOpenPack={(id) => router.push(`/pack/${id}`)} />;
}
