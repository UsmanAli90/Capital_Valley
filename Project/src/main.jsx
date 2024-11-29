import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./Profile/styles/tailwind.css";
import "./Profile/styles/font.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
