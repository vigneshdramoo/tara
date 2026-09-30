"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  calculateFindYourLightResult,
  findYourLightProfiles,
  findYourLightQuestions,
  type FindYourLightOption,
  type FindYourLightScent,
} from "@/content/findYourLight";
import {
  analyticsEvents,
  trackCtaClick,
  trackEvent,
  trackFormStart,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { focusQuizHeading } from "@/lib/quiz-transition";

type Phase = "landing" | "quiz" | "results";

type QuizLeadStatus = "idle" | "submitting" | "success" | "error";

type FindYourLightAnswer = {
  questionId: number;
  optionLetter: string;
  optionText: string;
  scent: FindYourLightScent;
};

const allQuizScents: FindYourLightScent[] = [
  "aureya",
  "zephyr",
  "maris",
  "eliora",
  "ashoka",
  "ardor",
  "theon",
  "kameira",
];

const leadFieldClassName =
  "w-full border-x-0 border-b border-t-0 border-black/14 bg-transparent px-0 py-4 text-sm text-[var(--color-onyx-black)] outline-none transition duration-300 placeholder:text-black/32 focus:border-[var(--color-gold)]";

function createEmptyScores(): Record<FindYourLightScent, number> {
  return {
    zephyr: 0,
    aureya: 0,
    eliora: 0,
    maris: 0,
    ashoka: 0,
    ardor: 0,
    theon: 0,
    kameira: 0,
  };
}

function calculateScoresFromAnswers(answers: FindYourLightAnswer[]) {
  return answers.reduce<Record<FindYourLightScent, number>>((accumulator, answer) => {
    accumulator[answer.scent] += 1;
    return accumulator;
  }, createEmptyScores());
}

type QuizCtaProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary" | "ghost";
  location: string;
  result?: string;
};

function QuizCta({ href, label, variant = "primary", location, result }: QuizCtaProps) {
  const isDiscoverySetCta = href.includes("three-8ml-promo");
  const isResultProductCta = location === "quiz_result" && !isDiscoverySetCta;

  return (
    <Link
      href={href}
      onClick={() =>
        trackCtaClick({
          eventName: isDiscoverySetCta
            ? analyticsEvents.discoverySetClick
            : isResultProductCta
              ? analyticsEvents.quizResultProductClick
              : undefined,
          linkLabel: label,
          linkLocation: location,
          linkUrl: href,
          linkType: "internal",
          offer_type: isDiscoverySetCta ? "discovery_set" : "product",
          quiz_result: result,
        })
      }
      className={cn(
        "inline-flex min-h-12 w-full items-center justify-center rounded-full border px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.22em] transition duration-300 sm:w-auto",
        variant === "primary" &&
          "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-onyx-black)] hover:border-[var(--color-amber)] hover:bg-[var(--color-amber)]",
        variant === "secondary" &&
          "border-black/14 bg-transparent text-[var(--color-onyx-black)] hover:border-[rgba(202,158,91,0.58)] hover:bg-[rgba(202,158,91,0.10)]",
        variant === "ghost" &&
          "border-transparent bg-transparent text-black/54 hover:text-[var(--color-gold)]",
      )}
    >
      {label}
    </Link>
  );
}

export function FindYourLightQuiz() {
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTrackedLeadStart = useRef(false);
  const transitionLock = useRef(false);
  const cancelScroll = useRef<(() => void) | null>(null);
  const quizRoot = useRef<HTMLElement>(null);
  const toolbar = useRef<HTMLDivElement>(null);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const landingHeading = useRef<HTMLHeadingElement>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionRevision, setTransitionRevision] = useState(0);
  const [phase, setPhase] = useState<Phase>("landing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<FindYourLightAnswer[]>([]);
  const [scores, setScores] = useState<Record<FindYourLightScent, number>>(
    createEmptyScores,
  );
  const [result, setResult] = useState<FindYourLightScent>("theon");
  const [leadStatus, setLeadStatus] = useState<QuizLeadStatus>("idle");
  const [leadMessage, setLeadMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const question = findYourLightQuestions[currentQuestionIndex];
  const progressPercent =
    phase === "results"
      ? 100
      : ((currentQuestionIndex + 1) / findYourLightQuestions.length) * 100;
  const resultProfile = findYourLightProfiles[result];
  const resultUrl = resultProfile.productHref;

  function clearCompletionTimer() {
    if (!completionTimer.current) {
      return;
    }

    clearTimeout(completionTimer.current);
    completionTimer.current = null;
  }

  useEffect(() => {
    const root = quizRoot.current;
    const siteHeader = document.querySelector("header");
    const quizToolbar = toolbar.current;
    let scrollParent = root?.parentElement;
    while (scrollParent && scrollParent !== document.body) {
      if (/(auto|scroll|hidden)/.test(getComputedStyle(scrollParent).overflowY)) break;
      scrollParent = scrollParent.parentElement;
    }
    const isEmbedded = scrollParent && scrollParent !== document.body;
    const updateSpacing = () => {
      root?.style.setProperty(
        "--quiz-site-header",
        `${siteHeader?.getBoundingClientRect().height ?? 0}px`,
      );
      // An embedded toolbar sticks to its own scrollport, not below the outer header.
      root?.style.setProperty(
        "--quiz-sticky-top",
        `${isEmbedded ? 0 : siteHeader?.getBoundingClientRect().height ?? 0}px`,
      );
      root?.style.setProperty(
        "--quiz-toolbar",
        `${quizToolbar?.getBoundingClientRect().height ?? 0}px`,
      );
    };
    updateSpacing();
    const observer = new ResizeObserver(updateSpacing);
    if (siteHeader) observer.observe(siteHeader);
    if (quizToolbar) observer.observe(quizToolbar);
    return () => observer.disconnect();
  }, [phase]);

  useEffect(() => {
    if (!transitionLock.current) return;
    const target = phase === "quiz"
      ? questionHeading.current
      : phase === "results"
        ? resultHeading.current
        : landingHeading.current;
    if (!target) return;
    const cancel = focusQuizHeading(target, () => {
      transitionLock.current = false;
      setIsTransitioning(false);
    });
    cancelScroll.current = cancel;
    return cancel;
  }, [phase, currentQuestionIndex, transitionRevision]);

  useEffect(() => {
    return () => {
      cancelScroll.current?.();
      if (completionTimer.current) {
        clearTimeout(completionTimer.current);
      }
    };
  }, []);

  function lockTransition() {
    cancelScroll.current?.();
    transitionLock.current = true;
    setIsTransitioning(true);
  }

  function resetQuizState() {
    clearCompletionTimer();
    lockTransition();
    // Restart on question 1 still needs a fresh focus/scroll lifecycle.
    setTransitionRevision((revision) => revision + 1);
    setAnswers([]);
    setScores(createEmptyScores());
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setResult("theon");
    setLeadStatus("idle");
    setLeadMessage("");
    setCopyMessage("");
    hasTrackedLeadStart.current = false;
  }

  function beginQuiz() {
    resetQuizState();
    setPhase("quiz");
    trackEvent(analyticsEvents.quizStart, {
      event_category: "lead",
      quiz_name: "find_your_light",
      question_count: findYourLightQuestions.length,
    });
  }

  function restartQuiz() {
    beginQuiz();
    trackEvent("quiz_restart", {
      event_category: "lead",
      quiz_name: "find_your_light",
    });
  }

  function closeQuiz() {
    resetQuizState();
    setPhase("landing");
  }

  function completeQuiz(finalAnswers: FindYourLightAnswer[]) {
    const finalScores = calculateScoresFromAnswers(finalAnswers);
    const calculatedResult = calculateFindYourLightResult(finalScores);

    setScores(finalScores);
    setResult(calculatedResult);
    setPhase("results");
    setSelectedOption(null);
    trackEvent(analyticsEvents.quizComplete, {
      event_category: "lead",
      quiz_name: "find_your_light",
      quiz_result: calculatedResult,
      aureya_score: finalScores.aureya,
      zephyr_score: finalScores.zephyr,
      maris_score: finalScores.maris,
      eliora_score: finalScores.eliora,
      ashoka_score: finalScores.ashoka,
      ardor_score: finalScores.ardor,
      theon_score: finalScores.theon,
      kameira_score: finalScores.kameira,
    });
    trackEvent(analyticsEvents.quizResultRevealed, {
      event_category: "lead",
      quiz_name: "find_your_light",
      quiz_result: calculatedResult,
    });
  }

  function goBack() {
    if (currentQuestionIndex === 0) {
      return;
    }

    clearCompletionTimer();
    lockTransition();
    const previousQuestionIndex = currentQuestionIndex - 1;
    const retainedAnswers = answers.slice(0, previousQuestionIndex);

    setAnswers(retainedAnswers);
    setScores(calculateScoresFromAnswers(retainedAnswers));
    setCurrentQuestionIndex(previousQuestionIndex);
    setSelectedOption(null);
  }

  function goBackToLastQuestion() {
    clearCompletionTimer();
    lockTransition();
    const lastQuestionIndex = findYourLightQuestions.length - 1;
    const retainedAnswers = answers.slice(0, lastQuestionIndex);

    setAnswers(retainedAnswers);
    setScores(calculateScoresFromAnswers(retainedAnswers));
    setCurrentQuestionIndex(lastQuestionIndex);
    setSelectedOption(null);
    setPhase("quiz");
  }

  function chooseOption(option: FindYourLightOption) {
    if (transitionLock.current || selectedOption) {
      return;
    }

    // Synchronous guard protects the first selection even before React commits disabled.
    lockTransition();
    clearCompletionTimer();

    const nextAnswers = [
      ...answers.slice(0, currentQuestionIndex),
      {
        questionId: question.id,
        optionLetter: option.letter,
        optionText: option.text,
        scent: option.scent,
      },
    ];
    const nextScores = calculateScoresFromAnswers(nextAnswers);

    setSelectedOption(option.letter);
    setAnswers(nextAnswers);
    setScores(nextScores);

    completionTimer.current = setTimeout(() => {
      if (currentQuestionIndex === findYourLightQuestions.length - 1) {
        completeQuiz(nextAnswers);
        return;
      }

      setCurrentQuestionIndex((current) => current + 1);
      setSelectedOption(null);
      completionTimer.current = null;
    }, 420);
  }

  function handleLeadStart() {
    if (hasTrackedLeadStart.current) {
      return;
    }

    hasTrackedLeadStart.current = true;
    trackFormStart({
      formName: "tara-quiz-lead",
      formLocation: "find_your_light_optional_result_save",
    });
  }

  async function submitLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "").trim();
    const mobile = String(formData.get("mobile") ?? "").trim();

    if (!email && !mobile) {
      setLeadStatus("error");
      setLeadMessage("Add an email or WhatsApp number only if you want us to save this result.");
      return;
    }

    setLeadStatus("submitting");
    setLeadMessage("");

    const body = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      body.append(key, String(value));
    }

    body.set("quiz_result", resultProfile.name);
    body.set("quiz_result_slug", result);
    body.set("result_url", resultUrl);
    body.set("scores", JSON.stringify(scores));
    body.set(
      "submitted_at",
      new Date().toLocaleString("en-MY", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Kuala_Lumpur",
      }),
    );

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error("Quiz lead submission failed");
      }

      trackEvent(analyticsEvents.quizLeadSubmit, {
        event_category: "lead",
        form_name: "tara-quiz-lead",
        quiz_name: "find_your_light",
        quiz_result: result,
        contact_type: email && mobile ? "email_mobile" : email ? "email" : "mobile",
      });

      setLeadStatus("success");
      setLeadMessage("Saved. We will keep your scent result ready for future recommendations.");
    } catch {
      setLeadStatus("error");
      setLeadMessage("Your result did not save. You can still copy the link or continue shopping.");
    }
  }

  async function copyResultLink() {
    const absoluteResultUrl =
      typeof window === "undefined" ? resultUrl : `${window.location.origin}${resultUrl}`;

    try {
      await navigator.clipboard.writeText(absoluteResultUrl);
      setCopyMessage("Copied result link.");
      trackEvent("quiz_result_copy", {
        event_category: "engagement",
        quiz_name: "find_your_light",
        quiz_result: result,
        result_url: absoluteResultUrl,
      });
    } catch {
      setCopyMessage(`Copy this link: ${absoluteResultUrl}`);
    }
  }

  return (
    <section ref={quizRoot} className="relative isolate overflow-clip bg-[var(--color-ivory)] text-[var(--color-onyx-black)]">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_5%,rgba(202,158,91,0.18),transparent_30%),radial-gradient(circle_at_12%_72%,rgba(202,158,91,0.11),transparent_30%),linear-gradient(180deg,#fffaf1_0%,var(--color-ivory)_52%,#efe7d8_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.18] [background-image:linear-gradient(rgba(10,10,10,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(10,10,10,0.06)_1px,transparent_1px)] [background-size:64px_64px]" />

      {phase === "landing" ? (
        <div className="mx-auto grid min-h-[calc(100svh-73px)] w-full max-w-7xl place-items-center px-4 py-16 sm:min-h-[calc(100svh-83px)] sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.36em] text-[var(--color-gold)]">
              TARA Olfactive Portrait
            </p>
            <h1
              ref={landingHeading}
              tabIndex={-1}
              style={{ scrollMarginTop: "calc(var(--quiz-site-header, 0px) + 24px)" }}
              className="mt-7 font-editorial text-[clamp(4rem,12vw,10rem)] font-medium leading-[0.78] tracking-[-0.075em] text-balance">
              Find your light.
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-black/66 sm:text-xl sm:leading-9">
              Eight questions. One quiet pattern behind the scent your body
              already recognizes - from Aureya and Zephyr to warm tea
              gourmand THEON and warm gourmand KAMEIRA.
            </p>
            <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 text-[10px] uppercase tracking-[0.22em] text-black/54 sm:grid-cols-4 lg:grid-cols-8">
              {allQuizScents.map((scent) => (
                <span
                  key={scent}
                  className="rounded-full border border-[rgba(202,158,91,0.30)] bg-[rgba(255,250,241,0.62)] px-3 py-3"
                >
                  {findYourLightProfiles[scent].name}
                </span>
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={beginQuiz}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[var(--color-gold)] bg-[var(--color-gold)] px-7 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-onyx-black)] transition duration-300 hover:border-[var(--color-amber)] hover:bg-[var(--color-amber)] sm:w-auto"
              >
                Begin The Journey
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {phase === "quiz" ? (
        <div className="mx-auto flex min-h-[calc(100svh-73px)] w-full max-w-5xl flex-col px-4 py-8 sm:min-h-[calc(100svh-83px)] sm:px-6 lg:px-8">
          <div ref={toolbar} style={{ top: "var(--quiz-sticky-top, 0px)" }} className="sticky top-[73px] z-10 -mx-4 border-b border-black/10 bg-[rgba(247,243,235,0.92)] px-4 py-4 backdrop-blur-xl sm:top-[83px] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-gold)]">
                Find Your Light
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.24em]">
                {currentQuestionIndex > 0 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="text-black/54 transition duration-300 hover:text-[var(--color-onyx-black)]"
                  >
                    Back
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={restartQuiz}
                  className="text-black/54 transition duration-300 hover:text-[var(--color-onyx-black)]"
                >
                  Restart
                </button>
                <button
                  type="button"
                  onClick={closeQuiz}
                  className="text-black/44 transition duration-300 hover:text-[var(--color-onyx-black)]"
                >
                  Close
                </button>
              </div>
            </div>
            <div
              role="progressbar"
              aria-label="Quiz progress"
              aria-valuenow={currentQuestionIndex + 1}
              aria-valuemin={1}
              aria-valuemax={findYourLightQuestions.length}
              className="mt-4 h-px overflow-hidden rounded-full bg-black/10"
            >
              <div
                className="h-full rounded-full bg-[var(--color-gold)] transition-[width] duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-1 items-center py-10 sm:py-14">
            <div className="w-full">
              <p id="quiz-question-number" className="font-editorial text-base text-[var(--color-gold)]">
                {String(currentQuestionIndex + 1).padStart(2, "0")} /{" "}
                {String(findYourLightQuestions.length).padStart(2, "0")}
              </p>
              <h2
                key={`${question.id}-${transitionRevision}`}
                ref={questionHeading}
                tabIndex={-1}
                aria-describedby="quiz-question-number"
                style={{ scrollMarginTop: "calc(var(--quiz-site-header, 0px) + var(--quiz-toolbar, 0px) + 64px)" }}
                className="mt-5 max-w-4xl font-editorial text-[clamp(2.25rem,7vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.055em] text-balance">
                {question.text}
              </h2>

              <div aria-busy={isTransitioning} className="mt-9 grid gap-3">
                {question.options.map((option) => {
                  const isSelected = selectedOption === option.letter;

                  return (
                    <button
                      key={option.letter}
                      type="button"
                      aria-pressed={isSelected}
                      disabled={isTransitioning}
                      onClick={() => chooseOption(option)}
                      className={cn(
                        "group grid gap-4 rounded-[1.35rem] border border-black/10 bg-[rgba(255,250,241,0.72)] p-5 text-left shadow-[0_16px_60px_rgba(10,10,10,0.045)] transition duration-300 sm:grid-cols-[3rem_1fr] sm:items-start sm:p-6",
                        "hover:-translate-y-0.5 hover:border-[rgba(202,158,91,0.54)] hover:bg-[rgba(202,158,91,0.10)]",
                        isSelected &&
                          "border-[rgba(202,158,91,0.72)] bg-[rgba(202,158,91,0.12)]",
                        selectedOption && !isSelected && "opacity-45",
                        isTransitioning && !selectedOption && "opacity-60",
                      )}
                    >
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(202,158,91,0.36)] font-editorial text-lg text-[var(--color-gold)]">
                        {option.letter}
                      </span>
                      <span className="text-base leading-8 text-black/72 sm:text-lg">
                        {option.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {phase === "results" ? (
        <div className="mx-auto grid min-h-[calc(100svh-73px)] w-full max-w-7xl gap-10 px-4 py-14 sm:min-h-[calc(100svh-83px)] sm:px-6 lg:grid-cols-[0.82fr_1fr] lg:items-center lg:px-8">
          <Link
            href={resultProfile.productHref}
            onClick={() =>
              trackCtaClick({
                eventName: analyticsEvents.quizResultProductClick,
                linkLabel: `${resultProfile.name} result image`,
                linkLocation: "quiz_result",
                linkUrl: resultProfile.productHref,
                linkType: "internal",
                quiz_result: result,
              })
            }
            className="relative order-2 mx-auto flex min-h-[24rem] w-full max-w-md items-center justify-center overflow-hidden rounded-[2rem] border border-[rgba(202,158,91,0.28)] bg-[rgba(255,250,241,0.74)] p-8 shadow-[0_28px_100px_rgba(10,10,10,0.10)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(202,158,91,0.54)] lg:order-1"
            aria-label={`Explore ${resultProfile.name} scent details`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(202,158,91,0.24),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.22),transparent)]" />
            <Image
              src={resultProfile.image}
              alt={`${resultProfile.name} perfume bottle for your Find Your Light result.`}
              width={1122}
              height={1402}
              priority
              className="relative z-10 h-auto max-h-[32rem] w-[72%] object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.42)]"
            />
          </Link>

          <div className="order-1 lg:order-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--color-gold)]">
                Your Olfactive Portrait
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.24em]">
                <button
                  type="button"
                  onClick={goBackToLastQuestion}
                  className="text-black/48 transition duration-300 hover:text-[var(--color-onyx-black)]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={restartQuiz}
                  className="text-black/48 transition duration-300 hover:text-[var(--color-onyx-black)]"
                >
                  Restart
                </button>
              </div>
            </div>

            {resultProfile.number ? (
              <p className="mt-5 text-xs uppercase tracking-[0.24em] text-[var(--color-gold)]">
                No. {resultProfile.number}
              </p>
            ) : null}
            <h2
              ref={resultHeading}
              tabIndex={-1}
              style={{ scrollMarginTop: "calc(var(--quiz-site-header, 0px) + 24px)" }}
              className="mt-6 font-editorial text-[clamp(3.9rem,12vw,8.5rem)] font-medium leading-[0.78] tracking-[-0.075em]">
              Your scent is{" "}
              <Link
                href={resultProfile.productHref}
                className="transition duration-300 hover:text-[var(--color-gold)]"
              >
                {resultProfile.name}.
              </Link>
            </h2>
            <p className="mt-5 font-editorial text-3xl italic tracking-[-0.03em] text-black/82 sm:text-5xl">
              {resultProfile.tagline}
            </p>
            <p className="mt-7 max-w-2xl text-base leading-8 text-black/66 sm:text-lg sm:leading-9">
              {resultProfile.description}
            </p>

            <div className="mt-8 grid gap-px overflow-hidden rounded-[1.4rem] border border-black/10 bg-black/10 sm:grid-cols-3">
              {[
                ["Scent family", resultProfile.family],
                ["Mood", resultProfile.mood],
                ["Occasion", resultProfile.occasion],
              ].map(([label, value]) => (
                <div key={label} className="bg-[rgba(255,250,241,0.78)] p-5">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--color-gold)]">
                    {label}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-black/70">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-[1.4rem] border border-[rgba(202,158,91,0.28)] bg-[rgba(202,158,91,0.08)] p-5">
              <p className="text-[10px] uppercase tracking-[0.26em] text-[var(--color-gold)]">
                Why this result
              </p>
              <p className="mt-3 text-sm leading-7 text-black/66">
                {resultProfile.reason}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {resultProfile.keyNotes.map((note) => (
                <span
                  key={note}
                  className="rounded-full border border-[rgba(202,158,91,0.32)] bg-[rgba(202,158,91,0.08)] px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-[var(--color-gold)]"
                >
                  {note}
                </span>
              ))}
            </div>

            <div className="mt-10 grid gap-3 sm:flex sm:flex-wrap">
              <QuizCta
                href={resultProfile.primaryCta.href}
                label={resultProfile.primaryCta.label}
                location="quiz_result"
                result={result}
              />
              <QuizCta
                href={resultProfile.secondaryCta.href}
                label={resultProfile.secondaryCta.label}
                variant="secondary"
                location="quiz_result"
                result={result}
              />
              <QuizCta
                href={resultProfile.productHref}
                label="Read full scent notes"
                variant="ghost"
                location="quiz_result"
                result={result}
              />
            </div>

            <div className="mt-8 grid gap-4 rounded-[1.6rem] border border-black/10 bg-[rgba(255,250,241,0.62)] p-5 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                  Keep this result
                </p>
                <p className="mt-2 text-sm leading-6 text-black/56">
                  Copy the product link now, or optionally save it with TARA for
                  future scent advice.
                </p>
              </div>
              <button
                type="button"
                onClick={copyResultLink}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-black/14 px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--color-onyx-black)] transition duration-300 hover:border-[var(--color-gold)] hover:bg-[rgba(202,158,91,0.10)]"
              >
                Copy Result Link
              </button>
              <p aria-live="polite" className="text-sm leading-6 text-black/54 sm:col-span-2">
                {copyMessage}
              </p>
            </div>

            <form
              name="tara-quiz-lead"
              method="POST"
              action="/"
              data-netlify="true"
              netlify-honeypot="bot-field"
              onSubmit={submitLead}
              onFocusCapture={handleLeadStart}
              onChangeCapture={handleLeadStart}
              className="mt-6 rounded-[1.6rem] border border-[rgba(202,158,91,0.28)] bg-[rgba(255,250,241,0.74)] p-5 shadow-[0_18px_70px_rgba(10,10,10,0.07)]"
            >
              <input type="hidden" name="form-name" value="tara-quiz-lead" />
              <input type="hidden" name="bot-field" />
              <input
                type="hidden"
                name="subject"
                value="New TARA quiz lead from %{formName} (%{submissionId})"
              />
              <input type="hidden" name="submission_source" value="find_your_light_quiz" />
              <input type="hidden" name="quiz_name" value="find_your_light" />
              <input type="hidden" name="quiz_result" value={resultProfile.name} />
              <input type="hidden" name="quiz_result_slug" value={result} />
              <input type="hidden" name="result_url" value={resultProfile.productHref} />
              <input type="hidden" name="scores" value={JSON.stringify(scores)} />

              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-gold)]">
                    Save my result
                  </p>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-black/56">
                    Optional. Leave email or WhatsApp only if you want TARA to
                    keep this reading for future recommendations.
                  </p>
                </div>
                <p className="rounded-full border border-black/10 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-black/44">
                  No gate
                </p>
              </div>

              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <label className="space-y-3">
                  <span className="text-xs uppercase tracking-[0.24em] text-black/58">
                    Preferred Name
                  </span>
                  <input
                    className={leadFieldClassName}
                    type="text"
                    name="preferred_name"
                    autoComplete="given-name"
                    placeholder="Optional"
                  />
                </label>

                <label className="space-y-3">
                  <span className="text-xs uppercase tracking-[0.24em] text-black/58">
                    Scent Preference
                  </span>
                  <select
                    className={leadFieldClassName}
                    name="scent_preference"
                    defaultValue="not_sure"
                  >
                    <option value="not_sure">Not sure yet</option>
                    <option value="skin_close">Skin-close</option>
                    <option value="noticeable">Noticeable</option>
                    <option value="fresh">Fresh</option>
                    <option value="warm">Warm</option>
                  </select>
                </label>
              </div>

              <div className="mt-5 grid gap-6 sm:grid-cols-2">
                <label className="space-y-3">
                  <span className="text-xs uppercase tracking-[0.24em] text-black/58">
                    Email
                  </span>
                  <input
                    className={leadFieldClassName}
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                  />
                </label>

                <label className="space-y-3">
                  <span className="text-xs uppercase tracking-[0.24em] text-black/58">
                    WhatsApp / Mobile
                  </span>
                  <input
                    className={leadFieldClassName}
                    type="tel"
                    name="mobile"
                    autoComplete="tel"
                    placeholder="+60..."
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={leadStatus === "submitting"}
                className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[var(--color-gold)] bg-[var(--color-gold)] px-7 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-onyx-black)] transition duration-300 hover:border-[var(--color-amber)] hover:bg-[var(--color-amber)] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto"
              >
                {leadStatus === "submitting" ? "Saving..." : "Save My Result"}
              </button>

              <p aria-live="polite" className="mt-4 text-sm leading-7 text-black/58">
                {leadMessage}
              </p>
            </form>
          </div>
        </div>
      ) : null}
    </section>
  );
}
