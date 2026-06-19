import { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message?: string;
}

export class ErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary]", error, info);
  }

  private handleReload = () => {
    this.setState({ hasError: false, message: undefined });
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem 1.5rem",
            textAlign: "center",
            gap: "1rem",
            minHeight: "60vh",
          }}
        >
          <svg
            width="72"
            height="72"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-brand-red, #ff3636)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <h1 style={{ margin: 0, color: "var(--text-primary)", fontSize: "1.5rem", fontWeight: 600 }}>
            Something went wrong
          </h1>
          <p style={{ margin: 0, color: "var(--text-secondary)", maxWidth: 420 }}>
            {this.state.message
              ? `Unexpected error: ${this.state.message}`
              : "An unexpected error occurred. Try reloading, or head back home."}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              type="button"
              onClick={this.handleReload}
              style={{
                padding: "0.6rem 1.1rem",
                borderRadius: "var(--r-md)",
                background: "var(--color-brand-blue, #067df7)",
                color: "#fff",
                border: "none",
                fontWeight: 600,
                fontSize: "0.875rem",
                cursor: "pointer",
              }}
            >
              Reload page
            </button>
            <Link
              to="/"
              style={{
                padding: "0.6rem 1.1rem",
                borderRadius: "var(--r-md)",
                background: "transparent",
                color: "var(--text-primary)",
                border: "1px solid var(--border-strong)",
                fontWeight: 600,
                fontSize: "0.875rem",
                textDecoration: "none",
              }}
            >
              Back to home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}