import { useRouter } from 'expo-router';

import { SwapScreen } from '../src/features/swap/SwapScreen';
import { useDemoCollection } from '../src/state/DemoCollectionContext';

export default function SwapRoute() {
  const router = useRouter();
  const { cards, hydrated } = useDemoCollection();

  return <SwapScreen cards={cards} hydrated={hydrated} onClose={() => router.back()} />;
}
