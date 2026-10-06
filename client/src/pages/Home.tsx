import { FormEvent, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, Check, Instagram, Mail, X } from "lucide-react";
import { trpc } from "@/lib/trpc";

type ProjectId = "flthymrkt" | "top-seller" | "blank-piece" | "extra-pz" | "drake" | "magic-city-tana";
type ContactMethod = "email" | "phone";

type Project = {
  id: ProjectId;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tone?: string;
  image?: string;
  href?: string;
};

const fashionProjects: Project[] = [
  {
    id: "flthymrkt",
    number: "2.1",
    title: "FlthyMrkt",
    subtitle: "vintage / luxury showroom",
    description: "FlthyMrkt is a vintage and luxury online store that will become an in-person showroom. I have been building it by collecting some of the hardest clothes to get your hands on in the world — pieces worn by rappers, actors, and athletes.",
    image: "/manus-storage/flthymrkt_logo_dcdd358e.png",
    href: "https://flthymrkt.com",
  },
  {
    id: "top-seller",
    number: "2.2",
    title: "Top seller in my home town",
    subtitle: "ambition",
    description: "",
    image: "/manus-storage/virginia-handdrawn_e924cb2a.svg",
    href: "https://www.virginia.gov/",
  },
  {
    id: "blank-piece",
    number: "2.3",
    title: "Design a top selling blank piece",
    subtitle: "blank / in progress",
    description: "Design something one of a kind.",
    image: "/manus-storage/m-Photoroom_41dfdba4.png",
    href: "https://www.instagram.com/flthymrkt/",
  },
];

const musicProjects: Project[] = [
  { id: "extra-pz", number: "3.1", title: "Extra by pz", subtitle: "Extra (Extra) / 2026", description: "Single cover.", image: "/manus-storage/pz-extra_ba3f6fd0.jpg", href: "https://music.apple.com/us/album/extra-extra-single/6776867135" },
  { id: "drake", number: "3.2", title: "Drake / Take Care", subtitle: "Take Care / 2011", description: "Album cover reference.", image: "/manus-storage/drake-take-care_f8cb750b.jpg", href: "https://music.apple.com/us/album/take-care-deluxe-version/1440642493" },
  { id: "magic-city-tana", number: "3.3", title: "Magic City tana", subtitle: "Magic City / 2025", description: "Single cover.", image: "/manus-storage/tana-magic-city_7dfdb984.jpg", href: "https://music.apple.com/us/album/magic-city-single/1846677960" },
];

const contactLinks = [
  { number: "4.1", label: "43rf", href: "https://www.instagram.com/43rf/", icon: Instagram },
  { number: "4.2", label: "Flthymrkt", href: "https://www.instagram.com/flthymrkt/", icon: Instagram },
];

function getContactMethod(value: string): ContactMethod {
  return value.includes("@") ? "email" : "phone";
}

export default function Home() {
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectId | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [trap, setTrap] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submitMutation = trpc.waitlist.submit.useMutation({
    onSuccess: () => { setSubmitted(true); setError(""); },
    onError: (mutationError) => setError(mutationError.message || "Something went wrong. Please try again."),
  });
  const allProjects = useMemo(() => [...fashionProjects, ...musicProjects], []);
  const activeProject = allProjects.find((project) => project.id === selectedProject);

  function openProject(id: ProjectId) {
    setSelectedProject(id);
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "center" }));
  }

  function openContact() { setContactOpen(true); setSubmitted(false); setError(""); }
  function closeContact() { setContactOpen(false); setError(""); }

  function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanContact = contact.trim();
    const cleanMessage = message.trim();
    const method = getContactMethod(cleanContact);
    const normalizedPhone = cleanContact.replace(/[^+\d]/g, "");
    const validEmail = /^\S+@\S+\.\S+$/.test(cleanContact);
    const validPhone = /^[+\d][\d]{6,}$/.test(normalizedPhone);
    if (trap) return;
    if (cleanName.length < 2) { setError("Add your name so I know who is writing."); return; }
    if (method === "email" ? !validEmail : !validPhone) { setError(method === "email" ? "Enter a valid email address." : "Enter a valid phone number."); return; }
    if (cleanMessage.length < 3) { setError("Tell me a little about what you need."); return; }
    setError("");
    submitMutation.mutate({ method, contact: cleanContact, name: cleanName, message: cleanMessage, website: trap });
  }

  return (
    <div className={`portfolio-shell${contactOpen ? " drawer-is-open" : ""}`}>
      <div className="paper-noise" aria-hidden="true" />
      <header className="portfolio-header">
        <button className="header-home" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>top <ArrowUp aria-hidden="true" /></button>
        <button className="header-index" type="button" onClick={() => document.getElementById("contents")?.scrollIntoView({ behavior: "smooth" })}>Menu <ArrowDown aria-hidden="true" /></button>
      </header>

      <main id="top" className="portfolio-main">
        <section className="book-spread intro-spread" id="about" aria-labelledby="intro-title">
          <div className="book-page page-left">
            <h1 id="intro-title">we're remastering<br /><em>the way it feels.</em></h1>
            <p className="intro-note">It may be confusing at first, but just do what you would do on any website — move your cursor over different areas, scroll and click.<br /><br />You'll figure it out.</p>
            <div className="intro-footer"><span>01 / 04</span><span>Virginia, USA</span></div>
          </div>
          <div className="book-page page-right intro-image-page"><img className="ry-logo-image" src="/manus-storage/RY-PFP_1509d341.png" alt="RY logo" /><span className="folio-number">01</span></div>
        </section>

        <section className="contents-spread" id="contents" aria-labelledby="contents-title">
          <div className="contents-intro"><p className="page-kicker">contents / click to open a spread</p><h2 id="contents-title">Rcheiy<br /><em>portfolio.</em></h2><p>Not a catalog. More like a desk with the good pages left open.</p><span className="scroll-cue"><ArrowDown aria-hidden="true" /> scroll / select</span></div>
          <nav className="contents-list" aria-label="Portfolio contents">
            <a href="#about" className="toc-row toc-section-link"><span>1.</span><strong>About</strong></a>
            <div className="toc-group"><a href="#fashion" className="toc-row toc-section-link"><span>2.</span><strong>Fashion Projects</strong></a>{fashionProjects.map((project) => <a className="toc-row toc-project" href={project.href} target="_blank" rel="noreferrer" key={project.id}><span>{project.number}</span><strong>{project.title}</strong><ArrowUpRight aria-hidden="true" /></a>)}</div>
            <div className="toc-group"><a href="#music" className="toc-row toc-section-link"><span>3.</span><strong>Music</strong></a>{musicProjects.map((project) => <a className="toc-row toc-project" href={project.href} target="_blank" rel="noreferrer" key={project.id}><span>{project.number}</span><strong>{project.title}</strong><ArrowUpRight aria-hidden="true" /></a>)}</div>
            <div className="toc-group"><a href="#contact" className="toc-row toc-section-link"><span>4.</span><strong>Contact</strong></a>{contactLinks.map(({ number, label, href, icon: Icon }) => <a className="toc-row toc-project external-link" href={href} target="_blank" rel="noreferrer" key={number}><span>{number}</span><strong>{label}</strong><Icon aria-hidden="true" /></a>)}<button className="toc-row toc-project contact-trigger" type="button" onClick={openContact}><span>4.3</span><strong>contact here</strong><ArrowUpRight aria-hidden="true" /></button></div>
          </nav>
        </section>

        <section className="chapter-intro" id="fashion" aria-labelledby="fashion-title"><span className="chapter-number">02</span><div><p className="page-kicker">chapter two</p><h2 id="fashion-title">Fashion<br /><em>Projects</em></h2></div></section>
        {fashionProjects.map((project) => <ProjectSpread key={project.id} project={project} active={selectedProject === project.id} onOpen={() => setSelectedProject(project.id)} />)}
        <section className="chapter-intro" id="music" aria-labelledby="music-title"><span className="chapter-number">03</span><div><p className="page-kicker">chapter three</p><h2 id="music-title">Music</h2></div><p>Cover studies, references, and the visual temperature of a song before anyone presses play.</p></section>
        {musicProjects.map((project) => <ProjectSpread key={project.id} project={project} active={selectedProject === project.id} onOpen={() => setSelectedProject(project.id)} />)}

        <section className="contact-spread" id="contact" aria-labelledby="contact-title"><div className="contact-page-left"><span className="chapter-number">04</span><p className="page-kicker">chapter four</p><h2 id="contact-title">4. Contact<br /><em>here.</em></h2><p>If you have a project, a garment, a song, or a reason to say hello, contact here.</p></div><div className="contact-page-right">{contactLinks.map(({ number, label, href, icon: Icon }) => <a className="contact-link-card" href={href} target="_blank" rel="noreferrer" key={number}><span>{number}</span><strong>{label}</strong><Icon aria-hidden="true" /></a>)}<button className="contact-link-card contact-link-button" type="button" onClick={openContact}><span>4.3</span><strong>contact here</strong><ArrowUpRight aria-hidden="true" /></button><p className="contact-footnote">your words stay on this site until the right conversation starts.</p></div></section>
      </main>

      
      <div className={`drawer-backdrop${contactOpen ? " is-visible" : ""}`} onClick={closeContact} aria-hidden="true" />
      <aside className={`contact-drawer${contactOpen ? " is-open" : ""}`} aria-label="Contact Rcheiy" aria-hidden={!contactOpen}>
        <div className="drawer-topline"><div><span className="page-kicker">4.3 / contact here</span><h2>say what<br /><em>you need.</em></h2></div><button className="drawer-close" type="button" onClick={closeContact} aria-label="Close contact panel"><X aria-hidden="true" /></button></div>
        {!submitted ? <form className="contact-form" onSubmit={submitContact} noValidate><label htmlFor="contact-name">name<input id="contact-name" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} autoComplete="name" placeholder="your name" /></label><label htmlFor="contact-contact">email or number<input id="contact-contact" value={contact} onChange={(event) => { setContact(event.target.value); setError(""); }} autoComplete="email" inputMode="email" placeholder="how should I reach you?" /></label><label htmlFor="contact-message">what do you need?<textarea id="contact-message" value={message} onChange={(event) => { setMessage(event.target.value); setError(""); }} placeholder="a project, a garment, a song..." rows={5} /></label><label className="contact-trap" aria-hidden="true">website<input tabIndex={-1} autoComplete="off" value={trap} onChange={(event) => setTrap(event.target.value)} /></label>{error ? <p className="contact-error" role="alert">{error}</p> : null}<button className="send-button" type="submit" disabled={submitMutation.isPending}><span>{submitMutation.isPending ? "SENDING" : "SEND IT"}</span><ArrowUpRight aria-hidden="true" /></button><p className="form-privacy"><Mail aria-hidden="true" /> Your details are stored securely for this conversation only.</p></form> : <div className="contact-success" role="status"><span className="success-badge"><Check aria-hidden="true" /></span><p className="page-kicker">message received</p><h3>good.<br /><em>I’ll get back to you.</em></h3><button type="button" onClick={() => { setSubmitted(false); setName(""); setContact(""); setMessage(""); }}>send another</button></div>}
        {activeProject ? <p className="drawer-project-note">You opened <strong>{activeProject.title}</strong> before reaching out.</p> : null}
      </aside>
    </div>
  );
}

function ProjectSpread({ project, active, onOpen }: { project: Project; active: boolean; onOpen: () => void }) {
  return <section className={`project-spread${active ? " is-active" : ""}`} id={project.id} aria-labelledby={`${project.id}-title`}><div className="project-copy"><a className="project-index" href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><span>{project.number}</span><ArrowUpRight aria-hidden="true" /></a><p className="page-kicker">{project.subtitle}</p><h3 id={`${project.id}-title`}>{project.title}</h3><p>{project.description}</p><span className="project-status">{project.image ? "cover art" : project.id === "blank-piece" ? "image to be added" : "direction / placeholder spread"}</span></div><div className={`project-visual visual-${project.id} ${project.tone ? `tone-${project.tone}` : ""}`} aria-label={`${project.title} project visual`}>{project.image ? <a className="project-image-link" href={project.href} target="_blank" rel="noreferrer" aria-label={`Open ${project.title}`}><img className={`project-image project-image-${project.id}`} src={project.image} alt={`${project.title} project visual`} /></a> : null}<span className="visual-folio">{project.number}</span></div></section>;
}
