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

type Phase = "landing" | "quiz" | "interstitial" | "lead" | "results";

type QuizLeadStatus = "idle" | "submitting" | "success" | "error";

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
  };
}

type QuizCtaProps = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
  location: string;
  result?: string;
};

function QuizCta({ href, label, variant = "primary", location, result }: QuizCtaProps) {
  return (
    <Link
      href={href}
      onClick={() =>
        trackCtaClick({
          linkLabel: label,
          linkLocation: location,
          linkUrl: href,
          linkType: "internal",
          quiz_result: result,
        })
      }
      className={cn(
        "inline-flex min-h-12 w-full items-center justify-center rounded-full border px-6 py-3 text-center text-xs font-semibold uppercase tracking-[0.22em] transition duration-300 sm:w-auto",
        variant === "primary" &&
          "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-onyx-black)] hover:border-[var(--color-amber)] hover:bg-[var(--color-amber)]",
        variant === "secondary" &&
          "border-black/14 bg-transparent text-[var(--color-onyx-black)] hover:border-[rgba(202,158,91,0.58)] hover:bg-[rgba(202,158,91,0.10)]",
      )}
    >
      {label}
    </Link>
  );
}

export function FindYourLightQuiz() {
  const completionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasTrackedLeadStart = useRef(false);
  const [phase, setPhase] = useState<Phase>("landing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<FindYourLightScent, number>>(
    createEmptyScores,
  );
  const [result, setResult] = useState<FindYourLightScent>("zephyr");
  const [leadStatus, setLeadStatus] = useState<QuizLeadStatus>("idle");
  const [leadMessage, setLeadMessage] = useState("");

  const question = findYourLightQuestions[currentQuestionIndex];
  const progressPercent =
    phase === "results"
      ? 100
      : (currentQuestionIndex / findYourLightQuestions.length) * 100;
  const resultProfile = findYourLightProfiles[result];

  useEffect(() => {
    return () => {
      if (completionTimer.current) {
        clearTimeout(completionTimer.current);
      }
    };
  }, []);

  function beginQuiz() {
    setScores(createEmptyScores());
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setResult("zephyr");
    setLeadStatus("idle");
    setLeadMessage("");
    hasTrackedLeadStart.current = false;
    setPhase("quiz");
    trackEvent(analyticsEvents.quizStart, {
      event_category: "lead",
      quiz_name: "find_your_light",
      question_count: findYourLightQuestions.length,
    });
  }

  function retakeQuiz() {
    beginQuiz();
    trackEvent("quiz_retake", {
      event_category: "lead",
      quiz_name: "find_your_light",
    });
  }

  function completeQuiz(finalScores: Record<FindYourLightScent, number>) {
    const calculatedResult = calculateFindYourLightResult(finalScores);
    setResult(calculatedResult);
    setPhase("interstitial");
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
    });

    completionTimer.current = setTimeout(() => {
      setPhase("lead");
    }, 1300);
  }

  function handleLeadStart() {
    if (hasTrackedLeadStart.current) {
      return;
    }

    hasTrackedLeadStart.current = true;
    trackFormStart({
      formName: "tara-quiz-lead",
      formLocation: "find_your_light_result_gate",
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
      setLeadMessage("Please leave either an email or mobile number so TARA can save your scent reading.");
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
        gender: String(formData.get("gender") ?? "unknown"),
        contact_type: email && mobile ? "email_mobile" : email ? "email" : "mobile",
      });

      setLeadStatus("success");
      setLeadMessage("Saved. Revealing your scent identity now.");
      setPhase("results");
    } catch {
      setLeadStatus("error");
      setLeadMessage("Your details did not save. Please try again before revealing your result.");
    }
  }

  function chooseOption(option: FindYourLightOption) {
    if (selectedOption) {
      return;
    }

    const nextScores = {
      ...scores,
      [option.scent]: scores[option.scent] + 1,
    };

    setSelectedOption(option.letter);
    setScores(nextScores);

    completionTimer.current = setTimeout(() => {
      if (currentQuestionIndex === findYourLightQuestions.length - 1) {
        completeQuiz(nextScores);
        return;
      }

      setCurrentQuestionIndex((current) => current + 1);
      setSelectedOption(null);
    }, 520);
  }

  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-ivory)] text-[var(--color-onyx-black)]">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_5%,rgba(202,158,91,0.18),transparent_30%),radial-gradient(circle_at_12%_72%,rgba(202,158,91,0.11),transparent_30%),linear-gradient(180deg,#fffaf1_0%,var(--color-ivory)_52%,#efe7d8_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.18] [background-image:linear-gradient(rgba(10,10,10,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(10,10,10,0.06)_1px,transparent_1px)] [background-size:64px_64px]" />

      {phase === "landing" ? (
        <div className="mx-auto grid min-h-[calc(100svh-73px)] w-full max-w-7xl place-items-center px-4 py-16 sm:min-h-[calc(100svh-83px)] sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-xs uppercase tracking-[0.36em] text-[var(--color-gold)]">
              TARA Olfactive Portrait
            </p>
            <h1 className="mt-7 font-editorial text-[clamp(4rem,12vw,10rem)] font-medium leading-[0.78] tracking-[-0.075em] text-balance">
              Find your light.
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-black/66 sm:text-xl sm:leading-9">
              Eight questions. One quiet pattern behind the scent your body
              already recognizes.
            </p>
            <div className="mx-auto mt-8 grid max-w-3xl grid-cols-2 gap-3 text-[10px] uppercase tracking-[0.22em] text-black/54 sm:grid-cols-3 lg:grid-cols-6">
              {["Aureya", "Zephyr", "Maris", "Eliora", "Ashoka", "Ardor"].map((scent) => (
                <span
                  key={scent}
                  className="rounded-full border border-[rgba(202,158,91,0.30)] bg-[rgba(255,250,241,0.62)] px-3 py-3"
                >
                  {scent}
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
          <div className="sticky top-[73px] z-10 -mx-4 border-b border-black/10 bg-[rgba(247,243,235,0.92)] px-4 py-4 backdrop-blur-xl sm:top-[83px] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--color-gold)]">
                Find Your Light
              </p>
              <button
                type="button"
                onClick={() => setPhase("landing")}
                className="text-xs uppercase tracking-[0.24em] text-black/44 transition duration-300 hover:text-[var(--color-onyx-black)]"
              >
                Close
              </button>
            </div>
            <div
              role="progressbar"
              aria-label="Quiz progress"
              aria-valuenow={currentQuestionIndex}
              aria-valuemin={0}
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
              <p className="font-editorial text-base text-[var(--color-gold)]">
                {String(currentQuestionIndex + 1).padStart(2, "0")} /{" "}
                {String(findYourLightQuestions.length).padStart(2, "0")}
              </p>
              <h2 className="mt-5 max-w-4xl font-editorial text-[clamp(2.25rem,7vw,5.8rem)] font-medium leading-[0.92] tracking-[-0.055em] text-balance">
                {question.text}
              </h2>

              <div className="mt-9 grid gap-3">
                {question.options.map((option) => {
                  const isSelected = selectedOption === option.letter;

                  return (
                    <button
                      key={option.letter}
                      type="button"
                      aria-pressed={isSelected}
                      disabled={Boolean(selectedOption)}
                      onClick={() => chooseOption(option)}
                      className={cn(
                        "group grid gap-4 rounded-[1.35rem] border border-black/10 bg-[rgba(255,250,241,0.72)] p-5 text-left shadow-[0_16px_60px_rgba(10,10,10,0.045)] transition duration-300 sm:grid-cols-[3rem_1fr] sm:items-start sm:p-6",
                        "hover:-translate-y-0.5 hover:border-[rgba(202,158,91,0.54)] hover:bg-[rgba(202,158,91,0.10)]",
                        isSelected &&
                          "border-[rgba(202,158,91,0.72)] bg-[rgba(202,158,91,0.12)]",
                        selectedOption && !isSelected && "opacity-45",
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

      {phase === "interstitial" ? (
        <div className="grid min-h-[calc(100svh-73px)] place-items-center px-4 py-16 sm:min-h-[calc(100svh-83px)]">
          <p className="animate-pulse font-editorial text-[clamp(2rem,6vw,4rem)] font-medium tracking-[-0.04em] text-[var(--color-gold)]">
            Decoding your essence...
          </p>
        </div>
      ) : null}

      {phase === "lead" ? (
        <div className="mx-auto grid min-h-[calc(100svh-73px)] w-full max-w-6xl gap-10 px-4 py-16 sm:min-h-[calc(100svh-83px)] sm:px-6 lg:grid-cols-[0.9fr_1fr] lg:items-center lg:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--color-gold)]">
              Your Reading Is Ready
            </p>
            <h2 className="mt-7 max-w-4xl font-editorial text-[clamp(3.4rem,10vw,8rem)] font-medium leading-[0.82] tracking-[-0.075em] text-balance">
              Where should we keep your scent identity?
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-8 text-black/66 sm:text-lg sm:leading-9">
              Leave a preferred name, gender, and one contact method. TARA will store
              your result for future recommendations, booth follow-ups, and launch
              updates.
            </p>
            <p className="mt-6 max-w-xl border-y border-black/10 py-4 text-[11px] uppercase leading-5 tracking-[0.2em] text-black/48">
              We ask this before revealing the result so your quiz profile does not
              disappear after you close the page.
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
            className="rounded-[2rem] border border-[rgba(202,158,91,0.28)] bg-[rgba(255,250,241,0.74)] p-5 shadow-[0_24px_90px_rgba(10,10,10,0.09)] sm:p-8"
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
            <input type="hidden" name="scores" value={JSON.stringify(scores)} />

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="space-y-3">
                <span className="text-xs uppercase tracking-[0.24em] text-black/58">
                  Preferred Name
                </span>
                <input
                  className={leadFieldClassName}
                  type="text"
                  name="preferred_name"
                  autoComplete="given-name"
                  required
                />
              </label>

              <label className="space-y-3">
                <span className="text-xs uppercase tracking-[0.24em] text-black/58">
                  Gender
                </span>
                <select
                  className={leadFieldClassName}
                  name="gender"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select one
                  </option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non_binary">Non-binary</option>
                  <option value="prefer_not_to_say">Prefer not to say</option>
                </select>
              </label>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
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
                  Mobile
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

            <p className="mt-4 text-sm leading-7 text-black/52">
              Email or mobile is required. Both are welcome if you want easier
              concierge follow-up.
            </p>

            <button
              type="submit"
              disabled={leadStatus === "submitting"}
              className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[var(--color-gold)] bg-[var(--color-gold)] px-7 py-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-onyx-black)] transition duration-300 hover:border-[var(--color-amber)] hover:bg-[var(--color-amber)] disabled:cursor-not-allowed disabled:opacity-55"
            >
              {leadStatus === "submitting" ? "Saving..." : "Reveal My Scent"}
            </button>

            <p aria-live="polite" className="mt-4 text-sm leading-7 text-black/58">
              {leadMessage}
            </p>
          </form>
        </div>
      ) : null}

      {phase === "results" ? (
        <div className="mx-auto grid min-h-[calc(100svh-73px)] w-full max-w-7xl gap-10 px-4 py-16 sm:min-h-[calc(100svh-83px)] sm:px-6 lg:grid-cols-[0.86fr_1fr] lg:items-center lg:px-8">
          <div className="relative order-2 mx-auto flex min-h-[24rem] w-full max-w-md items-center justify-center overflow-hidden rounded-[2rem] border border-[rgba(202,158,91,0.28)] bg-[rgba(255,250,241,0.74)] p-8 shadow-[0_28px_100px_rgba(10,10,10,0.10)] lg:order-1">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(202,158,91,0.24),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.22),transparent)]" />
            <Image
              src={resultProfile.image}
              alt={`${resultProfile.name} perfume bottle for your Find Your Light result.`}
              width={1122}
              height={1402}
              priority
              className="relative z-10 h-auto max-h-[32rem] w-[72%] object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.42)]"
            />
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-xs uppercase tracking-[0.34em] text-[var(--color-gold)]">
              Your Olfactive Portrait
            </p>
            <h2 className="mt-6 font-editorial text-[clamp(4.2rem,12vw,9rem)] font-medium leading-[0.78] tracking-[-0.075em]">
              {resultProfile.name}
            </h2>
            <p className="mt-5 font-editorial text-3xl italic tracking-[-0.03em] text-black/82 sm:text-5xl">
              {resultProfile.tagline}
            </p>
            <p className="mt-7 max-w-2xl text-base leading-8 text-black/66 sm:text-lg sm:leading-9">
              {resultProfile.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {resultProfile.notes.map((note) => (
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
                href="/preorder?checkout=three-8ml-promo#secure-checkout"
                label="Order 3 x 8mL"
                variant="secondary"
                location="quiz_result"
                result={result}
              />
            </div>

            <button
              type="button"
              onClick={retakeQuiz}
              className="mt-7 text-sm uppercase tracking-[0.24em] text-black/44 transition duration-300 hover:text-[var(--color-gold)]"
            >
              Retake The Quiz
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
