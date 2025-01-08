import { useEffect, useCallback } from "react";
import {isHostAtom} from "../Atoms/Atom"
import { useRecoilValue } from "recoil";
export const useStrictModeEnforcement = ({ isStrictMode, onShowDialog }) => {
  const isHost=useRecoilValue(isHostAtom)
  const handleVisibilityChange = useCallback(() => {
    if (document.hidden && isStrictMode) {
      onShowDialog("Please stay on this tab. Strict mode is enabled.");
    }
  }, [isStrictMode, onShowDialog]);

  const handleFullScreenChange = useCallback(() => {
    if (!document.fullscreenElement && isStrictMode) {
      onShowDialog(
        "Full-screen is mandatory in strict mode."
      );
    }
  }, [isStrictMode, onShowDialog]);

  const handleKeydown = useCallback(
    (e) => {
      if (isStrictMode && (e.key === "Escape" || (e.ctrlKey && e.key === "Tab"))) {
        e.preventDefault();
        onShowDialog("This action is blocked in strict mode.");
      }
    },
    [isStrictMode, onShowDialog]
  );

  const requestFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
     
      }
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
    }
  }, []);

  useEffect(() => {
    if (!isStrictMode || isHost) return;
    requestFullscreen();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("keydown", handleKeydown);
    window.onbeforeunload = () => {
      if (isStrictMode) {
        return "Strict mode is enabled. You cannot leave the page.";
      }
    };

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("keydown", handleKeydown);
      window.onbeforeunload = null;
    };
  }, [
    isStrictMode,
    requestFullscreen,
    handleVisibilityChange,
    handleFullScreenChange,
    handleKeydown,isHost
  ]);

  return {
    requestFullscreen,
  };
};
