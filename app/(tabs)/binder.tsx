import { AppHeader } from '../../src/components/AppHeader';
import { AppScreen } from '../../src/components/AppScreen';
import { EmptyState } from '../../src/components/EmptyState';

export default function BinderScreen() {
  return <AppScreen><AppHeader balance={1000} /><EmptyState eyebrow="BINDER" title="Your pulls will live here" body="Prototype view — no real cards or market values are loaded." /></AppScreen>;
}
