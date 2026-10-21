import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/anton/latin.css";
import "@fontsource/anton/latin-ext.css";
import "@fontsource-variable/inter-tight";
import "@fontsource-variable/jetbrains-mono";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
