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
