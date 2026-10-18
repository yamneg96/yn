import { Link } from "react-router-dom"
import { Icon } from "./Icon"

export function NotFound() {
  return (
    <div className="nf" role="main">
      <div className="scan" />
      <div className="wrap">
        <div className="eyebrow">
          Error <b>/ route not found</b>
        </div>
        <h1>
          <span className="grad g">404</span>
        </h1>
        <h2>This page hasn’t shipped yet.</h2>
        <p>The page you asked for doesn’t exist or has moved. Head back to something that works.</p>
        <div style={{ marginTop: 26 }}>
          <Link className="btn btn-primary" to="/">
            Back to home <Icon name="arrow" className="nudge" />
          </Link>
        </div>
      </div>
    </div>
  )
}
