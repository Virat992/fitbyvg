import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css"; // move CSS into styles/ if you want

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
