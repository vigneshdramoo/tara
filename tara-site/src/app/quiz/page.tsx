import type { Metadata } from "next";

import { FindYourLightQuiz } from "@/components/forms/FindYourLightQuiz";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Find Your Light Scent Quiz",
  description:
    "Take TARA's Find Your Light quiz and discover whether your olfactive portrait is Aureya, Zephyr, Maris, Eliora, Ashoka, Ardor, THEON, or KAMEIRA.",
  path: "/quiz",
  socialTitle: "Find Your Light - TARA Scent Quiz",
  socialImage: {
    path: "/og/tara-home.jpg",
    alt: "TARA fragrance bottles with dark editorial styling.",
  },
});

export default function QuizPage() {
  return <FindYourLightQuiz />;
}
