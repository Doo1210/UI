import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Home from "./app/page";
import "./app/globals.css";
import "./app/home-dashboard.css";
import "./app/platform-introduction.css";
import "./app/feature-introduction.css";
import "./app/main-workspaces.css";
import "./app/legacy-preview.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
);
