export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="footer">
      <div className="footer__inner">
        <div className="footer__cols">
          <div className="footer__col">
            <p className="footer__brand">Kevin Atapattu</p>
            <p className="footer__tag">
              Software engineer, competitive powerlifter, builder of products
              with intent. Currently Toronto.
            </p>
          </div>

          <div className="footer__col">
            <h4>Explore</h4>
            <ul>
              <li><a href="#story">Story</a></li>
              <li><a href="#work">Work</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#pursuits">Pursuits</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Connect</h4>
            <ul>
              <li>
                <a href="https://github.com/kevinAtapattu" target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/kevinatapattu/" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </li>
              <li><a href="mailto:kevinatapattu@gmail.com">Email</a></li>
              <li>
                <a href="/kevin_atapattu_resume.pdf" target="_blank" rel="noopener noreferrer">
                  Resume (PDF)
                </a>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Currently</h4>
            <ul>
              <li>SWE Intern · IBM Toronto</li>
              <li>CS · Carleton University</li>
              <li>President · Ravens Powerlifting</li>
            </ul>
          </div>
        </div>

        <div className="footer__fine">
          <span>
            © {year} Kevin Atapattu. Crafted with discipline and a lot of
            coffee.
          </span>
          <span>kevinatapattu.dev</span>
        </div>
      </div>
    </footer>
  );
}
