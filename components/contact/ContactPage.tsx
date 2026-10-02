"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, MapPin, Phone } from "lucide-react";
import { Button } from "../Button";
import {
  CONCEPTA_ADDRESS_DISPLAY,
  CONCEPTA_LEGAL_NAME,
  CONCEPTA_MAP_URL,
  CONCEPTA_PHONE_DISPLAY,
  CONCEPTA_PHONE_HREF,
} from "../constants";
import { HeroBackground } from "../HeroBackground";

type Status = "idle" | "loading" | "success" | "error";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "", website: "" };

export function ContactPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  function update(field: keyof typeof EMPTY_FORM) {
    return (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage(data.message || "Thanks — we'll be in touch soon.");
        setForm(EMPTY_FORM);
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  const disabled = status === "loading";

  return (
    <>
      <HeroBackground />
      <main className="contact-main relative z-10">
        <header className="contact-header">
          <span className="contact-kicker">Contact</span>
          <h1>Let&apos;s talk about what you&apos;re shipping.</h1>
          <p>
            Tell us about your project and we&apos;ll get back to you shortly.
          </p>
        </header>

        <div className="contact-grid">
          <section className="contact-panel" aria-labelledby="contact-form-title">
            <h2 id="contact-form-title" className="sr-only">
              Send us a message
            </h2>
            {status === "success" ? (
              <p className="contact-success" aria-live="polite">
                <CheckCircle2 size={20} strokeWidth={2} />
                {message}
              </p>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-row">
                  <label className="contact-field">
                    <span>Name</span>
                    <input
                      type="text"
                      name="name"
                      required
                      maxLength={200}
                      autoComplete="name"
                      value={form.name}
                      onChange={update("name")}
                      disabled={disabled}
                    />
                  </label>
                  <label className="contact-field">
                    <span>Email</span>
                    <input
                      type="email"
                      name="email"
                      required
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={form.email}
                      onChange={update("email")}
                      disabled={disabled}
                    />
                  </label>
                </div>
                <label className="contact-field">
                  <span>Subject</span>
                  <input
                    type="text"
                    name="subject"
                    required
                    maxLength={200}
                    value={form.subject}
                    onChange={update("subject")}
                    disabled={disabled}
                  />
                </label>
                <label className="contact-field">
                  <span>Message</span>
                  <textarea
                    name="message"
                    required
                    rows={7}
                    maxLength={5000}
                    value={form.message}
                    onChange={update("message")}
                    disabled={disabled}
                  />
                </label>
                {/* Honeypot — hidden from people and assistive tech */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="contact-hp"
                  value={form.website}
                  onChange={update("website")}
                />
                <div className="contact-actions">
                  <Button
                    type="submit"
                    arrow="right"
                    disabled={disabled}
                    className="contact-btn w-full sm:w-auto"
                  >
                    <>{disabled ? "Sending…" : "Send message"}</>
                  </Button>
                  {status === "error" && (
                    <p className="contact-error" role="alert">
                      {message}
                    </p>
                  )}
                </div>
              </form>
            )}
          </section>

          <address className="contact-details" aria-label="Concepta contact information">
            <strong>{CONCEPTA_LEGAL_NAME}</strong>
            <a className="contact-detail" href={CONCEPTA_PHONE_HREF}>
              <Phone aria-hidden="true" className="h-4 w-4" />
              {CONCEPTA_PHONE_DISPLAY}
            </a>
            <a
              className="contact-detail"
              href={CONCEPTA_MAP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${CONCEPTA_ADDRESS_DISPLAY} in Google Maps`}
            >
              <MapPin aria-hidden="true" className="h-4 w-4" />
              <span>{CONCEPTA_ADDRESS_DISPLAY}</span>
              <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </address>
        </div>
      </main>

      <style jsx global>{`
        html[data-product="concepta"] .concepta-hero-background {
          left: 0;
          width: 100%;
          transform: none;
        }

        .contact-main {
          width: min(100% - 32px, 1040px);
          margin-inline: auto;
          padding: 88px 0 112px;
        }

        .contact-header {
          max-width: 640px;
          margin-bottom: 48px;
        }

        .contact-kicker {
          display: inline-block;
          font-family: var(--font-jetbrains-mono), ui-monospace, monospace;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #00ebbc;
        }

        .contact-header h1 {
          margin-top: 16px;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #fff;
        }

        .contact-header p {
          margin-top: 16px;
          font-size: 1.125rem;
          line-height: 1.6;
          color: var(--mix-text-muted);
        }

        .contact-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 300px;
          gap: 24px;
          align-items: start;
        }

        .contact-panel,
        .contact-details {
          border: 1px solid var(--mix-border-card);
          border-radius: 16px;
          background: color-mix(in srgb, var(--mix-surface) 80%, transparent);
          backdrop-filter: blur(12px);
        }

        .contact-panel {
          padding: 28px;
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .contact-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }

        .contact-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .contact-field span {
          font-size: 14px;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.85);
        }

        .contact-field input,
        .contact-field textarea {
          width: 100%;
          padding: 10px 14px;
          font-size: 15px;
          color: #fff;
          background: var(--mix-surface-bright);
          border: 1px solid var(--mix-border-card);
          border-radius: 10px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .contact-field textarea {
          resize: vertical;
          min-height: 160px;
        }

        .contact-field input::placeholder {
          color: rgba(255, 255, 255, 0.35);
        }

        .contact-field input:focus,
        .contact-field textarea:focus {
          border-color: var(--mix-accent);
          box-shadow: 0 0 0 3px var(--mix-accent-low);
        }

        .contact-field input:disabled,
        .contact-field textarea:disabled {
          opacity: 0.6;
        }

        .contact-hp {
          position: absolute;
          left: -10000px;
          width: 1px;
          height: 1px;
          opacity: 0;
        }

        .contact-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
          margin-top: 4px;
        }

        .contact-btn {
          background: #3a5bff !important;
          box-shadow: 0 4px 20px rgba(58, 91, 255, 0.3) !important;
        }

        .contact-btn:hover:not(:disabled) {
          background: #4963ff !important;
          box-shadow: 0 6px 25px rgba(58, 91, 255, 0.4) !important;
        }

        .contact-btn:disabled {
          opacity: 0.7;
          cursor: wait;
        }

        .contact-error {
          font-size: 14px;
          color: #f87171;
        }

        .contact-success {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1rem;
          color: #00ebbc;
        }

        .contact-details {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 24px;
          font-style: normal;
        }

        .contact-details strong {
          font-size: 15px;
          font-weight: 600;
          color: #fff;
        }

        .contact-detail {
          display: inline-flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          line-height: 1.5;
          color: var(--mix-text-muted);
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .contact-detail svg {
          flex-shrink: 0;
          margin-top: 3px;
        }

        .contact-detail:hover {
          color: #fff;
        }

        .contact-detail:focus-visible {
          outline: 2px solid var(--mix-accent);
          outline-offset: 3px;
          border-radius: 4px;
        }

        @media (max-width: 767px) {
          .contact-main {
            padding-top: 48px;
          }

          .contact-grid,
          .contact-row {
            grid-template-columns: 1fr;
          }

          .contact-panel {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
}
