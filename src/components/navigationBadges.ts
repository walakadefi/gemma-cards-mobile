export const unopenedPackBadge = (sealedPackCount: number): string | undefined => {
  if (sealedPackCount <= 0) return undefined;
  return sealedPackCount > 9 ? '9+' : String(sealedPackCount);
};
