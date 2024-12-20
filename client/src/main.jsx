import "./resets.css";
import "./utils.css";
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProviderBase } from "./services/provider/RouterProviderBase";
import Auth0ProviderBase from "./services/provider/Auth0ProviderBase";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0ProviderBase>
      <RouterProviderBase />
    </Auth0ProviderBase>
  </StrictMode>
);
