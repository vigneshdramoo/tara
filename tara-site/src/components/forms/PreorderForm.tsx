"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";

import { PurchaseReassurance } from "@/components/product/PurchaseReassurance";
import { Button } from "@/components/ui/Button";
import { scents } from "@/content/scents";
import { brand } from "@/content/brand";
import { checkoutExperience } from "@/content/commercial";
import { eightMlPromoSet } from "@/content/products";
import { analyticsEvents, trackEvent, trackFormStart } from "@/lib/analytics";
import {
  buildPreorderSuccessPath,
  buildPreorderWhatsAppUrl,
  getPreorderScentName,
} from "@/lib/preorder";
import { cn } from "@/lib/utils";

const preorderScents = scents.filter((scent) => scent.status === "available");

const fieldClassName =
  "w-full border-x-0 border-b border-t-0 border-black/14 bg-transparent px-0 py-4 text-sm text-[var(--color-onyx-black)] outline-none transition duration-300 placeholder:text-black/28 focus:border-[var(--color-gold)]";

export function PreorderForm() {
  const router = useRouter();
  const hasTrackedFormStart = useRef(false);
  const [selectedScent, setSelectedScent] = useState(eightMlPromoSet.slug);
  const [quantity, setQuantity] = useState("1");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const selectedScentName = getPreorderScentName(selectedScent);
  const whatsappUrl = buildPreorderWhatsAppUrl({
    scentSlug: selectedScent,
    quantity,
  });

  function handleFormStart() {
    if (hasTrackedFormStart.current) {
      return;
    }

    hasTrackedFormStart.current = true;
    trackFormStart({
      formName: "tara-preorder",
      formLocation: "preorder_page",
    });
    trackEvent(analyticsEvents.manualPreorderStart, {
      event_category: "lead",
      form_name: "tara-preorder",
      form_location: "preorder_page",
      selected_scent: selectedScent,
    });
  }

  function handleScentSelect(scentSlug: string) {
    setSelectedScent(scentSlug);
    trackEvent(analyticsEvents.scentSelect, {
      event_category: "lead",
      form_name: "tara-preorder",
      selected_scent: scentSlug,
      selected_scent_name: getPreorderScentName(scentSlug),
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

      trackEvent(analyticsEvents.preorderSubmit, {
        form_name: "tara-preorder",
        selected_scent: selectedScent,
        selected_scent_name: selectedScentName,
        quantity: Number(formData.get("quantity") ?? 1),
        purpose: String(formData.get("purpose") ?? "unknown"),
        contact_method: String(formData.get("contact_method") ?? "unknown"),
        delivery_method: String(formData.get("delivery_method") ?? "unknown"),
      });
      trackEvent(analyticsEvents.manualPreorderSubmit, {
        event_category: "lead",
        form_name: "tara-preorder",
        selected_scent: selectedScent,
        selected_scent_name: selectedScentName,
        quantity: Number(formData.get("quantity") ?? 1),
        purpose: String(formData.get("purpose") ?? "unknown"),
        contact_method: String(formData.get("contact_method") ?? "unknown"),
        delivery_method: String(formData.get("delivery_method") ?? "unknown"),
      });
      form.reset();
      setStatus("success");
      router.push(
        buildPreorderSuccessPath({
          scentSlug: selectedScent,
          quantity,
        }),
      );
    } catch {
      setStatus("error");
    }
  }

  return (
    <form
      id="concierge-order"
      name="tara-preorder"
      method="POST"
      action="/preorder/success"
      data-netlify="true"
      netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      onFocusCapture={handleFormStart}
      onChangeCapture={handleFormStart}
      className="border-y border-black/10 py-7 sm:py-8"
    >
      <input type="hidden" name="form-name" value="tara-preorder" />
      <input type="hidden" name="bot-field" />
      <input
        type="hidden"
        name="subject"
        value="New concierge request from %{formName} (%{submissionId})"
      />
      <input type="hidden" name="submission_source" value="concierge-order" />

      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
          {checkoutExperience.concierge.eyebrow}
        </p>
        <h2 className="mt-4 text-[clamp(2.5rem,5vw,4.8rem)] font-medium leading-[0.88] tracking-[-0.06em] text-[var(--color-onyx-black)]">
          {checkoutExperience.concierge.title}
        </h2>
        <p className="mt-4 text-sm leading-7 text-black/58">
          {checkoutExperience.concierge.body}
        </p>
      </div>

      <fieldset>
        <legend className="text-xs uppercase tracking-[0.24em] text-black/58">
          Preferred product to discuss
        </legend>
        <div className="mt-4 grid gap-4">
          {preorderScents.map((scent) => {
            const isSelected = selectedScent === scent.slug;

            return (
              <label
                key={scent.slug}
                className={cn(
                  "grid cursor-pointer gap-4 border-y p-4 transition duration-300 sm:grid-cols-[8rem_1fr]",
                  isSelected
                    ? "border-[rgba(202,158,91,0.58)] bg-[rgba(202,158,91,0.06)]"
                    : "border-black/10 bg-transparent hover:border-black/18",
                )}
              >
                <input
                  type="radio"
                  name="scent"
                  value={scent.slug}
                  checked={isSelected}
                  onChange={() => handleScentSelect(scent.slug)}
                  className="sr-only"
                />
                <span className="relative min-h-32 overflow-hidden rounded-[1.1rem] border border-black/10 sm:min-h-0">
                  <Image
                    src={scent.visual.src}
                    alt={scent.visual.alt}
                    fill
                    sizes="(min-width: 640px) 8rem, 100vw"
                    className="object-cover"
                  />
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(247,243,235,0.08),rgba(247,243,235,0.56))]" />
                </span>
                <span className="flex flex-col justify-center">
                  <span className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
                    {scent.profile.audienceLabel} / {scent.launchPrice} first 100
                  </span>
                  <span className="mt-3 text-3xl font-medium leading-none tracking-[-0.05em]">
                    {scent.name}
                  </span>
                  <span className="mt-2 text-sm uppercase tracking-[0.2em] text-black/42">
                    {scent.line}
                  </span>
                  <span className="mt-3 text-sm leading-7 text-black/58">
                    {scent.summary}
                  </span>
                </span>
              </label>
            );
          })}

          <label
            className={cn(
              "cursor-pointer border-y p-5 transition duration-300",
              selectedScent === eightMlPromoSet.slug
                ? "border-[rgba(202,158,91,0.58)] bg-[rgba(202,158,91,0.06)]"
                : "border-black/10 bg-transparent hover:border-black/18",
            )}
          >
            <input
              type="radio"
              name="scent"
              value={eightMlPromoSet.slug}
              checked={selectedScent === eightMlPromoSet.slug}
              onChange={() => handleScentSelect(eightMlPromoSet.slug)}
              className="sr-only"
            />
            <span className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
              {eightMlPromoSet.name} / {eightMlPromoSet.price}
            </span>
            <span className="mt-3 block text-3xl font-medium leading-none tracking-[-0.05em]">
              Build my 8mL trio
            </span>
            <span className="mt-3 block text-sm leading-7 text-black/58">
              Choose this if you want any three 8mL TARA scents for RM99 before
              committing to a full bottle.
            </span>
          </label>

          <label
            className={cn(
              "cursor-pointer border-y p-5 transition duration-300",
              selectedScent === "undecided"
                ? "border-[rgba(202,158,91,0.58)] bg-[rgba(202,158,91,0.06)]"
                : "border-black/10 bg-transparent hover:border-black/18",
            )}
          >
            <input
              type="radio"
              name="scent"
              value="undecided"
              checked={selectedScent === "undecided"}
              onChange={() => handleScentSelect("undecided")}
              className="sr-only"
            />
            <span className="text-xs uppercase tracking-[0.22em] text-[var(--color-gold)]">
              Concierge Match
            </span>
            <span className="mt-3 block text-3xl font-medium leading-none tracking-[-0.05em]">
              I need guidance first
            </span>
            <span className="mt-3 block text-sm leading-7 text-black/58">
              Choose this if you want TARA to recommend whether you should begin
              with a full bottle or the 3 x 8mL promo set.
            </span>
          </label>
        </div>
      </fieldset>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <label className="space-y-3">
          <span className="text-xs uppercase tracking-[0.24em] text-black/58">
            Full Name
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
            WhatsApp / Phone
          </span>
          <input
            className={fieldClassName}
            type="tel"
            name="phone"
            placeholder="+60..."
            required
          />
        </label>
        <label className="space-y-3">
          <span className="text-xs uppercase tracking-[0.24em] text-black/58">
            Estimated Quantity
          </span>
          <input
            className={fieldClassName}
            type="number"
            min="1"
            max="12"
            name="quantity"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            required
          />
        </label>
      </div>

      <div className="mt-8 border-y border-black/10 py-5">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
          Concierge details
        </p>
        <p className="mt-3 text-sm leading-7 text-black/54">
          No full delivery address is needed here. TARA will collect it later if
          your concierge request becomes an order.
        </p>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        <label className="space-y-3">
          <span className="text-xs uppercase tracking-[0.24em] text-black/58">
            Contact Preference
          </span>
          <select
            className={fieldClassName}
            name="contact_method"
            defaultValue="whatsapp"
            required
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="either">Either is fine</option>
          </select>
        </label>
        <label className="space-y-3">
          <span className="text-xs uppercase tracking-[0.24em] text-black/58">
            Concierge Need
          </span>
          <select className={fieldClassName} name="purpose" defaultValue="guidance">
            <option value="guidance">Scent guidance</option>
            <option value="gift">Gift</option>
            <option value="event">Event / Bridal</option>
            <option value="wholesale">Wholesale</option>
            <option value="multiple">Multiple bottles</option>
          </select>
        </label>
        <label className="space-y-3">
          <span className="text-xs uppercase tracking-[0.24em] text-black/58">
            Delivery Need
          </span>
          <select
            className={fieldClassName}
            name="delivery_method"
            defaultValue="confirm-later"
            required
          >
            <option value="confirm-later">Confirm later</option>
            <option value="delivery">Delivery after confirmation</option>
            <option value="pickup">Pickup / meet-up</option>
            <option value="event-delivery">Event delivery</option>
          </select>
        </label>
      </div>

      <label className="mt-6 block space-y-3">
        <span className="text-xs uppercase tracking-[0.24em] text-black/58">
          Notes
        </span>
        <textarea
          className={`${fieldClassName} min-h-36 resize-y`}
          name="notes"
          placeholder="Tell the house your preferred 8mL trio, gifting details, event date, bridal quantity, wholesale need, or direct WhatsApp follow-up."
        />
      </label>

      <PurchaseReassurance compact className="mt-6" />

      <label className="mt-6 flex gap-3 border-y border-black/10 py-4 text-sm leading-7 text-black/58">
        <input
          type="checkbox"
          name="confirmation_consent"
          value="yes"
          required
          className="mt-1 h-4 w-4 accent-[var(--color-gold)]"
        />
        <span>
          {checkoutExperience.concierge.consent}
        </span>
      </label>

      <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap">
        <Button type="submit" variant="primary" disabled={status === "submitting"}>
          {status === "submitting" ? "Submitting..." : "Send Concierge Request"}
        </Button>
        <Button
          href={whatsappUrl}
          variant="secondary"
          trackingLabel={`WhatsApp ${selectedScentName}`}
          trackingLocation="preorder_form"
        >
          WhatsApp Concierge
        </Button>
      </div>

      <p className="mt-4 text-sm leading-7 text-black/54">
        {brand.preorderPage.paymentLine}
      </p>
      <p aria-live="polite" className="mt-4 text-sm leading-7 text-[var(--color-copy)]">
        {status === "success"
          ? "Your concierge request is in. TARA will confirm the right order path before collecting delivery details or payment."
          : null}
        {status === "error"
          ? "Submission did not go through. Please try again or use WhatsApp for a faster reply."
          : null}
      </p>
    </form>
  );
}
