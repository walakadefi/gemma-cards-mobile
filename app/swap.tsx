import { useRouter } from 'expo-router';

import { SwapScreen } from '../src/features/swap/SwapScreen';
import { useDemoCollection } from '../src/state/DemoCollectionContext';

export default function SwapRoute() {
  const router = useRouter();
  const { cards } = useDemoCollection();

  return <SwapScreen cards={cards} onClose={() => router.back()} />;
}
