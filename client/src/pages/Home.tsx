import { FormEvent, useMemo, useState } from "react";
import { ArrowDown, ArrowUpRight, Check, Instagram, Mail, X } from "lucide-react";
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
};

const fashionProjects: Project[] = [
  {
    id: "flthymrkt",
    number: "2.1",
    title: "FlthyMrkt",
    subtitle: "brand direction / logo system",
    description: "A mark for the market before the market exists. FlthyMrkt is built around the tension between a clean silhouette and the mess that makes a place feel lived in.",
  },
  {
    id: "top-seller",
    number: "2.2",
    title: "Top seller in my home town",
    subtitle: "a local ambition",
    description: "I want this to be the piece people point to when they talk about where I am from. Virginia is home: the roads, the heat, the quiet confidence, and the feeling that the best thing in the room does not need to announce itself. The goal is simple and difficult at the same time — make something that feels specific enough to belong to my city, but universal enough to become the top seller wherever it travels. I want the garment to carry that story without turning it into a costume: strong construction, a recognizable shape, and a graphic language that feels like it was found rather than forced. If it sells, it should sell because the idea is clear and the piece earns its place in somebody’s rotation.",
  },
  {
    id: "blank-piece",
    number: "2.3",
    title: "Design a top selling blank piece",
    subtitle: "blank / in progress",
    description: "A quiet base with enough shape to carry everything that comes next. The final blank-piece photography will live here.",
  },
];

const musicProjects: Project[] = [
  { id: "extra-pz", number: "3.1", title: "Extra by pz", subtitle: "cover study", description: "A cover direction for a song that feels like it is still moving after the track ends.", tone: "oxide" },
  { id: "drake", number: "3.2", title: "Drake / any song", subtitle: "cover study", description: "A placeholder spread for the song reference and cover image you want to lock in later.", tone: "silver" },
  { id: "magic-city-tana", number: "3.3", title: "Magic city tana", subtitle: "cover study", description: "A bright, nocturnal cover study with room for the final artwork or album reference.", tone: "night" },
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
        <a className="brand-mark" href="#top" aria-label="Rcheiy home"><span className="brand-monogram">RY</span><span className="brand-word">rcheiy</span></a>
        <div className="header-caption">created for rcheiy / 01</div>
        <button className="header-index" type="button" onClick={() => document.getElementById("contents")?.scrollIntoView({ behavior: "smooth" })}>index <ArrowDown aria-hidden="true" /></button>
      </header>

      <main id="top" className="portfolio-main">
        <section className="book-spread intro-spread" id="about" aria-labelledby="intro-title">
          <div className="book-page page-left">
            <p className="page-kicker">Rcheiy / a book in progress</p>
            <h1 id="intro-title">we're remastering<br /><em>the way it feels.</em></h1>
            <p className="intro-note">A working archive of clothing, music, and ideas from Virginia. Move slowly. Hover around. Click the names that pull you in.</p>
            <div className="intro-footer"><span>01 / 04</span><span>Virginia, USA</span></div>
          </div>
          <div className="book-page page-right intro-image-page"><div className="ry-field" aria-hidden="true"><span className="ry-field-small">RY</span><span className="ry-field-large">R<br />Y</span><span className="ry-field-note">rcheiy / remastering</span></div><span className="folio-number">01</span></div>
        </section>

        <section className="contents-spread" id="contents" aria-labelledby="contents-title">
          <div className="contents-intro"><p className="page-kicker">contents / click to open a spread</p><h2 id="contents-title">Rcheiy<br /><em>portfolio.</em></h2><p>Not a catalog. More like a desk with the good pages left open.</p><span className="scroll-cue"><ArrowDown aria-hidden="true" /> scroll / select</span></div>
          <nav className="contents-list" aria-label="Portfolio contents">
            <a href="#about" className="toc-row toc-section-link"><span>1.</span><strong>About</strong></a>
            <div className="toc-group"><a href="#fashion" className="toc-row toc-section-link"><span>2.</span><strong>Fashion Projects</strong></a>{fashionProjects.map((project) => <button className={`toc-row toc-project${selectedProject === project.id ? " is-selected" : ""}`} type="button" key={project.id} onClick={() => openProject(project.id)}><span>{project.number}</span><strong>{project.title}</strong></button>)}</div>
            <div className="toc-group"><a href="#music" className="toc-row toc-section-link"><span>3.</span><strong>Best Music</strong></a>{musicProjects.map((project) => <button className={`toc-row toc-project${selectedProject === project.id ? " is-selected" : ""}`} type="button" key={project.id} onClick={() => openProject(project.id)}><span>{project.number}</span><strong>{project.title}</strong></button>)}</div>
            <div className="toc-group"><a href="#contact" className="toc-row toc-section-link"><span>4.</span><strong>Contact</strong></a>{contactLinks.map(({ number, label, href, icon: Icon }) => <a className="toc-row toc-project external-link" href={href} target="_blank" rel="noreferrer" key={number}><span>{number}</span><strong>{label}</strong><Icon aria-hidden="true" /></a>)}<button className="toc-row toc-project contact-trigger" type="button" onClick={openContact}><span>4.3</span><strong>contact through HERE</strong><ArrowUpRight aria-hidden="true" /></button></div>
          </nav>
        </section>

        <section className="chapter-intro" id="fashion" aria-labelledby="fashion-title"><span className="chapter-number">02</span><div><p className="page-kicker">chapter two</p><h2 id="fashion-title">Fashion<br /><em>Projects</em></h2></div><p>Three directions for the things people wear until they become part of the story.</p></section>
        {fashionProjects.map((project) => <ProjectSpread key={project.id} project={project} active={selectedProject === project.id} onOpen={() => setSelectedProject(project.id)} />)}
        <section className="chapter-intro" id="music" aria-labelledby="music-title"><span className="chapter-number">03</span><div><p className="page-kicker">chapter three</p><h2 id="music-title">Best<br /><em>Music</em></h2></div><p>Cover studies, references, and the visual temperature of a song before anyone presses play.</p></section>
        {musicProjects.map((project) => <ProjectSpread key={project.id} project={project} active={selectedProject === project.id} onOpen={() => setSelectedProject(project.id)} />)}

        <section className="contact-spread" id="contact" aria-labelledby="contact-title"><div className="contact-page-left"><span className="chapter-number">04</span><p className="page-kicker">chapter four</p><h2 id="contact-title">Contact<br /><em>the book.</em></h2><p>If you have a project, a garment, a song, or a reason to say hello, use the door on the right.</p></div><div className="contact-page-right">{contactLinks.map(({ number, label, href, icon: Icon }) => <a className="contact-link-card" href={href} target="_blank" rel="noreferrer" key={number}><span>{number}</span><strong>{label}</strong><Icon aria-hidden="true" /></a>)}<button className="contact-link-card contact-link-button" type="button" onClick={openContact}><span>4.3</span><strong>contact through HERE</strong><ArrowUpRight aria-hidden="true" /></button><p className="contact-footnote">your words stay on this site until the right conversation starts.</p></div></section>
      </main>

      <footer className="portfolio-footer"><span>Rcheiy / we're remastering</span><span>scroll slowly / 2026</span></footer>
      <div className={`drawer-backdrop${contactOpen ? " is-visible" : ""}`} onClick={closeContact} aria-hidden="true" />
      <aside className={`contact-drawer${contactOpen ? " is-open" : ""}`} aria-label="Contact Rcheiy" aria-hidden={!contactOpen}>
        <div className="drawer-topline"><div><span className="page-kicker">4.3 / contact through here</span><h2>say what<br /><em>you need.</em></h2></div><button className="drawer-close" type="button" onClick={closeContact} aria-label="Close contact panel"><X aria-hidden="true" /></button></div>
        {!submitted ? <form className="contact-form" onSubmit={submitContact} noValidate><label htmlFor="contact-name">name<input id="contact-name" value={name} onChange={(event) => { setName(event.target.value); setError(""); }} autoComplete="name" placeholder="your name" /></label><label htmlFor="contact-contact">email or number<input id="contact-contact" value={contact} onChange={(event) => { setContact(event.target.value); setError(""); }} autoComplete="email" inputMode="email" placeholder="how should I reach you?" /></label><label htmlFor="contact-message">what do you need?<textarea id="contact-message" value={message} onChange={(event) => { setMessage(event.target.value); setError(""); }} placeholder="a project, a garment, a song..." rows={5} /></label><label className="contact-trap" aria-hidden="true">website<input tabIndex={-1} autoComplete="off" value={trap} onChange={(event) => setTrap(event.target.value)} /></label>{error ? <p className="contact-error" role="alert">{error}</p> : null}<button className="send-button" type="submit" disabled={submitMutation.isPending}><span>{submitMutation.isPending ? "SENDING" : "SEND IT"}</span><ArrowUpRight aria-hidden="true" /></button><p className="form-privacy"><Mail aria-hidden="true" /> Your details are stored securely for this conversation only.</p></form> : <div className="contact-success" role="status"><span className="success-badge"><Check aria-hidden="true" /></span><p className="page-kicker">message received</p><h3>good.<br /><em>I’ll get back to you.</em></h3><button type="button" onClick={() => { setSubmitted(false); setName(""); setContact(""); setMessage(""); }}>send another</button></div>}
        {activeProject ? <p className="drawer-project-note">You opened <strong>{activeProject.title}</strong> before reaching out.</p> : null}
      </aside>
    </div>
  );
}

function ProjectSpread({ project, active, onOpen }: { project: Project; active: boolean; onOpen: () => void }) {
  return <section className={`project-spread${active ? " is-active" : ""}`} id={project.id} aria-labelledby={`${project.id}-title`}><div className="project-copy"><button className="project-index" type="button" onClick={onOpen} aria-label={`Open ${project.title}`}><span>{project.number}</span><ArrowUpRight aria-hidden="true" /></button><p className="page-kicker">{project.subtitle}</p><h3 id={`${project.id}-title`}>{project.title}</h3><p>{project.description}</p><span className="project-status">{project.id === "blank-piece" ? "image to be added" : "direction / placeholder spread"}</span></div><div className={`project-visual visual-${project.id} ${project.tone ? `tone-${project.tone}` : ""}`} aria-label={`${project.title} placeholder visual`}>{project.id === "flthymrkt" ? <div className="flthy-logo"><span>FLTHY</span><strong>MRKT</strong></div> : null}{project.id === "top-seller" ? <div className="virginia-card"><span>VIRGINIA</span><strong>TOP SELLER<br />IN MY<br />HOME TOWN</strong><small>VA / 00</small></div> : null}{project.id === "blank-piece" ? <div className="blank-piece-card"><div className="blank-neck" /><span>BLANK / 01</span></div> : null}{project.id === "extra-pz" ? <div className="cover-type"><span>EXTRA</span><small>pz / single study</small></div> : null}{project.id === "drake" ? <div className="cover-type cover-drake"><span>DRAKE</span><small>any song / reference</small></div> : null}{project.id === "magic-city-tana" ? <div className="cover-type cover-tana"><span>MAGIC<br />CITY<br />TANA</span><small>cover study</small></div> : null}<span className="visual-folio">{project.number}</span></div></section>;
}
