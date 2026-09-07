import { useRouter } from 'expo-router';
import { MyPacksScreen } from '../../src/features/packs/MyPacksScreen';
import { useDemoCollection } from '../../src/state/DemoCollectionContext';

export default function PacksScreen() {
  const router = useRouter();
  const { packs } = useDemoCollection();
  return <MyPacksScreen packs={packs} onOpen={(id) => router.push(`/reveal/${id}`)} />;
}
