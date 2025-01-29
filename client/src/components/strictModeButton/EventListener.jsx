// EventListener.jsx
import { useEffect } from "react";
import { useCall } from "@stream-io/video-react-sdk";
import { useStrictMode } from "../../hooks/useStrictMode";
import { isAttendanceActiveAtom, languageAtom, presentParticipantsAtom } from "@/Atoms/Atom";
import { useRecoilState } from "recoil";
import { codeAtom } from "../../Atoms/Atom";

const EventListener = () => {
  const { setStrictMode } = useStrictMode();
  const [isAttendanceActive, setIsAttendanceActive] = useRecoilState(isAttendanceActiveAtom);
  const [presentParticipants, setPresentParticipants] = useRecoilState(presentParticipantsAtom);
  const call = useCall();
  const [code, setCode] = useRecoilState(codeAtom);
  const [language, setLanguage] = useRecoilState(languageAtom);

  useEffect(() => {
    if (!call) return;

    const handleCustomEvent = (event) => {
      const payload = event.custom;

      if (payload.type === "strict-mode-change") {
        console.log("Strict mode event received:", payload.data);
        setStrictMode(payload.data.isStrictMode);
      }

      if (payload.type === "attendance-check") {
        console.log("Attendance check event received:", payload.data);
        setIsAttendanceActive(true);
        setPresentParticipants([]);

        setTimeout(() => {
          setIsAttendanceActive(false);
        }, 30000);
      }

      if (payload.type === "mark-attendance") {
        console.log("Attendance marked:", payload.data);
        setPresentParticipants(prev => {
          if (!prev.some(p => p.userId === payload.data.userId)) {
            return [...prev, {
              userId: payload.data.userId,
              name: payload.data.name,
              time: payload.data.time,
              status: payload.data.attendanceStatus
            }];
          }
          return prev;
        });
      }

      if (payload.type === "code-update") {
        setCode(payload.data.code);
        if (language !== payload.data.language) {
          setLanguage(payload.data.language);
        }
      }
    };

    const unsubscribe = call.on("custom", handleCustomEvent);
    return () => unsubscribe();
  }, [call, setStrictMode, setIsAttendanceActive, code, setCode, language, setLanguage, setPresentParticipants]);

  return null;
};

export default EventListener;