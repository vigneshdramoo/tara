import type { Scent, ScentFilterSegment } from "@/types/content";

export const scentMoodOptions = [
  { id: "fresh-clean", label: "Fresh and clean", terms: ["fresh", "citrus", "mineral", "clean", "cool", "salt"] },
  { id: "soft-intimate", label: "Soft and intimate", terms: ["soft", "intimate", "skin-close", "floral", "musk", "tender"] },
  { id: "warm-comforting", label: "Warm and comforting", terms: ["warm", "cream", "gourmand", "amber", "almond", "tea"] },
  { id: "dark-magnetic", label: "Dark and magnetic", terms: ["dark", "magnetic", "night", "spice", "woody", "nocturnal"] },
  { id: "everyday-signature", label: "Everyday signature", terms: ["daily", "work", "morning", "office", "signature", "composed"] },
  { id: "evening-statement", label: "Evening statement", terms: ["evening", "night", "after-dark", "date", "magnetic", "commanding"] },
] as const;

export type ScentMoodId = (typeof scentMoodOptions)[number]["id"];
export type ScentSort = "recommended" | "newest" | "price-low" | "price-high";

function searchableScent(scent: Scent) {
  return [
    scent.profile.family,
    scent.profile.temperature,
    scent.profile.sweetness,
    scent.profile.presence,
    scent.line,
    ...scent.mood,
    ...scent.wear,
    ...scent.notes.top,
    ...scent.notes.heart,
    ...scent.notes.base,
  ].join(" ").toLowerCase();
}

export function moodScore(scent: Scent, moodId?: string | null) {
  const mood = scentMoodOptions.find((option) => option.id === moodId);
  if (!mood) return 0;
  const haystack = searchableScent(scent);
  return mood.terms.reduce(
    (score, term) => score + (haystack.includes(term.toLowerCase()) ? 1 : 0),
    0,
  );
}

function includesAny(value: string, needles: readonly string[] = []) {
  const normalized = value.toLowerCase();
  return needles.some((needle) => normalized.includes(needle.toLowerCase()));
}

function listIncludesAny(values: readonly string[], needles: readonly string[] = []) {
  return values.some((value) => includesAny(value, needles));
}

export function scentMatchesSegment(scent: Scent, segment: ScentFilterSegment) {
  if (!segment.criteria) return true;
  const criteria = segment.criteria;
  return [
    criteria.familyIncludes ? includesAny(scent.profile.family, criteria.familyIncludes) : false,
    criteria.lineIncludes ? includesAny(scent.line, criteria.lineIncludes) : false,
    criteria.moodIncludes ? listIncludesAny(scent.mood, criteria.moodIncludes) : false,
    criteria.wearIncludes ? listIncludesAny(scent.wear, criteria.wearIncludes) : false,
    criteria.temperature?.includes(scent.profile.temperature) ?? false,
    criteria.sweetness?.includes(scent.profile.sweetness) ?? false,
    criteria.presence?.includes(scent.profile.presence) ?? false,
  ].some(Boolean);
}

export function orderCatalogueScents(
  scents: Scent[],
  moodId: string | null,
  sort: ScentSort,
) {
  return [...scents].sort((a, b) => {
    if (sort === "price-low")
      return (a.priceInSen ?? Number.MAX_SAFE_INTEGER) - (b.priceInSen ?? Number.MAX_SAFE_INTEGER);
    if (sort === "price-high")
      return (b.priceInSen ?? 0) - (a.priceInSen ?? 0);
    if (sort === "newest") return Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
    const moodDifference = moodScore(b, moodId) - moodScore(a, moodId);
    return moodDifference || Number(Boolean(b.isNew)) - Number(Boolean(a.isNew));
  });
}
