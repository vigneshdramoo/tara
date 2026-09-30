export const discoverySetSlug = "three-8ml-promo";
export const discoverySelectionType = "three-8ml-discovery-set";
export const discoverySelectionCount = 3;

export function validateDiscoverySelection(configuration, eligibleIds) {
  if (
    !configuration ||
    configuration.type !== discoverySelectionType ||
    !Array.isArray(configuration.scentIds)
  ) {
    return {
      valid: false,
      scentIds: [],
      error: "Choose 3 scents to continue.",
    };
  }
  const raw = configuration.scentIds;
  if (raw.some((id) => typeof id !== "string")) {
    return {
      valid: false,
      scentIds: [],
      error: "Choose 3 different scents for your discovery set.",
    };
  }
  const scentIds = [...new Set(raw)].sort();
  if (scentIds.length !== raw.length) {
    return {
      valid: false,
      scentIds,
      error: "Choose 3 different scents for your discovery set.",
    };
  }
  if (scentIds.some((id) => !eligibleIds.includes(id))) {
    return {
      valid: false,
      scentIds,
      error:
        "One selected scent is no longer available. Please choose a replacement.",
    };
  }
  if (scentIds.length !== discoverySelectionCount) {
    return { valid: false, scentIds, error: "Choose 3 scents to continue." };
  }
  return { valid: true, scentIds, error: "" };
}
