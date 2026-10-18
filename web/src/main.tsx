import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import "@fontsource-variable/inter"
import "@fontsource-variable/space-grotesk"
import "@fontsource-variable/jetbrains-mono"
import "./styles/site.css"
import App from "./App.tsx"
import { ErrorBoundary } from "@/components/site/ErrorBoundary"
import { queryClient } from "@/lib/query-client"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>
)
