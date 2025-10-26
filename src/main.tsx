import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import { ThemeProvider } from "../components/theme-provider"

if (typeof document !== "undefined") {
  const root = document.getElementById("root")
  if (root) {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light" 
          enableSystem={false}
          storageKey="vite-ui-theme"
        >
          <App />
        </ThemeProvider>
      </React.StrictMode>,
    )
  }
}
