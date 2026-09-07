import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

import { createDemoPack, DemoCard, DemoPack, revealDemoPack } from '../domain/demoCollection';

interface DemoCollectionValue {
  packs: DemoPack[];
  cards: DemoCard[];
  addPack: (expansionId: string) => string;
  revealPack: (packId: string, selectedIndex: number) => void;
}

const DemoCollectionContext = createContext<DemoCollectionValue | null>(null);

export function DemoCollectionProvider({ children }: { children: ReactNode }) {
  const [packs, setPacks] = useState<DemoPack[]>([]);

  const value = useMemo<DemoCollectionValue>(() => ({
    packs,
    cards: packs.flatMap((pack) => pack.revealedCard ? [pack.revealedCard] : []),
    addPack: (expansionId) => {
      const pack = createDemoPack(expansionId);
      setPacks((current) => current.some((item) => item.id === pack.id) ? current : [...current, pack]);
      return pack.id;
    },
    revealPack: (packId, selectedIndex) => {
      setPacks((current) => current.map((pack) => pack.id === packId ? revealDemoPack(pack, selectedIndex) : pack));
    },
  }), [packs]);

  return <DemoCollectionContext.Provider value={value}>{children}</DemoCollectionContext.Provider>;
}

export function useDemoCollection() {
  const value = useContext(DemoCollectionContext);
  if (!value) throw new Error('useDemoCollection must be used inside DemoCollectionProvider.');
  return value;
}
