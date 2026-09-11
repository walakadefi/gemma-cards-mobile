import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { createDemoPack, DemoCard, DemoPack, openDemoPack } from '../domain/demoCollection';
import { CollectionStorage, loadDemoCollection, saveDemoCollection } from './collectionStorage';

interface DemoCollectionValue {
  hydrated: boolean;
  packs: DemoPack[];
  cards: DemoCard[];
  addPack: (expansionId: string) => string;
  openPack: (packId: string) => void;
  resetCollection: () => void;
}

const DemoCollectionContext = createContext<DemoCollectionValue | null>(null);

function mergePacks(current: DemoPack[], stored: DemoPack[]): DemoPack[] {
  const currentIds = new Set(current.map((pack) => pack.id));
  return [...current, ...stored.filter((pack) => !currentIds.has(pack.id))];
}

export function DemoCollectionProvider({ children, storage }: { children: ReactNode; storage?: CollectionStorage }) {
  const [packs, setPacks] = useState<DemoPack[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const resetDuringHydration = useRef(false);
  const saveQueue = useRef(Promise.resolve());
  const packSequence = useRef(0);

  useEffect(() => {
    let active = true;
    loadDemoCollection(storage).then((storedPacks) => {
      if (!active) return;
      setPacks((current) => resetDuringHydration.current ? current : mergePacks(current, storedPacks));
      setHydrated(true);
    });
    return () => { active = false; };
  }, [storage]);

  useEffect(() => {
    if (!hydrated) return;
    saveQueue.current = saveQueue.current.then(() => saveDemoCollection(storage, packs));
  }, [hydrated, packs, storage]);

  const value = useMemo<DemoCollectionValue>(() => ({
    hydrated,
    packs,
    cards: packs.flatMap((pack) => pack.revealedCards ?? []),
    addPack: (expansionId) => {
      packSequence.current += 1;
      const pack = createDemoPack(expansionId, `demo-${expansionId}-${Date.now().toString(36)}-${packSequence.current}`);
      setPacks((current) => [...current, pack]);
      return pack.id;
    },
    openPack: (packId) => {
      setPacks((current) => current.map((pack) => pack.id === packId ? openDemoPack(pack) : pack));
    },
    resetCollection: () => {
      resetDuringHydration.current = true;
      setPacks([]);
    },
  }), [packs, hydrated]);

  return <DemoCollectionContext.Provider value={value}>{children}</DemoCollectionContext.Provider>;
}

export function useDemoCollection() {
  const value = useContext(DemoCollectionContext);
  if (!value) throw new Error('useDemoCollection must be used inside DemoCollectionProvider.');
  return value;
}
