import BallLines from '../BallLines/BallLines'
import { fmt } from '../utils'
import './PairRow.css'

export default function PairRow({
  rank,
  pareja,
  categoria,
  grupo,
  amount,
  leader,
  onClick,
  glowDelay,
  glowDuration,
}) {
  const glowing = glowDelay !== undefined && glowDuration !== undefined
  return (
    <div
      className={`row${leader ? ' leader' : ''}${onClick ? ' clickable' : ''}${glowing ? ' glowing' : ''}`}
      style={
        glowing
          ? {
              '--glow-delay': `${glowDelay}s`,
              '--glow-duration': `${glowDuration}s`,
            }
          : undefined
      }
      onClick={onClick}
    >
      <div className="rank-ball">
        <BallLines />
        <span className="num">{rank}</span>
      </div>
      <div className="row-main">
        <div className="pareja">{pareja}</div>
        <div className="grupo">
          {categoria ? `${categoria} · ${grupo}` : grupo}
        </div>
      </div>
      <div className="amount">{fmt(amount)}</div>
    </div>
  )
}
