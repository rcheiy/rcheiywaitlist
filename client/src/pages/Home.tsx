/**
 * Powder Room Editorial — white space is the luxury; blush #F39BE2 is a tactile signal.
 * The page intentionally uses a left-led editorial spread with a cropped sculpture at the right edge.
 */
import { FormEvent, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { trpc } from "@/lib/trpc";

type ContactMethod = "email" | "phone";

export default function Home() {
  const [method, setMethod] = useState<ContactMethod>("email");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const submitMutation = trpc.waitlist.submit.useMutation({
    onSuccess: () => setSubmitted(true),
    onError: (mutationError) => setError(mutationError.message || "Something went wrong. Please try again."),
  });

  const placeholder = method === "email" ? "you@email.com" : "Your phone number";

  function changeMethod(nextMethod: ContactMethod) {
    setMethod(nextMethod);
    setContact("");
    setError("");
  }

  function submitWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedPhone = contact.trim().replace(/[^+\d]/g, "");
    const emailIsValid = /^\S+@\S+\.\S+$/.test(contact.trim());
    const phoneIsValid = /^[+\d][\d]{6,}$/.test(normalizedPhone);
    const isValid = method === "email" ? emailIsValid : phoneIsValid;

    if (!isValid) {
      setError(method === "email" ? "Enter a valid email address." : "Enter a valid phone number.");
      return;
    }

    setError("");
    submitMutation.mutate({ method, contact: contact.trim() });
  }

  return (
    <div className="waitlist-page">
      <div className="page-grain" aria-hidden="true" />

      <header className="masthead">
        {/* Removed brand lockup and status per request */}
      </header>

      <main id="top" className="editorial-stage">
        {/* Removed margin note per request */}

        <section className="hero-copy" aria-labelledby="waitlist-title">
          <div className="eyebrow">COLLECTION 01</div>
          <h1 id="waitlist-title">The <span className="headline-first"><span className="first-letter">f</span>irst</span> look<br /><em>is almost here.</em></h1>

          <div className="waitlist-panel">
            {!submitted ? (
              <form onSubmit={submitWaitlist} noValidate>
                <div className="method-row" aria-label="Choose contact method">
                  <button
                    type="button"
                    className={method === "email" ? "method-button active" : "method-button"}
                    onClick={() => changeMethod("email")}
                    aria-pressed={method === "email"}
                  >
                    Email
                  </button>
                  <button
                    type="button"
                    className={method === "phone" ? "method-button active" : "method-button"}
                    onClick={() => changeMethod("phone")}
                    aria-pressed={method === "phone"}
                  >
                    Phone number
                  </button>
                </div>

                <label className="sr-only" htmlFor="waitlist-contact">{method === "email" ? "Email address" : "Phone number"}</label>
                <div className={error ? "input-shell has-error" : "input-shell"}>
                  <input
                    id="waitlist-contact"
                    type={method === "email" ? "email" : "tel"}
                    autoComplete={method === "email" ? "email" : "tel"}
                    inputMode={method === "email" ? "email" : "tel"}
                    value={contact}
                    onChange={(event) => { setContact(event.target.value); setError(""); }}
                    placeholder={placeholder}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "contact-error" : undefined}
                  />
                  <button type="submit" className="join-button" aria-label="Join the waitlist" disabled={submitMutation.isPending}>
                    <span>{submitMutation.isPending ? "SENDING" : "JOIN"}</span><ArrowRight aria-hidden="true" />
                  </button>
                </div>
                {error ? <p id="contact-error" className="form-error" role="alert">{error}</p> : null}
              </form>
            ) : (
              <div className="success-state" role="status">
                <span className="success-mark"><Check aria-hidden="true" /></span>
                <div>
                  <p className="success-eyebrow">YOU’RE ON THE LIST</p>
                  <h2>Kept close.</h2>
                  <p>We’ll be in touch before the release.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="orb-composition" aria-hidden="true">
          <img className="hero-orb" src="/manus-storage/rose-orb-hero_f12b5070.png" alt="" />
        </div>

        {/* Removed material card per request */}
      </main>


    </div>
  );
}
