import "./resets.css";
import "./utils.css";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProviderBase } from "./services/provider/RouterProviderBase";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-riaw1h1kzszelhv5.us.auth0.com"
      clientId="w5dAqh53hZqBrhmIIwytz4Sr9eSF3AR8"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <RouterProviderBase />
    </Auth0Provider>
  </StrictMode>
);
