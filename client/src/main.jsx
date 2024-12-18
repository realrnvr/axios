import "./resets.css";
import "./utils.css";
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProviderBase } from "./services/provider/RouterProviderBase";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProviderBase />
  </StrictMode>
);
