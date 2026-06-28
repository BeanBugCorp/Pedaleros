import { fmt } from '../utils'
import './ToteBoard.css'

export default function ToteBoard({ totalSales, maxSale, numPairs }) {
  return (
    <div className="tote">
      <div className="tote-stat">
        <div className="tote-label">Pozo Total</div>
        <div className="tote-value">{fmt(totalSales)}</div>
      </div>
      <div className="tote-stat">
        <div className="tote-label">Max Ganancia</div>
        <div className="tote-value">{fmt(maxSale)}</div>
      </div>
      <div className="tote-stat">
        <div className="tote-label"># Parejas</div>
        <div className="tote-value">{numPairs}</div>
      </div>
    </div>
  )
}
