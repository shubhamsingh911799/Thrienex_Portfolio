import { useEffect, useState } from 'react';

function ArrowIcon({ diagonal = false }) {
  return (
    <svg
      aria-hidden="true"
      className={diagonal ? 'arrow-icon arrow-icon-diagonal' : 'arrow-icon'}
      viewBox="0 0 20 20"
      fill="none"
    >
      <path d="M3.5 10h12m-5-5 5 5-5 5" />
    </svg>
  );
}

function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [formState, setFormState] = useState({ status: 'idle', message: '' });

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const [profileResponse, projectsResponse] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/projects'),
        ]);
        if (!profileResponse.ok || !projectsResponse.ok) {
          throw new Error('Portfolio data could not be loaded. Please try again later.');
        }
        const [profileData, projectData] = await Promise.all([
          profileResponse.json(),
          projectsResponse.json(),
        ]);
        setProfile(profileData);
        setProjects(projectData);
      } catch (error) {
        setLoadError(error.message);
      }
    }

    loadPortfolio();
  }, []);

  async function handleContactSubmit(event) {
    event.preventDefault();
    setFormState({ status: 'sending', message: '' });
    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Your message could not be sent.');
      }
      form.reset();
      setFormState({ status: 'success', message: 'Thanks — your message is in my inbox.' });
    } catch (error) {
      setFormState({ status: 'error', message: error.message });
    }
  }

  if (loadError) {
    return <main className="load-error">{loadError}</main>;
  }

  if (!profile) {
    return <main className="loading-screen">Loading portfolio<span>.</span></main>;
  }

  return (
    <>
      <header className="site-header">
        <a className="wordmark" href="#home" aria-label="Kumar Shubham home">KS<span>.</span></a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="availability" href="#contact">
          <span className="status-dot" /> Available for hire
        </a>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-topline">
            <span>Web developer<br />Full-stack / India</span>
            <span className="hero-index">Portfolio — 2025</span>
          </div>
          <div className="hero-backdrop" aria-hidden="true">PORTFOLIO</div>
          <div className="hero-content">
            <div className="hero-copy">
              <p className="script-intro">{profile.greeting}</p>
              <h1>{profile.name.split(' ').map((part) => <span key={part}>{part}</span>)}</h1>
              <p className="hero-role">{profile.role}</p>
              <p className="hero-education">{profile.education}</p>
              <p className="hero-bio">{profile.bio}</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#work">View my work <ArrowIcon /></a>
                <a className="button button-outline" href="#contact">Let’s talk <ArrowIcon diagonal /></a>
              </div>
            </div>
            <div className="portrait-wrap">
              <div className="portrait-glow" />
              <img
                className="portrait-art"
                src="/profile-photo.png"
                alt="Kumar Shubham wearing sunglasses and a black shirt"
              />
              <span className="portrait-caption">Building what’s next.</span>
            </div>
          </div>
          <a className="scroll-cue" href="#about">
            <span className="scroll-circle"><span /></span>
            <span>Scroll<br />to explore</span>
          </a>
          <div className="hero-footer"><span>01 — 04</span><span>Scroll to discover</span></div>
        </section>

        <section className="content-section about-section" id="about">
          <div className="section-label"><span>01 / About me</span><span>A little introduction</span></div>
          <div className="about-grid">
            <h2>Curious mind.<br /><span>Clean code.</span><br />Good energy.</h2>
            <div className="about-copy">
              <p>I’m Shubham — a CSE student and developer who enjoys turning ideas into useful, thoughtful digital experiences.</p>
              <p>From the first sketch to the final line of code, I care about making the web feel simple, fast and human.</p>
              <div className="skills-list">
                {profile.skills.map((skill) => <span key={skill}>{skill}</span>)}
              </div>
            </div>
          </div>
        </section>

        <section className="content-section work-section" id="work">
          <div className="section-label"><span>02 / Selected work</span><span>A few things I’ve made</span></div>
          <div className="work-heading"><h2>Small list.<br /><span>Big ideas.</span></h2><p>Learning by making, and making with intention.</p></div>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-row" key={project.id}>
                <span className="project-number">{project.number}</span>
                <div className="project-title"><span>{project.category}</span><h3>{project.title}</h3></div>
                <p className="project-description">{project.description}</p>
                <span className="project-arrow"><ArrowIcon diagonal /></span>
              </article>
            ))}
          </div>
        </section>

        <section className="content-section contact-section" id="contact">
          <div className="section-label"><span>03 / Get in touch</span><span>Have an idea in mind?</span></div>
          <div className="contact-grid">
            <div>
              <p className="script-intro">Let’s make it happen</p>
              <h2>Have a good<br /><span>one in mind?</span></h2>
              <a className="email-link" href={`mailto:${profile.email}`}>{profile.email}<ArrowIcon diagonal /></a>
            </div>
            <form className="contact-form" onSubmit={handleContactSubmit}>
              <label htmlFor="contact-name">Your name</label>
              <input id="contact-name" name="name" autoComplete="name" maxLength="100" required placeholder="Jane Smith" />
              <label htmlFor="contact-email">Email address</label>
              <input id="contact-email" name="email" type="email" autoComplete="email" maxLength="254" required placeholder="jane@example.com" />
              <label htmlFor="contact-message">A little about your project</label>
              <textarea id="contact-message" name="message" rows="3" maxLength="2000" required placeholder="Tell me what you’re thinking..." />
              <button className="button button-primary form-submit" type="submit" disabled={formState.status === 'sending'}>
                {formState.status === 'sending' ? 'Sending...' : 'Send a message'} <ArrowIcon />
              </button>
              {formState.message && <p className={`form-feedback ${formState.status}`} role="status">{formState.message}</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="wordmark" href="#home">KS<span>.</span></a>
        <span>Designed & built with care.</span>
        <a href="#home">Back to top ↑</a>
        <span>© {new Date().getFullYear()} Kumar Shubham</span>
      </footer>
    </>
  );
}

export default App;
