import { scents } from "@/content/scents";

export function getScentBySlug(slug: string) {
  return scents.find((scent) => scent.slug === slug);
}

export function getAvailableScents() {
  return scents.filter((scent) => scent.status === "available");
}

export function getUpcomingScents() {
  return scents.filter((scent) => scent.status === "upcoming");
}

export function getExclusiveScents() {
  return scents.filter((scent) => scent.status === "exclusive");
}

export { scents };

// Homepage merchandising only; retain the canonical order for the remaining scents.
export const latestLaunchSlugs = ["theon", "kameira"] as const;
export function getLatestLaunches() {
  return latestLaunchSlugs.flatMap((slug) => {
    const scent = getScentBySlug(slug);
    return scent && scent.status === "available" ? [scent] : [];
  });
}
export function isLatestLaunch(slug: string) {
  return latestLaunchSlugs.some((launch) => launch === slug);
}
export function getHomepageScents() {
  return [
    ...getLatestLaunches(),
    ...getAvailableScents().filter((scent) => !isLatestLaunch(scent.slug)),
  ];
}
