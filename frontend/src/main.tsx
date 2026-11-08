import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {queryClient} from "./api/queryClient.ts";
import App from './App.tsx'
import './theme/base.css'
import {QueryClientProvider} from "@tanstack/react-query";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
            <App />
      </QueryClientProvider>
  </StrictMode>,
)
