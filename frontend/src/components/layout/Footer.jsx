const Footer = () => {
  const year = new Date().getFullYear();

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
      </div>
    </footer>
  );
};

export default Footer;