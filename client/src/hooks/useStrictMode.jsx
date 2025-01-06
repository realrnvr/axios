import { createContext, useContext, useEffect, useState } from 'react';
import { useCall } from "@stream-io/video-react-sdk";

const StrictModeContext = createContext();

export const StrictModeProvider = ({ children }) => {
  const [isStrictMode, setStrictMode] = useState(false);
  const call = useCall();

  useEffect(() => {
    const handleCustomEvent = (event) => {
      if (event.customData?.isStrictMode !== undefined) {
        setStrictMode(event.customData.isStrictMode);
      }
    };

    call?.on('custom', handleCustomEvent);
    return () => call?.off('custom', handleCustomEvent);
  }, [call]);

  return (
    <StrictModeContext.Provider value={{ isStrictMode, setStrictMode }}>
      {children}
    </StrictModeContext.Provider>
  );
};

export const useStrictMode = () => useContext(StrictModeContext);