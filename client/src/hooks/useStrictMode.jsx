
import { createContext, useContext, useState } from 'react';

const StrictModeContext = createContext();

export const StrictModeProvider = ({ children }) => {
  const [isStrictMode, setStrictMode] = useState(false);

  return (
    <StrictModeContext.Provider value={{ isStrictMode, setStrictMode }}>
      {children}
    </StrictModeContext.Provider>
  );
};

export const useStrictMode = () => useContext(StrictModeContext);
