import { tournament } from '../../../data/content'
import MarqueeTitle from '../MarqueeTitle/MarqueeTitle'
import './PageHeader.css'

export default function PageHeader({ onSearchOpen }) {
  return (
    <header>
      <div className="header-marquee">
        <MarqueeTitle text="Torneo 2do|Aniversario" variant="duo" />
      </div>
      <div className="header-bottom">
        <div className="header-meta">
          <span>{tournament.club}</span>
          <span className="dates">{tournament.dates}</span>
        </div>
        <button
          className="search-btn"
          onClick={onSearchOpen}
          aria-label="Buscar pareja"
        >
          ⌕
        </button>
      </div>
    </header>
  )
}
