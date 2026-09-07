import { useRouter } from 'expo-router';

import { ProfileScreen } from '../src/features/profile/ProfileScreen';
import { useDemoCollection } from '../src/state/DemoCollectionContext';

export default function ProfileRoute() {
  const router = useRouter();
  const { packs, cards } = useDemoCollection();

  return <ProfileScreen balance={1000} packs={packs} cards={cards} onClose={() => router.back()} />;
}
