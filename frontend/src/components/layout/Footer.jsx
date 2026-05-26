const CONTACTS = {
  email: 'elvisnoko@gamil.com',
  linkedin: 'https://www.linkedin.com/in/nokodev/',
  github: 'https://github.com/esnoko'
};

const Footer = () => {
  const year = new Date().getFullYear();

  const hasEmail = Boolean(CONTACTS.email);
  const hasLinkedIn = Boolean(CONTACTS.linkedin);

  return (
    <footer className="app-footer" role="contentinfo">
      <div className="app-footer-inner">
        <p className="footer-copy">DevTrack © {year}. Built for developer analytics.</p>
        <div className="footer-links" aria-label="Project links">
          <a
            href="https://dev-track-lime.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            Live App
          </a>
          <a
            href="https://github.com/esnoko/DevTrack"
            target="_blank"
            rel="noreferrer"
          >
            Source
          </a>
          <a
            href="https://devtrack-ejfe.onrender.com/api/v1/health"
            target="_blank"
            rel="noreferrer"
          >
            API Health
          </a>
        </div>

        <div className="footer-links" aria-label="Contact links">
          <span className="footer-label">Contact:</span>
          {hasEmail && <a href={`mailto:${CONTACTS.email}`}>Email</a>}
          {hasLinkedIn && (
            <a href={CONTACTS.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          )}
          {CONTACTS.github && (
            <a href={CONTACTS.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {!hasEmail && !hasLinkedIn && !CONTACTS.github && (
            <span className="footer-placeholder">Add your contact links in Footer.jsx</span>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;