import Head from "next/head";
import AppearanceMenu from "../components/AppearanceMenu";
import LagosClock from "../components/LagosClock";
import StarIcon from "../components/StarIcon";
import PhotoJournal from "../components/PhotoJournal";
import LiveInterests from "../components/LiveInterests";
import ExperienceTimeline from "../components/ExperienceTimeline";
import { useEffect, useState } from "react";

const projects = [
  {
    name: "Frontend Practice",
    type: "Interface experiments",
    year: "2024",
    url: "https://frontend-practice-two.vercel.app/",
    art: "practice",
    caption: "Form follows curiosity.",
    description:
      "A collection of frontend implementations exploring layout, interaction, and visual detail.",
  },
  {
    name: "Tag Africa",
    type: "Professional services / Website",
    year: "2023",
    url: "https://www.tag-africa.org/",
    art: "africa",
    caption: "Ideas without borders.",
    description: "A landing page for a professional services organisation.",
  },
  {
    name: "Dictionary",
    type: "Personal project / Web app",
    year: "2023",
    url: "https://dictionary.abdussamadyisau.xyz",
    art: "dictionary",
    caption: "word /wɜːd/",
    description:
      "A dictionary application built as a Frontend Mentor challenge.",
  },
];

export default function Home() {
  const [theme, setTheme] = useState("auto");
  const [now, setNow] = useState(null);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ay-appearance") || "{}");
      if (["auto", "light", "dark"].includes(saved.theme))
        setTheme(saved.theme);
    } catch {}
    const tick = () => setNow(new Date());
    tick();
    const timer = setInterval(tick, 60000);
    document.addEventListener("visibilitychange", tick);
    return () => { clearInterval(timer); document.removeEventListener("visibilitychange", tick); };
  }, []);
  function changeTheme(value) {
    setTheme(value);
    try {
      localStorage.setItem("ay-appearance", JSON.stringify({ theme: value }));
    } catch {}
  }
  const resolvedTheme =
    theme === "auto"
      ? now && (now.getHours() < 7 || now.getHours() >= 19)
        ? "dark"
        : "light"
      : theme;
  useEffect(() => {
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);
  return (
    <>
      <Head>
        <title>Abdussamad Yisau — Frontend Engineer</title>
        <meta
          name="description"
          content="Frontend engineering, interfaces, and experiments by Abdussamad Yisau. Lagos, Nigeria."
        />
        <link rel="canonical" href="https://abdussamadyisau.xyz/" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Abdussamad Yisau" />
        <meta property="og:locale" content="en_NG" />
        <meta property="og:url" content="https://abdussamadyisau.xyz/" />
        <meta property="og:title" content="Abdussamad Yisau — Frontend Engineer" />
        <meta property="og:description" content="Building digital things with intention. Explore my work, experience, and life outside the code." />
        <meta property="og:image" content="https://abdussamadyisau.xyz/social-preview.png" />
        <meta property="og:image:secure_url" content="https://abdussamadyisau.xyz/social-preview.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Abdussamad Yisau — Building digital things. Frontend engineer in Lagos, Nigeria." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Abdussamad Yisau — Frontend Engineer" />
        <meta name="twitter:description" content="Building digital things with intention. Explore my work, experience, and life outside the code." />
        <meta name="twitter:image" content="https://abdussamadyisau.xyz/social-preview.png" />
        <meta name="twitter:image:alt" content="Abdussamad Yisau — Building digital things. Frontend engineer in Lagos, Nigeria." />
      </Head>
      <div
        className="portfolio signal font-grotesk"
        data-theme={resolvedTheme}
      >
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className="page-shell">
          <header className="site-header glass-menu">
            <a
              className="wordmark"
              href="#"
              aria-label="Abdussamad Yisau, home"
            >
              AY<span>®</span>
            </a>
            <nav aria-label="Main navigation">
              <a href="#work">
                Projects <sup>03</sup>
              </a>
              <a href="#roles">Experience</a>
              <a href="#interests">Interests</a>
              <a href="#contact">Reach me ↗</a>
            </nav>
            <LagosClock />
            <AppearanceMenu theme={theme} onChange={changeTheme} />
          </header>
          <section
            className="appearance-panel"
            aria-label="Appearance settings"
          >
            <fieldset className="theme-options">
              <legend>LIGHT / DARK</legend>
              {["auto", "light", "dark"].map((value) => (
                <button
                  key={value}
                  aria-pressed={theme === value}
                  onClick={() => changeTheme(value)}
                >
                  {value === "auto"
                    ? "◷ Auto"
                    : value === "light"
                      ? "☀ Light"
                      : "◐ Dark"}
                </button>
              ))}
              <span className="auto-note">
                {theme === "auto"
                  ? "Follows your local time · light 07–19"
                  : "Your preference, remembered"}
              </span>
            </fieldset>
          </section>
          <main id="main-content" tabIndex={-1}>
            <section className="hero" aria-labelledby="hero-title">
              <div className="hero-meta">
                <span>PORTFOLIO / SELECTED WORK</span>
                <span>LAGOS, NG · 06°27′ N 03°23′ E</span>
              </div>
              <div className="hero-composition">
                <div className="hero-copy">
                  <p className="eyebrow hero-introduction"><span>HELLO, I’M</span><strong>Abdussamad Yisau.</strong></p>
                  <h1 id="hero-title">
                    Building
                    <br />
                    <span>digital</span>
                    <br />
                    things<span className="period">.</span>
                  </h1>
                </div>
                <div className="hero-side">
                  <div className="hero-symbol" aria-hidden="true">
                    <StarIcon />
                  </div>
                  <p>
                    Frontend engineer.
                    <br />
                    Curious by default.
                    <br />
                    Particular about the details.
                  </p>
                  <a className="work-link" href="#work">
                    EXPLORE MY WORK <span>↙</span>
                  </a>
                </div>
              </div>
              <div className="hero-bottom">
                <span>CODE WITH INTENTION. BUILD WITH FEELING.</span>
                <span>SCROLL TO EXPLORE ↓</span>
              </div>
            </section>
            <section id="work" className="work-section">
              <div className="section-heading">
                <h2>
                  <span>01 /</span> Selected work
                </h2>
                <span>AN ONGOING EXPLORATION, 2023—2024</span>
              </div>
              <div className="project-grid">
                {projects.map((project, index) => (
                  <a
                    className="project"
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    key={project.name}
                  >
                    <div className={`project-art ${project.art}`} aria-hidden="true">
                      <span className="art-index">
                        EXPERIMENT_00{index + 1}
                      </span>
                      {index === 0 ? (
                        <div className="practice-art">
                          <span>F</span>
                          <span>
                            P<span className="tiny-star"><StarIcon /></span>
                          </span>
                        </div>
                      ) : index === 1 ? (
                        <div className="africa-art">
                          tag<span>africa↗</span>
                        </div>
                      ) : (
                        <div className="dictionary-art">
                          <span>
                            Aa<span>↗</span>
                          </span>
                          <small>
                            THE BEAUTY OF
                            <br />
                            FINDING THE RIGHT WORD.
                          </small>
                        </div>
                      )}
                      <span className="art-caption">{project.caption}</span>
                      <span className="project-arrow">↗</span>
                    </div>
                    <div className="project-title">
                      <h3>{project.name}</h3>
                      <span>{project.year}</span>
                    </div>
                    <p className="project-type">{project.type}</p>
                    <p className="project-description">{project.description}</p>
                  </a>
                ))}
              </div>
              <p className="work-footnote">
                PROJECT ARTWORK IS A VISUAL STUDY. FOLLOW A PROJECT TO SEE THE
                LIVE WORK.
              </p>
            </section>
            <ExperienceTimeline />
            <section id="about" className="about-section">
              <div className="about-label">
                <span>03 / THE PERSON</span>
                <div className="portrait-frame">
                  <img
                    src="/profilePic.jpeg"
                    alt="Abdussamad Yisau"
                    width="180"
                    height="210"
                  />
                </div>
                <span>AKA SAMMIE</span>
              </div>
              <div className="about-copy">
                <h2>
                  Engineering is the craft.
                  <br />
                  <em>Curiosity is the engine.</em>
                </h2>
                <p>
                  I’m Abdussamad, a frontend engineer based in Lagos, Nigeria.
                  My friends call me Sammie. I enjoy consuming, dissecting, and
                  creating experiences — from building websites and mobile
                  applications to talking about the concept of eternity with
                  friends.
                </p>
                <p>
                  Somewhere between the code, you’ll find me running, listening
                  to a podcast or music, playing FC, or watching a show.
                </p>
                <div className="capabilities">
                  <span>REACT</span>
                  <span>NEXT.JS</span>
                  <span>REACT NATIVE</span>
                  <span>INTERFACE DEVELOPMENT</span>
                </div>
                <a
                  className="text-link"
                  href="https://github.com/AbdussamadYisau"
                  target="_blank"
                  rel="noreferrer"
                >
                  EXPLORE MY GITHUB ↗
                </a>
              </div>
            </section>
            <section id="interests" className="interests-section">
              <div className="section-heading">
                <h2>
                  <span>04 /</span> Outside the code
                </h2>
                <span>A FEW THINGS THAT MAKE ME, ME.</span>
              </div>
              <LiveInterests />
              <PhotoJournal />
            </section>
            <section id="contact" className="contact-section">
              <div className="contact-top">
                <span>05 / HAVE SOMETHING IN MIND?</span>
                <span>GOOD WORK STARTS WITH A CONVERSATION.</span>
              </div>
              <a href="mailto:sammieyisau@gmail.com">
                Let’s make
                <br />
                <span>something.</span>
                <span className="contact-arrow">↗</span>
              </a>
              <div className="contact-email">
                <a href="mailto:sammieyisau@gmail.com">
                  sammieyisau@gmail.com ↗
                </a>
              </div>
              <nav className="social-links" aria-label="Social profiles">
                <a
                  href="https://www.instagram.com/sammieyisau/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram ↗
                </a>
                <a
                  href="https://www.linkedin.com/in/abdussamad-yisau-915298154/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn ↗
                </a>
                <a
                  href="https://github.com/AbdussamadYisau"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://twitter.com/SammieYisau"
                  target="_blank"
                  rel="noreferrer"
                >
                  X / Twitter ↗
                </a>
              </nav>
            </section>
          </main>
          <footer>
            <span>© {new Date().getFullYear()} ABDUSSAMAD YISAU</span>
            <span>BUILT WITH INTENTION IN LAGOS.</span>
            <a href="#">BACK TO TOP ↑</a>
          </footer>
        </div>
      </div>
    </>
  );
}
