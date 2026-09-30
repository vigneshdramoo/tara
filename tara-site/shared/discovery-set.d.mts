export const discoverySetSlug: "three-8ml-promo";
export const discoverySelectionType: "three-8ml-discovery-set";
export const discoverySelectionCount: 3;
export function validateDiscoverySelection(
  configuration: unknown,
  eligibleIds: readonly string[],
): { valid: boolean; scentIds: string[]; error: string };
