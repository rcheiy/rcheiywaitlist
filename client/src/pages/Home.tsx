/**
 * Powder Room Editorial — white space is the luxury; blush #F39BE2 is a tactile signal.
 * The page intentionally uses a left-led editorial spread with a cropped sculpture at the right edge.
 */
import { FormEvent, useState } from "react";
import { ArrowRight, Check, Circle, Sparkles } from "lucide-react";

type ContactMethod = "email" | "phone";

export default function Home() {
  const [method, setMethod] = useState<ContactMethod>("email");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const placeholder = method === "email" ? "you@email.com" : "Your phone number";

  function changeMethod(nextMethod: ContactMethod) {
    setMethod(nextMethod);
    setContact("");
    setError("");
  }

  function submitWaitlist(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const emailIsValid = /^\S+@\S+\.\S+$/.test(contact.trim());
    const phoneIsValid = /^[+\d][\d\s().-]{6,}$/.test(contact.trim());
    const isValid = method === "email" ? emailIsValid : phoneIsValid;

    if (!isValid) {
      setError(method === "email" ? "Enter a valid email address." : "Enter a valid phone number.");
      return;
    }

    setError("");
    setSubmitted(true);
  }

  return (
    <div className="waitlist-page">
      <div className="page-grain" aria-hidden="true" />

      <header className="masthead">
        <a className="brand-lockup" href="#top" aria-label="The First Edit home">
          <img src="/manus-storage/petal-symbol_4213f8be.png" alt="" className="brand-symbol" />
          <span>THE FIRST EDIT</span>
        </a>
        <p className="masthead-status"><span className="status-dot" />EST. SOON</p>
      </header>

      <main id="top" className="editorial-stage">
        <aside className="margin-note note-release" aria-label="Release note">
          <span className="note-number">01</span>
          <p>PRIVATE<br />RELEASE</p>
          <span className="note-line" />
          <p className="note-small">JOIN THE LIST<br />FOR FIRST ACCESS</p>
        </aside>

        <section className="hero-copy" aria-labelledby="waitlist-title">
          <div className="eyebrow"><Circle aria-hidden="true" /> COLLECTION 01 — IN THE WORKS</div>
          <h1 id="waitlist-title">The first look<br /><em>is almost yours.</em></h1>
          <p className="intro-copy">A considered wardrobe is taking shape. Leave a detail, and we’ll send the release directly to you.</p>

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
                    aria-describedby={error ? "contact-error" : "contact-note"}
                  />
                  <button type="submit" className="join-button" aria-label="Join the waitlist">
                    <span>JOIN</span><ArrowRight aria-hidden="true" />
                  </button>
                </div>
                {error ? <p id="contact-error" className="form-error" role="alert">{error}</p> : <p id="contact-note" className="form-note">One launch note. Nothing else.</p>}
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
          <span className="orbit orbit-one" />
          <span className="orbit orbit-two" />
          <img className="hero-orb" src="/manus-storage/rose-orb-hero_f12b5070.png" alt="" />
          <div className="orb-caption"><Sparkles aria-hidden="true" /><span>SOFT SIGNAL<br />#F39BE2</span></div>
        </div>

        <aside className="material-card" aria-label="Material note">
          <div className="material-image-wrap"><img src="/manus-storage/fabric-note_69174b7c.png" alt="A blush organza fabric detail" className="material-image" /></div>
          <div className="material-copy"><span>STUDIO NOTE</span><p>Made to be<br />worn into.</p></div>
          <img src="/manus-storage/pink-swatch_52896b7f.png" alt="" className="material-swatch" />
        </aside>
      </main>

      <footer className="page-footer">
        <p>© 2026 THE FIRST EDIT</p>
        <p>FOR THE ONES WHO ARRIVE EARLY</p>
      </footer>
    </div>
  );
}
