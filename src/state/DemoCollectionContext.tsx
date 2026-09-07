import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

import { createDemoPack, DemoCard, DemoPack, openDemoPack } from '../domain/demoCollection';
import { CollectionStorage, loadDemoCollection, saveDemoCollection } from './collectionStorage';

interface DemoCollectionValue {
  packs: DemoPack[];
  cards: DemoCard[];
  addPack: (expansionId: string) => string;
  openPack: (packId: string) => void;
}

const DemoCollectionContext = createContext<DemoCollectionValue | null>(null);

function mergePacks(current: DemoPack[], stored: DemoPack[]): DemoPack[] {
  const currentIds = new Set(current.map((pack) => pack.id));
  return [...current, ...stored.filter((pack) => !currentIds.has(pack.id))];
}

export function DemoCollectionProvider({ children, storage }: { children: ReactNode; storage?: CollectionStorage }) {
  const [packs, setPacks] = useState<DemoPack[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    loadDemoCollection(storage).then((storedPacks) => {
      if (!active) return;
      setPacks((current) => mergePacks(current, storedPacks));
      setHydrated(true);
    });
    return () => { active = false; };
  }, [storage]);

  useEffect(() => {
    if (!hydrated) return;
    void saveDemoCollection(storage, packs);
  }, [hydrated, packs, storage]);

  const value = useMemo<DemoCollectionValue>(() => ({
    packs,
    cards: packs.flatMap((pack) => pack.revealedCards ?? []),
    addPack: (expansionId) => {
      const pack = createDemoPack(expansionId);
      setPacks((current) => current.some((item) => item.id === pack.id) ? current : [...current, pack]);
      return pack.id;
    },
    openPack: (packId) => {
      setPacks((current) => current.map((pack) => pack.id === packId ? openDemoPack(pack) : pack));
    },
  }), [packs]);

  return <DemoCollectionContext.Provider value={value}>{children}</DemoCollectionContext.Provider>;
}

export function useDemoCollection() {
  const value = useContext(DemoCollectionContext);
  if (!value) throw new Error('useDemoCollection must be used inside DemoCollectionProvider.');
  return value;
}
