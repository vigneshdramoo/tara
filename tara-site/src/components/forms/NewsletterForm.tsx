"use client";

import { useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { analyticsEvents, trackEvent, trackFormStart } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const fieldClassName =
  "w-full border-0 border-b border-black/18 bg-transparent px-0 py-4 text-base text-[var(--color-onyx-black)] outline-none transition duration-300 placeholder:text-black/34 focus:border-[var(--color-gold)]";

type NewsletterFormProps = {
  source?: string;
  trackingLocation?: string;
  buttonLabel?: string;
  successMessage?: string;
  className?: string;
};

export function NewsletterForm({
  source = "footer",
  trackingLocation = source,
  buttonLabel = "Join the List",
  successMessage = "You are on the list for launch alerts and private drop news.",
  className,
}: NewsletterFormProps) {
  const hasTrackedFormStart = useRef(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );

  function handleFormStart() {
    if (hasTrackedFormStart.current) {
      return;
    }

    hasTrackedFormStart.current = true;
    trackFormStart({
      formName: "tara-newsletter",
      formLocation: trackingLocation,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const body = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      body.append(key, String(value));
    }

    try {
      const response = await fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      await fetch("/.netlify/functions/newsletter-signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: String(formData.get("email") ?? ""),
          source,
        }),
      }).catch(() => undefined);

      trackEvent(analyticsEvents.newsletterSignup, {
        form_name: "tara-newsletter",
        location: trackingLocation,
        source,
      });
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      name="tara-newsletter"
      method="POST"
      action="/"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      onFocusCapture={handleFormStart}
      onChangeCapture={handleFormStart}
      className={cn("space-y-5", className)}
    >
      <input type="hidden" name="form-name" value="tara-newsletter" />
      <input type="hidden" name="bot-field" />
      <input
        type="hidden"
        name="subject"
        value="New lead from %{formName} (%{submissionId})"
      />
      <input type="hidden" name="recipient" value="hello@tarascents.com" />
      <label className="block">
        <span className="sr-only">Email address</span>
        <input
          className={fieldClassName}
          type="email"
          name="email"
          placeholder="Email address"
          required
        />
      </label>
      <div className="flex flex-wrap gap-3">
        <Button
          type="submit"
          variant="primary"
          disabled={status === "submitting"}
          className="w-full sm:w-full"
        >
          {status === "submitting" ? "Joining..." : buttonLabel}
        </Button>
      </div>
      <p aria-live="polite" className="text-sm leading-7 text-[var(--color-copy)]">
        {status === "success" ? successMessage : null}
        {status === "error"
          ? "The signup did not go through. Please try again in a moment."
          : null}
      </p>
    </form>
  );
}
