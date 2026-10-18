import { Component, type ErrorInfo, type ReactNode } from "react"

interface State {
  failed: boolean
}

/** Last line of defence: a render crash shows a recoverable screen instead of a blank page. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error", error, info.componentStack)
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="nf" role="alert">
        <div className="wrap">
          <div className="eyebrow">
            Error <b>/ something broke</b>
          </div>
          <h2>The page hit an unexpected error.</h2>
          <p>Reloading usually fixes it. If it keeps happening, email me and I’ll fix it.</p>
          <div style={{ marginTop: 26 }}>
            <button className="btn btn-primary" type="button" onClick={() => window.location.reload()}>
              Reload the page
            </button>
          </div>
        </div>
      </div>
    )
  }
}
