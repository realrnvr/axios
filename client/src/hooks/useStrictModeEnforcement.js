import { useEffect, useCallback } from 'react';

export const useStrictModeEnforcement = ({ isStrictMode }) => {

  const handleVisibilityChange = useCallback(() => {
    if (document.hidden) {
      alert("Strict mode is enabled. Please return to the meeting.");
      // Keep the user in the same tab
      document.visibilityState = 'visible';
      window.focus();
    }
  }, []);

  const handleFullScreenChange = useCallback(() => {
    if (!document.fullscreenElement) {
      alert("Full-screen is mandatory in strict mode. Click OK to re-enter fullscreen.");
      // Re-enter fullscreen once the alert is acknowledged
      document.documentElement?.requestFullscreen().catch(console.error);
    }
  }, []);

  const handleKeydown = useCallback((e) => {
    if (e.key === "Escape" || (e.ctrlKey && e.key === "Tab")) {
      e.preventDefault();
      alert("Strict mode is enabled. Action blocked.");
    }
  }, []);

  const requestFullscreen = useCallback(async () => {
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

    // Trigger fullscreen as soon as strict mode is activated
    requestFullscreen();

    // Add event listeners for visibility, fullscreen change, and keydown
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullScreenChange);
    document.addEventListener("keydown", handleKeydown);

    // Block the ability to close the window or switch tabs
    window.onbeforeunload = () => {
      if (isStrictMode) {
        return "Strict mode is enabled. You cannot leave the page.";
      }
    };

    // Cleanup event listeners
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.removeEventListener("keydown", handleKeydown);
      window.onbeforeunload = null;
    };
  }, [isStrictMode, requestFullscreen, handleVisibilityChange, handleFullScreenChange, handleKeydown]);

  return {
    requestFullscreen,
    isEnforced: isStrictMode
  };
};
