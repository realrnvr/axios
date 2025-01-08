import "./resets.css";
import "./utils.css";
import "./index.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "react-datepicker/dist/react-datepicker.css";
import ChatProvider from "./services/chat/ChatProvider";
import {
  RecoilRoot,
} from 'recoil';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProviderBase } from "./services/provider/RouterProviderBase";
import Auth0ProviderBase from "./services/provider/Auth0ProviderBase";
import { Toaster } from "./components/ui/toaster";
import VideoProvider from "./services/stream/VideoProvider";
import {StrictModeProvider} from "./hooks/useStrictMode"
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0ProviderBase>
      <VideoProvider>
      <RecoilRoot>
        <ChatProvider>
      <StrictModeProvider>
          <RouterProviderBase />
          <Toaster />
      </StrictModeProvider>
        </ChatProvider>
      </RecoilRoot>
      </VideoProvider>
    </Auth0ProviderBase>
  </StrictMode>
);
