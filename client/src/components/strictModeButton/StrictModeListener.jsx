import { useEffect } from "react";
import { useCall } from "@stream-io/video-react-sdk";
import { useStrictMode } from "../../hooks/useStrictMode";

const StrictModeListener = () => {
  const { setStrictMode } = useStrictMode();
  const call = useCall();

  useEffect(() => {
    if (!call) return;

    const unsubscribe = call.on("custom", (event) => {
      const payload = event.custom;
      if (payload.type === "strict-mode-change") {
        console.log("Strict mode event received:", payload.data);
        setStrictMode(payload.data.isStrictMode);
      }
    });

    return () => unsubscribe();
  }, [call, setStrictMode]);

  return null;
};

export default StrictModeListener;
