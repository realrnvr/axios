import { useEffect } from "react";
import { useCall } from "@stream-io/video-react-sdk";
import { useStrictMode } from "../../hooks/useStrictMode";
import { isAttendanceActiveAtom } from "@/Atoms/Atom";
import { useRecoilState } from "recoil";

const EventListener = () => {
  const { setStrictMode } = useStrictMode();
  const [isAttendanceActive, setIsAttendanceActive] = useRecoilState(isAttendanceActiveAtom);
  const call = useCall();

  useEffect(() => {
    if (!call) return;

    const handleCustomEvent = (event) => {
      const payload = event.custom;
      
      // Handle strict mode events
      if (payload.type === "strict-mode-change") {
        console.log("Strict mode event received:", payload.data);
        setStrictMode(payload.data.isStrictMode);
      }
      
      // Handle attendance check events
      if (payload.type === "attendance-check") {
        console.log("Attendance check event received:", payload.data);
        setIsAttendanceActive(true);
        
        // Automatically disable after 30 seconds
        setTimeout(() => {
          setIsAttendanceActive(false);
        }, 30000);
      }
      // received presenty
      if(payload.type ==="mark-attendance"){
       console.log(payload.data);
      }
      



    };

    const unsubscribe = call.on("custom", handleCustomEvent);
    return () => unsubscribe();
  }, [call, setStrictMode, setIsAttendanceActive]);

  return null;
};

export default EventListener;