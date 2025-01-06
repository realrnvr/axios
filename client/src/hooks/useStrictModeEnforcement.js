import { useEffect, useCallback } from 'react';

export const useStrictModeEnforcement = ({ isStrictMode}) => {

  const handleVisibilityChange = useCallback(() => {
    console.log("Visibility Change Triggered");
    if (document.hidden) {
      console.log("Strict mode is enabled. Please return to the meeting.");
    }
  }, []);

  const handleFullScreenChange = useCallback(() => {
    console.log("Fullscreen Change Triggered");
    if (!document.fullscreenElement) {
      console.log("Full-screen is mandatory in strict mode.");
      document.documentElement?.requestFullscreen().catch(console.error);
    }
  }, []);

  const handleKeydown = useCallback((e) => {
    console.log("Keydown Triggered:", e.key);
    if (e.key === "Escape" || (e.ctrlKey && e.key === "Tab")) {
      e.preventDefault();
      console.log("Strict mode is enabled. Action blocked.");
    }
  }, []);

  const requestFullscreen = useCallback(async () => {
    console.log("Request Fullscreen Triggered");
    try {
      if (!document.fullscreenElement) {
        await document.documentElement?.requestFullscreen();
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  }, []);

  useEffect(() => {
    if (!isStrictMode) return;
    const enterFullscreen = async () => {
      await requestFullscreen();
    };
    enterFullscreen();

    // Add event listeners for visibility, fullscreen change, and keydown
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("keydown", handleKeydown);

    // Cleanup event listeners
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isStrictMode, requestFullscreen, handleVisibilityChange, handleFullScreenChange, handleKeydown]);

  return {
    requestFullscreen,
    isEnforced: isStrictMode 
  };
};
