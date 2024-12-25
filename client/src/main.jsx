import "./resets.css";
import "./utils.css";
import "./index.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProviderBase } from "./services/provider/RouterProviderBase";
import Auth0ProviderBase from "./services/provider/Auth0ProviderBase";
import { Toaster } from "./components/ui/toaster";
import VideoProvider from "./services/stream/VideoProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0ProviderBase>
      <VideoProvider>
        <RouterProviderBase />
        <Toaster />
      </VideoProvider>
    </Auth0ProviderBase>
  </StrictMode>
);
