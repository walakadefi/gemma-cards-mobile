import { BinderScreen as BinderCollectionScreen } from '../../src/features/binder/BinderScreen';
import { useDemoCollection } from '../../src/state/DemoCollectionContext';

export default function BinderScreen() {
  const { cards } = useDemoCollection();
  return <BinderCollectionScreen cards={cards} />;
}
