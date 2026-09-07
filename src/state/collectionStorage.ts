import AsyncStorage from '@react-native-async-storage/async-storage';

import { DemoCard, DemoPack, RevealVerification } from '../domain/demoCollection';

export interface CollectionStorage {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<unknown>;
}

const COLLECTION_STORAGE_KEY = '@gemma/demo-collection';
const COLLECTION_STORAGE_VERSION = 1;

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

function isDemoCard(value: unknown): value is DemoCard {
  if (!value || typeof value !== 'object') return false;
  const card = value as Partial<DemoCard>;
  return isString(card.id)
    && isString(card.name)
    && isString(card.setName)
    && ['Common', 'Rare', 'Illustration Rare'].includes(card.rarity ?? '')
    && typeof card.marketValueCents === 'number'
    && Number.isFinite(card.marketValueCents);
}

function isVerification(value: unknown): value is RevealVerification {
  if (!value || typeof value !== 'object') return false;
  const verification = value as Partial<RevealVerification>;
  return isString(verification.commitment)
    && isString(verification.revealedSeed)
    && verification.cardCount === 10
    && verification.algorithmVersion === 'demo-pack-v2'
    && isString(verification.previousChainFingerprint);
}

function isDemoPack(value: unknown): value is DemoPack {
  if (!value || typeof value !== 'object') return false;
  const pack = value as Partial<DemoPack>;
  if (!isString(pack.id) || !isString(pack.expansionId) || !isString(pack.commitment)) return false;
  if (pack.status === 'sealed') return pack.revealedCards === undefined && pack.verification === undefined;
  return pack.status === 'revealed'
    && Array.isArray(pack.revealedCards)
    && pack.revealedCards.length === 10
    && pack.revealedCards.every(isDemoCard)
    && isVerification(pack.verification);
}

export async function loadDemoCollection(storage: CollectionStorage = AsyncStorage): Promise<DemoPack[]> {
  try {
    const raw = await storage.getItem(COLLECTION_STORAGE_KEY);
    if (!raw) return [];
    const payload: unknown = JSON.parse(raw);
    if (!payload || typeof payload !== 'object') return [];
    const candidate = payload as { version?: unknown; packs?: unknown };
    if (candidate.version !== COLLECTION_STORAGE_VERSION || !Array.isArray(candidate.packs)) return [];
    return candidate.packs.every(isDemoPack) ? candidate.packs : [];
  } catch {
    return [];
  }
}

export async function saveDemoCollection(storage: CollectionStorage = AsyncStorage, packs: DemoPack[]): Promise<void> {
  try {
    await storage.setItem(COLLECTION_STORAGE_KEY, JSON.stringify({ version: COLLECTION_STORAGE_VERSION, packs }));
  } catch {
    // Local persistence must never interrupt the prototype flow.
  }
}
