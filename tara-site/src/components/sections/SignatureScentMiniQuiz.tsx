"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { QuickAddButton } from "@/components/cart/QuickAddButton";
import { Button } from "@/components/ui/Button";
import { SiteIcon } from "@/components/ui/SiteIcon";
import type { Scent } from "@/types/content";
import { analyticsEvents, trackEvent } from "@/lib/analytics";

type SignatureScentMiniQuizProps = {
  scents: Scent[];
};

type QuestionId = "occasion" | "vibe" | "family";

type QuizOption = {
  label: string;
  value: string;
  weights: Record<string, number>;
};

type QuizQuestion = {
  id: QuestionId;
  prompt: string;
  options: QuizOption[];
};

const quizQuestions: QuizQuestion[] = [
  {
    id: "occasion",
    prompt: "When do you wear fragrance?",
    options: [
      { label: "Work", value: "work", weights: { zephyr: 3, maris: 2, aureya: 1 } },
      { label: "Date", value: "date", weights: { ashoka: 3, eliora: 2, ardor: 2 } },
      { label: "Daily", value: "daily", weights: { aureya: 2, ashoka: 2, maris: 2 } },
      { label: "Special", value: "special", weights: { ardor: 3, eliora: 2, aureya: 1 } },
    ],
  },
  {
    id: "vibe",
    prompt: "What vibe do you want?",
    options: [
      { label: "Luminous", value: "luminous", weights: { aureya: 3, ashoka: 2, zephyr: 1 } },
      { label: "Magnetic", value: "magnetic", weights: { ardor: 3, zephyr: 2, eliora: 2 } },
      { label: "Fresh", value: "fresh", weights: { maris: 3, zephyr: 2 } },
      { label: "Warm", value: "warm", weights: { ardor: 3, eliora: 2, ashoka: 2 } },
    ],
  },
  {
    id: "family",
    prompt: "Preferred scent family?",
    options: [
      { label: "Citrus", value: "citrus", weights: { zephyr: 3, aureya: 1, eliora: 1 } },
      { label: "Floral", value: "floral", weights: { ashoka: 3, aureya: 2, eliora: 2 } },
      { label: "Woods", value: "woods", weights: { maris: 3, ardor: 2, zephyr: 2 } },
      { label: "Amber", value: "amber", weights: { ardor: 3, eliora: 2, ashoka: 1 } },
    ],
  },
];

function scoreAnswers(answers: Partial<Record<QuestionId, QuizOption>>) {
  return Object.values(answers).reduce<Record<string, number>>((scores, option) => {
    if (!option) {
      return scores;
    }

    Object.entries(option.weights).forEach(([slug, points]) => {
      scores[slug] = (scores[slug] ?? 0) + points;
    });

    return scores;
  }, {});
}

export function SignatureScentMiniQuiz({ scents }: SignatureScentMiniQuizProps) {
  const hasTrackedResult = useRef(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Record<QuestionId, QuizOption>>>({});
  const [hasStarted, setHasStarted] = useState(false);
  const currentQuestion = quizQuestions[currentStep];
  const isComplete = quizQuestions.every((question) => answers[question.id]);
  const result = useMemo(() => {
    const scores = scoreAnswers(answers);
    const fallback = scents.find((scent) => scent.slug === "aureya") ?? scents[0];

    return (
      [...scents].sort(
        (left, right) => (scores[right.slug] ?? 0) - (scores[left.slug] ?? 0),
      )[0] ?? fallback
    );
  }, [answers, scents]);

  useEffect(() => {
    if (!isComplete || !result || hasTrackedResult.current) {
      return;
    }

    hasTrackedResult.current = true;
    trackEvent(analyticsEvents.quizComplete, {
      event_category: "engagement",
      quiz_name: "homepage_signature_scent",
      selected_scent: result.slug,
      answer_occasion: answers.occasion?.value,
      answer_vibe: answers.vibe?.value,
      answer_family: answers.family?.value,
    });
    trackEvent(analyticsEvents.quizResultRevealed, {
      event_category: "engagement",
      quiz_name: "homepage_signature_scent",
      selected_scent: result.slug,
    });
  }, [answers, isComplete, result]);

  function selectOption(option: QuizOption) {
    if (!hasStarted) {
      setHasStarted(true);
      trackEvent(analyticsEvents.quizStart, {
        event_category: "engagement",
        quiz_name: "homepage_signature_scent",
      });
    }

    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: option,
    }));

    if (currentStep < quizQuestions.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  }

  function resetQuiz() {
    hasTrackedResult.current = false;
    setAnswers({});
    setCurrentStep(0);
    setHasStarted(false);
  }

  return (
    <div className="overflow-hidden rounded-[1.35rem] border border-black/10 bg-[rgba(255,250,241,0.68)] shadow-[0_24px_90px_rgba(26,51,74,0.10)] sm:rounded-[1.8rem]">
      <div className="border-b border-black/10 p-5 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-gold)]">
            3 Question Scent Match
          </p>
          <p className="text-[10px] uppercase tracking-[0.22em] text-black/42">
            Step {Math.min(currentStep + 1, quizQuestions.length)} / {quizQuestions.length}
          </p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2" aria-hidden="true">
          {quizQuestions.map((question, index) => (
            <span
              key={question.id}
              className={
                index <= currentStep || answers[question.id]
                  ? "h-1 rounded-full bg-[var(--color-gold)]"
                  : "h-1 rounded-full bg-black/10"
              }
            />
          ))}
        </div>
      </div>

      {isComplete && result ? (
        <div className="grid gap-0 lg:grid-cols-[0.44fr_0.56fr]">
          <div className="relative min-h-[320px]">
            <Image
              src={(result.homeVisual ?? result.visual).src}
              alt={(result.homeVisual ?? result.visual).alt}
              fill
              sizes="(min-width: 1024px) 24vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.04),rgba(247,243,235,0.32))]" />
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--color-gold)]">
              Your Match
            </p>
            <h3 className="mt-5 text-[clamp(2.8rem,7vw,5.6rem)] font-medium leading-[0.84] tracking-[-0.065em]">
              We recommend {result.name} for you.
            </h3>
            <p className="mt-6 text-sm leading-7 text-[var(--color-copy)]">
              {result.tagline}. {result.summary}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                result.profile.audienceLabel,
                result.launchPrice ?? result.price,
                result.mood[0],
              ].map((badge) =>
                badge ? (
                  <span
                    key={badge}
                    className="rounded-full border border-black/10 bg-[rgba(247,243,235,0.72)] px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-black/58"
                  >
                    {badge}
                  </span>
                ) : null,
              )}
            </div>
            <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
              <QuickAddButton
                slug={result.slug}
                ariaLabel={`Add ${result.name} quiz recommendation to cart`}
                trackingLocation="homepage_signature_quiz_result"
              />
              <Button
                href={`/scents/${result.slug}`}
                variant="secondary"
                size="sm"
                trackingLocation="homepage_signature_quiz_result"
                trackingEventName={analyticsEvents.quizResultProductClick}
                trackingParams={{ selected_scent: result.slug }}
              >
                Explore {result.name}
              </Button>
            </div>
            <button
              type="button"
              onClick={resetQuiz}
              className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/42 transition duration-300 hover:text-[var(--color-gold)]"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-8">
          <h3 className="text-[clamp(2.4rem,6vw,4.8rem)] font-medium leading-[0.88] tracking-[-0.06em]">
            {currentQuestion.prompt}
          </h3>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {currentQuestion.options.map((option) => {
              const selected = answers[currentQuestion.id]?.value === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => selectOption(option)}
                  aria-pressed={selected}
                  className="group flex min-h-20 items-center justify-between gap-4 border border-black/10 bg-[rgba(247,243,235,0.54)] px-5 py-4 text-left transition duration-300 hover:border-[rgba(202,158,91,0.58)] hover:bg-[rgba(202,158,91,0.10)] focus:outline-none focus-visible:border-[var(--color-gold)]"
                >
                  <span className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-onyx-black)]">
                    {option.label}
                  </span>
                  <SiteIcon
                    name="arrowUpRight"
                    className="h-4 w-4 text-[var(--color-gold)] opacity-60 transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                  />
                </button>
              );
            })}
          </div>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-5">
            <p className="text-xs leading-6 text-black/52">
              Prefer the full ritual? The detailed Find Your Light quiz still gives a
              richer scent reading.
            </p>
            <Link
              href="/quiz"
              className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--color-gold)] transition duration-300 hover:text-[var(--color-amber)]"
            >
              Open Full Quiz
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
