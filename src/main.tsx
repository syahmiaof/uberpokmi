import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/space-grotesk/latin-400.css";
import "@fontsource/space-grotesk/latin-500.css";
import "@fontsource/space-grotesk/latin-600.css";
import "@fontsource/space-grotesk/latin-700.css";
import App from "./App";
import { DemoProvider } from "./store";
import "./styles.css";
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="fatal-error">
        <h1>A small detour.</h1>
        <p>Something went wrong while opening the demo. Reload to try again.</p>
        <button className="button" onClick={() => window.location.reload()}>
          Reload UberPokmi
        </button>
        <button
          className="button secondary"
          onClick={() => {
            if (
              window.confirm("Clear local UberPokmi demo data and restart?")
            ) {
              localStorage.removeItem("uberpokmi-demo-v1");
              window.location.reload();
            }
          }}
        >
          Reset local demo
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <DemoProvider>
        <App />
      </DemoProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
