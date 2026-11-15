"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Bulb } from "@/components/decorative/Bulb";
import {
  budgetLabel,
  propertyLabel,
  quoteContent as copy,
  storiesLabel,
  wizardUI as ui,
  type Budget,
  type PropertyType,
  type Stories,
  type IllustratedOption,
} from "@/content/quote";
import { site, smsHref, telHref } from "@/content/site";
import { isZipInArea } from "@/content/service-areas";
import { contactSchema } from "@/lib/lead-schema";
import {
  captureAttribution,
  hasAttributionConsent,
  readAttribution,
  setAttributionConsent,
} from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";
import { QuoteProgressStrand } from "./QuoteProgressStrand";
import styles from "./QuoteWizard.module.css";

type Step = 0 | 1 | 2 | 3 | 4;
type QuoteState = {
  phase: "zip" | "questions" | "submitting" | "success" | "error";
  step: Step;
  zip: string;
  inArea: boolean | null;
  propertyType: PropertyType | "";
  stories: Stories | "";
  budget: Budget | "";
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  consent: boolean;
  website: string;
};
const initial: QuoteState = {
  phase: "zip",
  step: 0,
  zip: "",
  inArea: null,
  propertyType: "",
  stories: "",
  budget: "",
  name: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
  consent: false,
  website: "",
};
type Errors = Record<string, string>;
type ContactField = "name" | "phone" | "email" | "address";

function IllustratedOptions<V extends string>({
  options,
  selected,
  onSelect,
  name,
}: {
  options: IllustratedOption<V>[];
  selected: V | "";
  onSelect: (value: V) => void;
  name: string;
}) {
  return (
    <div
      className={`${styles.options} ${options.length === 3 ? styles.threeOptions : ""}`}
    >
      {options.map((option) => (
        <label
          className={styles.option}
          key={option.value}
          data-selected={selected === option.value}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selected === option.value}
            onChange={() => onSelect(option.value)}
          />
          <Image
            src={selected === option.value ? option.art.lit : option.art.unlit}
            width={option.art.width}
            height={option.art.height}
            alt=""
            className={styles.optionArt}
          />
          <span className={styles.optionText}>
            <strong>{option.title}</strong>
            <span>{option.sub}</span>
            {option.badge && <span className={styles.tag}>{option.badge}</span>}
          </span>
          <span className={styles.check} aria-hidden="true">
            {selected === option.value ? "✓" : ""}
          </span>
        </label>
      ))}
    </div>
  );
}

export function QuoteWizard() {
  const [state, setState] = useState<QuoteState>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [mode, setMode] = useState<"demo" | "live">("demo");
  const [marketingConsent, setMarketingConsent] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const hasNavigated = useRef(false);
  const pending = useRef(false);
  const requestKey = useRef("");
  const request = useRef<AbortController | null>(null);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (active) {
        setMarketingConsent(hasAttributionConsent());
        captureAttribution();
      }
    });
    const zip = new URLSearchParams(window.location.search).get("zip") ?? "";
    // Never check or submit a query-string ZIP without an explicit user action.
    if (/^\d{5}$/.test(zip))
      queueMicrotask(() => {
        if (active) setState((previous) => ({ ...previous, zip }));
      });
    return () => {
      active = false;
      request.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (hasNavigated.current)
      headingRef.current?.focus({ preventScroll: true });
  }, [state.step, state.phase]);

  function update<K extends keyof QuoteState>(key: K, value: QuoteState[K]) {
    requestKey.current = "";
    setState((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => {
      const next = { ...previous };
      delete next[key];
      if (key === "propertyType" || key === "stories" || key === "budget")
        delete next.option;
      return next;
    });
  }

  function goTo(step: Step, phase: QuoteState["phase"] = "questions") {
    hasNavigated.current = true;
    setErrors({});
    setState((previous) => ({ ...previous, step, phase }));
  }

  function checkZip(event: FormEvent) {
    event.preventDefault();
    if (!/^\d{5}$/.test(state.zip)) {
      setErrors({
        zip: state.zip ? copy.gate.errors.short : copy.gate.errors.empty,
      });
      document.getElementById("quote-zip")?.focus();
      return;
    }
    setErrors({});
    trackEvent("quote_start");
    trackEvent("zip_result", { inArea: isZipInArea(state.zip) });
    setState((previous) => ({
      ...previous,
      inArea: isZipInArea(previous.zip),
    }));
    requestAnimationFrame(() =>
      resultRef.current?.focus({ preventScroll: true }),
    );
  }

  function next(event: FormEvent) {
    event.preventDefault();
    if (pending.current) return;
    const selected =
      state.step === 0
        ? state.propertyType
        : state.step === 1
          ? state.stories
          : state.budget;
    if (state.step < 3 && !selected) {
      setErrors({ option: ui.select });
      return;
    }
    if (state.step === 3) {
      const result = contactSchema.safeParse(state);
      if (!result.success) {
        const fields: Errors = {};
        result.error.issues.forEach((issue) => {
          fields[String(issue.path[0])] ??= issue.message;
        });
        setErrors(fields);
        requestAnimationFrame(() =>
          document.getElementById(`quote-${Object.keys(fields)[0]}`)?.focus(),
        );
        return;
      }
    }
    if (state.step === 4) {
      void submit();
      return;
    }
    trackEvent("step_complete", { step: state.step });
    goTo((state.step + 1) as Step);
  }

  async function submit() {
    if (pending.current) return;
    pending.current = true;
    setErrors({});
    setState((previous) => ({ ...previous, phase: "submitting" }));
    requestKey.current ||= crypto.randomUUID();
    const controller = new AbortController();
    request.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const { phase: _phase, step: _step, inArea: _inArea, ...answers } = state;
      void _phase;
      void _step;
      void _inArea;
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": requestKey.current,
        },
        body: JSON.stringify({ ...answers, attribution: readAttribution() }),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error("Submission failed");
      setMode(result.mode === "live" ? "live" : "demo");
      trackEvent("submit_success", {
        mode: result.mode === "live" ? "live" : "demo",
      });
      hasNavigated.current = true;
      setState((previous) => ({ ...previous, phase: "success" }));
    } catch {
      trackEvent("submit_failure");
      hasNavigated.current = true;
      setState((previous) => ({ ...previous, phase: "error" }));
      setErrors({ submit: ui.submitError });
    } finally {
      clearTimeout(timeout);
      pending.current = false;
      request.current = null;
    }
  }

  const busy = state.phase === "submitting";
  const success = state.phase === "success";
  const question =
    state.step === 0
      ? copy.property
      : state.step === 1
        ? copy.stories
        : state.step === 2
          ? copy.budget
          : state.step === 3
            ? copy.contact
            : copy.review;
  const summary = [
    { key: "zip", value: state.zip, step: 0 as Step, phase: "zip" as const },
    {
      key: "property",
      value: state.propertyType ? propertyLabel(state.propertyType) : "",
      step: 0 as Step,
    },
    {
      key: "stories",
      value: state.stories ? storiesLabel(state.stories) : "",
      step: 1 as Step,
    },
    {
      key: "budget",
      value: state.budget ? budgetLabel(state.budget) : "",
      step: 2 as Step,
    },
    ...(["name", "phone", "email", "address", "notes"] as const).map((key) => ({
      key,
      value: state[key] || ui.optionalEmpty,
      step: 3 as Step,
    })),
  ];

  function field(
    name: ContactField,
    type: string,
    autoComplete: string,
    required = false,
  ) {
    const data = copy.contact.fields[name];
    return (
      <div
        className={`${styles.field} ${name === "address" || name === "name" ? styles.fullWidth : ""}`}
      >
        <label htmlFor={`quote-${name}`}>
          {data.label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
        <input
          id={`quote-${name}`}
          name={name}
          type={type}
          autoComplete={autoComplete}
          required={required}
          maxLength={
            name === "address"
              ? 300
              : name === "phone"
                ? 30
                : name === "name"
                  ? 120
                  : 150
          }
          value={state[name]}
          placeholder={data.placeholder}
          onChange={(event) => update(name, event.target.value)}
          aria-invalid={Boolean(errors[name])}
          aria-describedby={errors[name] ? `error-${name}` : undefined}
        />
        {errors[name] && (
          <span className={styles.fieldError} id={`error-${name}`}>
            {errors[name]}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`quote-interactive ${styles.wrap} ${success ? styles.night : ""}`}
      data-quote-wizard="true"
    >
      <div className={styles.chains} aria-hidden="true">
        <span />
        <span />
      </div>
      <div className={styles.board}>
        <QuoteProgressStrand
          step={state.step}
          started={state.phase !== "zip"}
          success={success}
        />
        {success ? (
          <section className={styles.success} aria-live="polite">
            <span className="label">
              {mode === "demo" ? ui.demo.badge : site.shortName}
            </span>
            <h2 ref={headingRef} tabIndex={-1}>
              {mode === "demo" ? ui.demo.title : ui.realSuccess.title}
            </h2>
            <p>{mode === "demo" ? ui.demo.body : ui.realSuccess.body}</p>
            <Image
              src={copy.done.skyline.src}
              width={copy.done.skyline.width}
              height={copy.done.skyline.height}
              alt={copy.done.skyline.alt}
              className={styles.skyline}
            />
            <Link className="btn btn-red" href="/">
              {ui.returnHome}
            </Link>
          </section>
        ) : state.phase === "zip" ? (
          <form onSubmit={checkZip} noValidate className={styles.gate}>
            <h2 ref={headingRef} tabIndex={-1}>
              {copy.gate.heading.pre}
              <em>{copy.gate.heading.em}</em>
              {copy.gate.heading.post}
            </h2>
            <p>{copy.gate.sub}</p>
            <div className={styles.zipRow}>
              <div className={styles.field}>
                <label htmlFor="quote-zip">{copy.gate.label}</label>
                <input
                  id="quote-zip"
                  name="postal-code"
                  autoComplete="postal-code"
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  maxLength={5}
                  required
                  value={state.zip}
                  onChange={(event) => {
                    update(
                      "zip",
                      event.target.value.replace(/\D/g, "").slice(0, 5),
                    );
                    setState((previous) => ({ ...previous, inArea: null }));
                  }}
                  placeholder={copy.gate.placeholder}
                  aria-invalid={Boolean(errors.zip)}
                  aria-describedby={errors.zip ? "error-zip" : undefined}
                />
              </div>
              <button type="submit" className="btn btn-red">
                {site.cta.checkZip}
                <span aria-hidden="true"> →</span>
              </button>
            </div>
            {errors.zip && (
              <p className={styles.fieldError} id="error-zip" role="alert">
                {errors.zip}
              </p>
            )}
            {state.inArea !== null && (
              <div
                className={styles.zipResult}
                aria-live="polite"
                ref={resultRef}
                tabIndex={-1}
              >
                <strong>
                  {state.inArea
                    ? copy.gate.inArea.title
                    : copy.gate.outOfArea.title}
                </strong>
                <p>
                  {state.inArea
                    ? copy.gate.inArea.body
                    : copy.gate.outOfArea.body}
                </p>
                <button
                  type="button"
                  className="btn btn-red"
                  onClick={() => goTo(0)}
                >
                  {state.inArea ? ui.start : copy.gate.anywayLabel}
                </button>
              </div>
            )}
            <p className={styles.areaNote}>
              {copy.gate.area.pre}
              <strong>{copy.gate.area.strong}</strong>
              {copy.gate.area.post}
            </p>
          </form>
        ) : (
          <form onSubmit={next} noValidate aria-busy={busy}>
            <div className={styles.question}>
              <span className="label">{question.eyebrow}</span>
              <h2 ref={headingRef} tabIndex={-1}>
                {question.title}
              </h2>
              {"sub" in question && <p>{question.sub}</p>}
            </div>
            <fieldset disabled={busy} className={styles.formFields}>
              {state.step < 3 && (
                <legend className={styles.srOnly}>{question.title}</legend>
              )}
              {state.step === 0 && (
                <IllustratedOptions
                  options={copy.property.options}
                  selected={state.propertyType}
                  onSelect={(value) => update("propertyType", value)}
                  name="propertyType"
                />
              )}
              {state.step === 1 && (
                <IllustratedOptions
                  options={copy.stories.options}
                  selected={state.stories}
                  onSelect={(value) => update("stories", value)}
                  name="stories"
                />
              )}
              {state.step === 2 && (
                <div className={styles.budgets}>
                  {copy.budget.options.map((option) => (
                    <label
                      key={option.value}
                      className={styles.budget}
                      data-selected={state.budget === option.value}
                    >
                      <input
                        type="radio"
                        name="budget"
                        value={option.value}
                        checked={state.budget === option.value}
                        onChange={() => update("budget", option.value)}
                      />
                      <span className={styles.budgetBulbs} aria-hidden="true">
                        {option.bulbs
                          ? Array.from({ length: option.bulbs }, (_, index) => (
                              <Bulb key={index} color="var(--gold)" />
                            ))
                          : "?"}
                      </span>
                      <span>
                        <strong>{option.title}</strong>
                        <span className={styles.budgetSub}>{option.sub}</span>
                      </span>
                      {"pop" in option && (
                        <span className={styles.tag}>{option.pop}</span>
                      )}
                      <span className={styles.check} aria-hidden="true">
                        {state.budget === option.value ? "✓" : ""}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              {state.step === 3 && (
                <>
                  <p className={styles.required}>{copy.contact.requiredNote}</p>
                  <div className={styles.contactGrid}>
                    {field("name", "text", "name", true)}
                    {field("phone", "tel", "tel", true)}
                    {field("email", "email", "email")}
                    {field("address", "text", "street-address", true)}
                  </div>
                  <details
                    className={styles.notes}
                    open={Boolean(state.notes) || undefined}
                  >
                    <summary>{copy.contact.fields.notes.summary}</summary>
                    <label htmlFor="quote-notes">
                      {copy.contact.fields.notes.label}
                    </label>
                    <textarea
                      id="quote-notes"
                      name="notes"
                      maxLength={2000}
                      rows={4}
                      value={state.notes}
                      onChange={(event) => update("notes", event.target.value)}
                      placeholder={copy.contact.fields.notes.placeholder}
                      aria-invalid={Boolean(errors.notes)}
                      aria-describedby={
                        errors.notes ? "error-notes" : undefined
                      }
                    />
                    {errors.notes && (
                      <span id="error-notes" className={styles.fieldError}>
                        {errors.notes}
                      </span>
                    )}
                  </details>
                  <div className={styles.honeypot} aria-hidden="true">
                    <label htmlFor="quote-website">{ui.honeypotLabel}</label>
                    <input
                      id="quote-website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={state.website}
                      onChange={(event) =>
                        update("website", event.target.value)
                      }
                    />
                  </div>
                  <label className={styles.consent}>
                    <input
                      type="checkbox"
                      id="quote-consent"
                      required
                      checked={state.consent}
                      onChange={(event) =>
                        update("consent", event.target.checked)
                      }
                      aria-invalid={Boolean(errors.consent)}
                      aria-describedby={
                        errors.consent ? "error-consent" : undefined
                      }
                    />
                    <span>{copy.contact.consent}</span>
                  </label>
                  {errors.consent && (
                    <span className={styles.fieldError} id="error-consent">
                      {errors.consent}
                    </span>
                  )}
                  <label className={styles.consent}>
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(event) => {
                        setMarketingConsent(event.target.checked);
                        setAttributionConsent(event.target.checked);
                      }}
                    />
                    <span>{ui.marketingConsent}</span>
                  </label>
                  <Link className={styles.privacy} href="/privacy-policy">
                    {ui.privacyLabel}
                  </Link>
                </>
              )}
              {state.step === 4 && (
                <>
                  <dl className={styles.review}>
                    {summary.map((item) => (
                      <div key={item.key}>
                        <dt>
                          {
                            copy.review.labels[
                              item.key as keyof typeof copy.review.labels
                            ]
                          }
                        </dt>
                        <dd>{item.value}</dd>
                        <button
                          type="button"
                          onClick={() =>
                            goTo(
                              item.step,
                              "phase" in item ? item.phase : "questions",
                            )
                          }
                          aria-label={`${copy.review.editLabel} ${copy.review.labels[item.key as keyof typeof copy.review.labels]}`}
                        >
                          {copy.review.editLabel}
                        </button>
                      </div>
                    ))}
                    <div>
                      <dt>{ui.consentLabel}</dt>
                      <dd>{ui.consentValue}</dd>
                      <button
                        type="button"
                        onClick={() => goTo(3)}
                        aria-label={`${copy.review.editLabel} ${ui.consentLabel}`}
                      >
                        {copy.review.editLabel}
                      </button>
                    </div>
                  </dl>
                  <div className={styles.promise}>
                    <h3>{copy.review.promise.title}</h3>
                    <p>
                      {copy.review.promise.body.pre}
                      <strong>{copy.review.promise.body.strong}</strong>
                      {copy.review.promise.body.post}
                    </p>
                    <p>
                      {copy.review.say.pre}
                      <strong>{copy.review.say.strong}</strong>
                      {copy.review.say.post}
                    </p>
                  </div>
                </>
              )}
            </fieldset>
            {Object.keys(errors).length > 0 && (
              <div className={styles.errorSummary} role="alert">
                {errors.submit ?? errors.option ?? ui.validationSummary}
                {errors.submit && (
                  <p>
                    <a href={telHref(site.phone)}>
                      {site.cta.call} {site.phone.display}
                    </a>{" "}
                    · <a href={smsHref(site.smsPhone)}>{site.cta.text}</a>
                  </p>
                )}
              </div>
            )}
            <div className={styles.controls} data-quote-controls="true">
              <button
                type="button"
                className="btn btn-cream"
                disabled={busy}
                onClick={() =>
                  state.step === 0
                    ? goTo(0, "zip")
                    : goTo((state.step - 1) as Step)
                }
              >
                <span aria-hidden="true">← </span>
                {copy.footer.back}
              </button>
              <button type="submit" className="btn btn-red" disabled={busy}>
                {busy
                  ? copy.footer.submitting
                  : state.phase === "error"
                    ? ui.retry
                    : state.step === 4
                      ? copy.footer.submit
                      : state.step === 3
                        ? copy.footer.review
                        : copy.footer.next}
                <span aria-hidden="true"> →</span>
              </button>
            </div>
            <span className={styles.status} role="status">
              {busy
                ? copy.footer.submitting
                : state.step < 3
                  ? ui.selectionHint
                  : ""}
            </span>
          </form>
        )}
      </div>
      <p className={styles.demoNote}>{ui.demoNote}</p>
    </div>
  );
}
