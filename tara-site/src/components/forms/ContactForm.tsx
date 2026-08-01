"use client";

import { useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { analyticsEvents, trackEvent, trackFormStart } from "@/lib/analytics";

const fieldClassName =
  "w-full border-x-0 border-b border-t-0 border-black/14 bg-transparent px-0 py-4 text-sm text-[var(--color-onyx-black)] outline-none transition duration-300 placeholder:text-black/28 focus:border-[var(--color-gold)]";

export function ContactForm() {
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
      formName: "tara-contact",
      formLocation: "contact_page",
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

      trackEvent(analyticsEvents.contactSubmit, {
        form_name: "tara-contact",
        inquiry_type: String(formData.get("inquiry") ?? "unknown"),
      });
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      name="tara-contact"
      method="POST"
      action="/"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      onFocusCapture={handleFormStart}
      onChangeCapture={handleFormStart}
      className="border-y border-black/10 py-7 sm:py-8"
    >
      <input type="hidden" name="form-name" value="tara-contact" />
      <input type="hidden" name="bot-field" />
      <input
        type="hidden"
        name="subject"
        value="New lead from %{formName} (%{submissionId})"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <label className="space-y-3">
          <span className="text-xs uppercase tracking-[0.24em] text-black/58">
            Name
          </span>
          <input className={fieldClassName} type="text" name="name" required />
        </label>
        <label className="space-y-3">
          <span className="text-xs uppercase tracking-[0.24em] text-black/58">
            Email
          </span>
          <input className={fieldClassName} type="email" name="email" required />
        </label>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <label className="space-y-3">
          <span className="text-xs uppercase tracking-[0.24em] text-black/58">
            Inquiry Type
          </span>
          <select className={fieldClassName} name="inquiry" defaultValue="private-order">
            <option value="private-order">Private order</option>
            <option value="retail">Retail partnership</option>
            <option value="press">Press request</option>
            <option value="events">Event collaboration</option>
          </select>
        </label>
        <label className="space-y-3">
          <span className="text-xs uppercase tracking-[0.24em] text-black/58">
            Brand / Company
          </span>
          <input className={fieldClassName} type="text" name="company" />
        </label>
      </div>

      <label className="mt-6 block space-y-3">
        <span className="text-xs uppercase tracking-[0.24em] text-black/58">
          Message
        </span>
        <textarea
          className={`${fieldClassName} min-h-40 resize-y`}
          name="message"
          required
        />
      </label>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button type="submit" variant="primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending..." : "Send Inquiry"}
        </Button>
        <Button href="/preorder" variant="secondary">
          Preorder Instead
        </Button>
      </div>
      <p aria-live="polite" className="mt-4 text-sm leading-7 text-[var(--color-copy)]">
        {status === "success"
          ? "Your inquiry is with the house. Expect a personal reply within two working days."
          : null}
        {status === "error"
          ? "Submission did not go through. Please try again or email concierge directly."
          : null}
      </p>
    </form>
  );
}
