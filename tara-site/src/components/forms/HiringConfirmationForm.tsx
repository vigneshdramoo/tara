"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { SiteIcon } from "@/components/ui/SiteIcon";
import { analyticsEvents, trackEvent, trackFormStart } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const engagementTerms = {
  activation: "TARA Scent Trail: Stop 06",
  role: "Scent Trail Crew",
  period: "1 July - 5 July 2026",
  hours: "10:00AM - 10:00PM daily",
  venue: "The Street, The Curve",
  status: "Applications Open",
  basicPay: "RM10/hr based on confirmed shift hours",
  commission:
    "50mL: 15% per bottle (RM25.35 at RM169 launch price). 10mL/travel size: 10% per unit (RM4.50 at RM45).",
  targetBonus:
    "Daily incentives are confirmed by TARA per shift and tied to agreed 50mL and 10mL sales targets.",
  maxDailyPayout:
    "Base pay + eligible commission + confirmed incentive bonus. Final payout depends on shift hours and actual sales.",
  ssmNo: "202603110736",
};

const bankOptions = [
  "Maybank",
  "CIMB",
  "Public Bank",
  "RHB",
  "Hong Leong Bank",
  "AmBank",
  "Bank Islam",
  "Bank Rakyat",
  "Touch 'n Go eWallet",
  "Other",
];

const acknowledgementItems = [
  {
    id: "availability",
    name: "ack_availability",
    label:
      "I confirm that I am available for the assigned Stop 06 shift period from 1 July to 5 July 2026 at The Street, The Curve.",
  },
  {
    id: "pay",
    name: "ack_pay",
    label:
      "I understand the basic pay is RM10/hr and I am aware of the commission and incentive structure as stated above.",
  },
  {
    id: "conduct",
    name: "ack_conduct",
    label:
      "I will conduct myself professionally, maintain the booth presentation, and represent TARA's brand with care.",
  },
  {
    id: "attendance",
    name: "ack_attendance",
    label:
      "I understand that failure to show up without prior notice may result in forfeiture of that day's pay.",
  },
  {
    id: "payout",
    name: "ack_payout",
    label:
      "I agree that payout will be made to the bank account provided above upon completion of each working day or at end of engagement period.",
  },
  {
    id: "accuracy",
    name: "ack_accuracy",
    label:
      "I confirm that all personal details provided in this form are accurate and correct.",
  },
] as const;

const netlifyEmailSubject =
  "New TARA hiring confirmation from %{formName} (%{submissionId})";

const acceptedAcknowledgementSummary = acknowledgementItems
  .map((item) => `Accepted - ${item.label}`)
  .join("\n");

const fieldClassName =
  "w-full border-x-0 border-b border-t-0 border-black/14 bg-transparent px-0 py-3.5 text-sm text-[var(--color-onyx-black)] outline-none transition duration-300 placeholder:text-black/28 focus:border-[var(--color-gold)]";

const fieldLabelClassName = "block text-xs uppercase tracking-[0.2em] text-black/54";

type SubmissionSummary = {
  name: string;
  phone: string;
  bankName: string;
  signatureDate: string;
};

type HiringPayload = {
  fullName: string;
  icNumber: string;
  phone: string;
  email: string;
  homeAddress: string;
  bankName: string;
  accountNumber: string;
  signatureName: string;
  signatureDate: string;
  companyWebsite: string;
  signatureDataUrl: string;
  engagementTerms: typeof engagementTerms;
  acknowledgements: Record<string, boolean>;
  acknowledgementLabels: Record<string, string>;
  sourcePage: string;
};

type HiringSubmitResult = {
  error?: string;
  submissionId?: string;
  pdfUrl?: string;
};

function getText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function canvasHasSignatureInk(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("2d");

  if (!context || canvas.width <= 0 || canvas.height <= 0) {
    return false;
  }

  try {
    const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
    let visiblePixels = 0;

    for (let index = 3; index < data.length; index += 4) {
      if (data[index] > 20) {
        visiblePixels += 1;

        if (visiblePixels >= 24) {
          return true;
        }
      }
    }
  } catch {
    return false;
  }

  return false;
}

async function submitNetlifyFormsBackup(
  payload: HiringPayload,
  result: HiringSubmitResult,
) {
  const body = new URLSearchParams({
    "form-name": "tara-hiring-confirmation",
    subject: netlifyEmailSubject,
    submission_source: "tara-and-friends-page",
    submissionId: result.submissionId ?? "",
    pdfUrl: result.pdfUrl ?? "",
    fullName: payload.fullName,
    icNumber: payload.icNumber,
    phone: payload.phone,
    email: payload.email,
    homeAddress: payload.homeAddress,
    bankName: payload.bankName,
    accountNumber: payload.accountNumber,
    signatureName: payload.signatureName,
    signatureDate: payload.signatureDate,
    signatureCaptured: payload.signatureDataUrl ? "yes" : "no",
    activation: payload.engagementTerms.activation,
    role: payload.engagementTerms.role,
    period: payload.engagementTerms.period,
    hours: payload.engagementTerms.hours,
    venue: payload.engagementTerms.venue,
    status: payload.engagementTerms.status,
    basicPay: payload.engagementTerms.basicPay,
    commission: payload.engagementTerms.commission,
    targetBonus: payload.engagementTerms.targetBonus,
    maxDailyPayout: payload.engagementTerms.maxDailyPayout,
    ssmNo: payload.engagementTerms.ssmNo,
    availabilityAck: `Accepted - ${payload.acknowledgementLabels.availability}`,
    payAck: `Accepted - ${payload.acknowledgementLabels.pay}`,
    conductAck: `Accepted - ${payload.acknowledgementLabels.conduct}`,
    attendanceAck: `Accepted - ${payload.acknowledgementLabels.attendance}`,
    payoutAck: `Accepted - ${payload.acknowledgementLabels.payout}`,
    accuracyAck: `Accepted - ${payload.acknowledgementLabels.accuracy}`,
    acknowledgementSummary: Object.entries(payload.acknowledgementLabels)
      .map(([key, label]) => `${payload.acknowledgements[key] ? "Accepted" : "Not accepted"} - ${label}`)
      .join("\n"),
    sourcePage: payload.sourcePage,
  });
  const response = await fetch("/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
  });

  if (!response.ok) {
    throw new Error("Backup submission failed");
  }
}

export function HiringConfirmationForm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const hasTrackedFormStart = useRef(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [summary, setSummary] = useState<SubmissionSummary | null>(null);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    context.scale(scale, scale);
    context.strokeStyle = "#ca9e5b";
    context.lineWidth = 2;
    context.lineCap = "round";
    context.lineJoin = "round";
    setHasSignature(false);
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [resizeCanvas]);

  useEffect(() => {
    const dateInput = document.getElementById("signatureDate") as HTMLInputElement | null;

    if (!dateInput || dateInput.value) {
      return;
    }

    dateInput.value = new Date().toISOString().split("T")[0] ?? "";
  }, []);

  function handleFormStart() {
    if (hasTrackedFormStart.current) {
      return;
    }

    hasTrackedFormStart.current = true;
    trackFormStart({
      formName: "tara-hiring-confirmation",
      formLocation: "tara_and_friends",
    });
  }

  function getCanvasPoint(event: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = event.currentTarget;
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  function handlePointerDown(event: React.PointerEvent<HTMLCanvasElement>) {
    handleFormStart();
    const canvas = event.currentTarget;
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const point = getCanvasPoint(event);
    drawingRef.current = true;
    canvas.setPointerCapture(event.pointerId);
    context.beginPath();
    context.moveTo(point.x, point.y);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) {
      return;
    }

    const context = event.currentTarget.getContext("2d");

    if (!context) {
      return;
    }

    const point = getCanvasPoint(event);
    context.lineTo(point.x, point.y);
    context.stroke();
    setHasSignature(true);
  }

  function handlePointerEnd(event: React.PointerEvent<HTMLCanvasElement>) {
    drawingRef.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function clearSignature() {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      setErrorMessage("Signature could not be captured. Please try again.");
      return;
    }

    if (!hasSignature || !canvasHasSignatureInk(canvas)) {
      setHasSignature(false);
      setErrorMessage("Please sign inside the signature box before submitting.");
      return;
    }

    const formData = new FormData(form);
    const acknowledgements = Object.fromEntries(
      acknowledgementItems.map((item) => [item.id, formData.get(item.name) === "yes"]),
    );
    const payload: HiringPayload = {
      fullName: getText(formData, "fullName"),
      icNumber: getText(formData, "icNumber"),
      phone: getText(formData, "phone"),
      email: getText(formData, "email"),
      homeAddress: getText(formData, "homeAddress"),
      bankName: getText(formData, "bankName"),
      accountNumber: getText(formData, "accountNumber"),
      signatureName: getText(formData, "signatureName"),
      signatureDate: getText(formData, "signatureDate"),
      companyWebsite: getText(formData, "companyWebsite"),
      signatureDataUrl: canvas.toDataURL("image/png"),
      engagementTerms,
      acknowledgements,
      acknowledgementLabels: Object.fromEntries(
        acknowledgementItems.map((item) => [item.id, item.label]),
      ),
      sourcePage:
        typeof window === "undefined" ? "tara-and-friends" : window.location.href,
    };

    setStatus("submitting");

    try {
      const response = await fetch("/.netlify/functions/hiring-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => ({}))) as HiringSubmitResult;

      if (!response.ok) {
        throw new Error(result.error ?? "Submission failed.");
      }

      await submitNetlifyFormsBackup(payload, result).catch((error) => {
        console.error(
          error instanceof Error ? error.message : "Backup submission failed",
        );
      });

      trackEvent(analyticsEvents.hiringSubmit, {
        form_name: "tara-hiring-confirmation",
        role: engagementTerms.role,
        period: engagementTerms.period,
      });
      setSummary({
        name: payload.fullName,
        phone: payload.phone,
        bankName: payload.bankName,
        signatureDate: payload.signatureDate,
      });
      setStatus("success");
      form.reset();
      clearSignature();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Submission did not go through. Please try again.",
      );
    }
  }

  if (status === "success" && summary) {
    return (
      <div className="border-y border-black/10 py-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(202,158,91,0.42)] bg-[rgba(202,158,91,0.12)] text-[var(--color-gold)]">
            <SiteIcon name="shield" className="h-6 w-6" />
          </span>
          <p className="mt-6 text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Confirmation Submitted
          </p>
          <h2 className="mt-4 font-editorial text-5xl font-medium leading-none text-[var(--color-onyx-black)] sm:text-6xl">
            Welcome to TARA.
          </h2>
          <p className="mt-5 text-base leading-8 text-[var(--color-copy)]">
            Your hiring confirmation has been received. We will be in touch
            shortly with onboarding details.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-xl divide-y divide-black/10 border-y border-black/10">
          {[
            ["Name", summary.name],
            ["Phone", summary.phone],
            ["Trail Stop", engagementTerms.activation],
            ["Role", engagementTerms.role],
            ["Period", engagementTerms.period],
            ["Venue", engagementTerms.venue],
            ["Status", engagementTerms.status],
            ["Payout to", summary.bankName],
            ["Signed", summary.signatureDate],
          ].map(([label, value]) => (
            <div
              key={label}
              className="grid gap-2 py-4 text-sm sm:grid-cols-[0.36fr_0.64fr]"
            >
              <span className="text-xs uppercase tracking-[0.22em] text-black/42">
                {label}
              </span>
              <span className="text-[var(--color-copy)]">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form
      name="tara-hiring-confirmation"
      method="POST"
      action="/"
      data-netlify="true"
      netlify-honeypot="companyWebsite"
      onSubmit={handleSubmit}
      onFocusCapture={handleFormStart}
      onChangeCapture={handleFormStart}
      className="grid gap-8"
    >
      <input type="hidden" name="form-name" value="tara-hiring-confirmation" />
      <input
        type="hidden"
        name="subject"
        value={netlifyEmailSubject}
        data-remove-prefix
        readOnly
      />
      <input type="hidden" name="submission_source" value="tara-and-friends-page" />
      <input type="hidden" name="activation" value={engagementTerms.activation} readOnly />
      <input type="hidden" name="role" value={engagementTerms.role} readOnly />
      <input type="hidden" name="period" value={engagementTerms.period} readOnly />
      <input type="hidden" name="hours" value={engagementTerms.hours} readOnly />
      <textarea name="venue" value={engagementTerms.venue} readOnly hidden />
      <input type="hidden" name="status" value={engagementTerms.status} readOnly />
      <input type="hidden" name="basicPay" value={engagementTerms.basicPay} readOnly />
      <input type="hidden" name="commission" value={engagementTerms.commission} readOnly />
      <input type="hidden" name="targetBonus" value={engagementTerms.targetBonus} readOnly />
      <input type="hidden" name="maxDailyPayout" value={engagementTerms.maxDailyPayout} readOnly />
      <input type="hidden" name="ssmNo" value={engagementTerms.ssmNo} readOnly />
      <input
        type="hidden"
        name="availabilityAck"
        value={`Accepted - ${acknowledgementItems[0].label}`}
        readOnly
      />
      <input
        type="hidden"
        name="payAck"
        value={`Accepted - ${acknowledgementItems[1].label}`}
        readOnly
      />
      <input
        type="hidden"
        name="conductAck"
        value={`Accepted - ${acknowledgementItems[2].label}`}
        readOnly
      />
      <input
        type="hidden"
        name="attendanceAck"
        value={`Accepted - ${acknowledgementItems[3].label}`}
        readOnly
      />
      <input
        type="hidden"
        name="payoutAck"
        value={`Accepted - ${acknowledgementItems[4].label}`}
        readOnly
      />
      <input
        type="hidden"
        name="accuracyAck"
        value={`Accepted - ${acknowledgementItems[5].label}`}
        readOnly
      />
      <textarea
        name="acknowledgementSummary"
        value={acceptedAcknowledgementSummary}
        readOnly
        hidden
      />
      <input
        type="hidden"
        name="signatureCaptured"
        value={hasSignature ? "yes" : "no"}
        readOnly
      />
      <input type="hidden" name="submissionId" value="" readOnly />
      <input type="hidden" name="pdfUrl" value="" readOnly />
      <input
        className="hidden"
        type="text"
        name="companyWebsite"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <section className="border-y border-black/10 py-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
              TARA Scent Trail: Stop 06 Confirmation
            </p>
            <h2 className="mt-3 font-editorial text-4xl font-medium leading-none text-[var(--color-onyx-black)] sm:text-5xl">
              Congratulations, you have been selected.
            </h2>
          </div>
          <div className="border border-[rgba(202,158,91,0.34)] bg-[rgba(202,158,91,0.12)] px-4 py-3 text-sm font-medium leading-7 text-[var(--color-onyx-black)] shadow-[0_14px_44px_rgba(10,10,10,0.04)] sm:max-w-xs">
            Please fill in your details and acknowledge the terms to confirm
            your placement with TARA.
          </div>
        </div>
      </section>

      <section className="grid gap-5">
        <div className="border-b border-black/10 pb-3">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Personal Details
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-3">
            <span className={fieldLabelClassName}>Full Name (as per IC)</span>
            <input
              className={fieldClassName}
              type="text"
              name="fullName"
              placeholder="e.g. Atikah Rizal"
              autoComplete="name"
              required
            />
          </label>
          <label className="space-y-3">
            <span className={fieldLabelClassName}>IC Number</span>
            <input
              className={fieldClassName}
              type="text"
              name="icNumber"
              placeholder="e.g. 050312-14-XXXX"
              required
            />
          </label>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-3">
            <span className={fieldLabelClassName}>Phone Number</span>
            <input
              className={fieldClassName}
              type="tel"
              name="phone"
              placeholder="+60 1X-XXX XXXX"
              autoComplete="tel"
              required
            />
          </label>
          <label className="space-y-3">
            <span className={fieldLabelClassName}>Email Address</span>
            <input
              className={fieldClassName}
              type="email"
              name="email"
              placeholder="you@email.com"
              autoComplete="email"
              required
            />
          </label>
        </div>
        <label className="space-y-3">
          <span className={fieldLabelClassName}>Home Address</span>
          <textarea
            className={`${fieldClassName} min-h-28 resize-y`}
            name="homeAddress"
            placeholder="Full address including postcode"
            autoComplete="street-address"
            required
          />
        </label>
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-3">
            <span className={fieldLabelClassName}>Bank Name</span>
            <select className={fieldClassName} name="bankName" defaultValue="" required>
              <option value="" disabled>
                Select bank...
              </option>
              {bankOptions.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-3">
            <span className={fieldLabelClassName}>Account Number</span>
            <input
              className={fieldClassName}
              type="text"
              name="accountNumber"
              placeholder="For salary payout"
              inputMode="numeric"
              required
            />
          </label>
        </div>
      </section>

      <section className="border-y border-black/10 py-7">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
          Terms of Engagement
        </p>
        <div className="mt-6 divide-y divide-black/10">
          {[
            ["Trail Stop", engagementTerms.activation],
            ["Role", engagementTerms.role],
            ["Period", engagementTerms.period],
            ["Hours", engagementTerms.hours],
            ["Status", engagementTerms.status],
            ["Basic Pay", engagementTerms.basicPay],
            ["Commission", engagementTerms.commission],
            ["Target Bonus", engagementTerms.targetBonus],
            ["Max Daily Payout", engagementTerms.maxDailyPayout],
            ["SSM No.", engagementTerms.ssmNo],
          ].map(([label, value]) => (
            <div
              key={label}
              className="grid gap-2 py-4 text-sm leading-7 sm:grid-cols-[0.32fr_0.68fr]"
            >
              <span className="text-xs uppercase tracking-[0.22em] text-black/42">
                {label}
              </span>
              <span
                className={cn(
                  "text-[var(--color-copy)]",
                  ["Commission", "Target Bonus", "Max Daily Payout"].includes(label) &&
                    "font-semibold text-[var(--color-onyx-black)]",
                )}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-5">
        <div className="border-b border-black/10 pb-3">
          <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
            Candidate Acknowledgement
          </p>
        </div>
        <div className="divide-y divide-black/10 border-y border-black/10">
          {acknowledgementItems.map((item) => (
            <label
              key={item.id}
              className="grid cursor-pointer grid-cols-[auto_1fr] gap-3 py-4 text-sm leading-7 text-[var(--color-copy)]"
            >
              <input
                type="checkbox"
                name={item.name}
                value="yes"
                required
                className="mt-1 h-4 w-4 accent-[var(--color-gold)]"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </section>

      <section className="grid gap-5 border-y border-black/10 py-7">
        <p className="text-xs uppercase tracking-[0.28em] text-[var(--color-gold)]">
          Signature
        </p>
        <div>
          <div className="relative overflow-hidden border border-black/14 bg-black/20">
            <canvas
              ref={canvasRef}
              aria-label="Signature pad"
              className="block h-36 w-full touch-none cursor-crosshair"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onPointerLeave={handlePointerEnd}
            />
            <button
              type="button"
              onClick={clearSignature}
              className="absolute right-3 top-3 border border-[rgba(202,158,91,0.34)] bg-[rgba(10,10,10,0.86)] px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-[var(--color-ivory)] transition duration-300 hover:border-[rgba(202,158,91,0.7)] hover:text-[var(--color-gold)]"
            >
              Clear
            </button>
          </div>
          <p className="mt-3 text-xs leading-6 text-black/42">
            Sign using a finger, trackpad, mouse, or stylus.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="space-y-3">
            <span className={fieldLabelClassName}>Full Name (printed)</span>
            <input
              className={fieldClassName}
              type="text"
              name="signatureName"
              placeholder="As per IC"
              required
            />
          </label>
          <label className="space-y-3">
            <span className={fieldLabelClassName}>Date</span>
            <input
              id="signatureDate"
              className={fieldClassName}
              type="date"
              name="signatureDate"
              required
            />
          </label>
        </div>
      </section>

      <div className="grid gap-4">
        <Button type="submit" disabled={status === "submitting"} className="sm:w-full">
          {status === "submitting" ? "Submitting..." : "Confirm & Submit"}
        </Button>
        <p className="text-center text-xs leading-6 text-black/42">
          By submitting, you confirm acceptance of the engagement terms above.
          SSM No. 202603110736.
        </p>
        <p aria-live="polite" className="text-center text-sm leading-7 text-[var(--color-copy)]">
          {status === "error" || errorMessage ? errorMessage : null}
        </p>
      </div>
    </form>
  );
}
