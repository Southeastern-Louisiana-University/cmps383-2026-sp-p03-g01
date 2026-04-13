import { createRoot } from "react-dom/client";
import '@/styles/index.css'

import { BrowserRouter } from "react-router";
import { Router } from "./Router.tsx";

createRoot(document.getElementById('root')!).render(
  //<StrictMode>
    //<App />
  //</StrictMode>,

  <BrowserRouter>
    <Router />
  </BrowserRouter>,
)
