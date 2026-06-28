import { tournament } from '../../../data/content'
import './PageFooter.css'

export default function PageFooter() {
  return (
    <footer>
      <p className="footer-copy">
        © {tournament.year} Calcuta Floü · Pedaleros
      </p>
      <div className="footer-brand">
        <a
          className="footer-link"
          href="https://instagram.com/beanbug.corp"
          target="_blank"
          rel="noreferrer"
        >
          <svg
            className="footer-ig-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <circle cx="12" cy="12" r="4" />
            <circle
              cx="17.5"
              cy="6.5"
              r="0.8"
              fill="currentColor"
              stroke="none"
            />
          </svg>
          beanbug.corp
        </a>
        <img
          className="footer-logo"
          src="/beanbug-logo.png"
          alt="BeanBug Corp"
        />
        <a
          className="footer-link"
          href="https://beanbugcorp.com"
          target="_blank"
          rel="noreferrer"
        >
          beanbugcorp.com
        </a>
      </div>
    </footer>
  )
}
