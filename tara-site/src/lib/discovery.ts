import { scents } from "@/content/scents";
import {
  discoverySetSlug,
  discoverySelectionType,
  validateDiscoverySelection,
} from "../../shared/discovery-set.mjs";
export { discoverySetSlug, discoverySelectionType };
export const discoveryDraftKey = "tara-discovery-selection-v1";
export const discoveryHref =
  "/preorder?checkout=three-8ml-promo#secure-checkout";
export type DiscoveryConfiguration = {
  type: typeof discoverySelectionType;
  scentIds: string[];
};
export const eligibleDiscoveryScents = scents.filter(
  (scent) => scent.status === "available" && scent.profile.sampleAvailable,
);
export function validateDiscovery(configuration: unknown) {
  return validateDiscoverySelection(
    configuration,
    eligibleDiscoveryScents.map((scent) => scent.slug),
  );
}
export function discoverySelectionLabel(
  configuration?: DiscoveryConfiguration,
) {
  return (
    configuration?.scentIds
      .map(
        (id) =>
          scents.find((scent) => scent.slug === id)?.name ??
          "Unavailable scent",
      )
      .join(" · ") ?? ""
  );
}
export function discoveryError(item: {
  slug: string;
  configuration?: DiscoveryConfiguration;
}) {
  return item.slug === discoverySetSlug
    ? validateDiscovery(item.configuration).error
    : "";
}
