import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
// move CSS into styles/ if you want

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
