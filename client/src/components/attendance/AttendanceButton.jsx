import { Button } from "../ui/button";
import { isHostAtom } from "../../Atoms/Atom";
import { useRecoilValue } from "recoil";
import { useCall } from "@stream-io/video-react-sdk";
import { useState, useEffect } from 'react';

const AttendanceButton = () => {
  const call = useCall();
  const isHost = useRecoilValue(isHostAtom);
  const [isDisabled, setIsDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (isDisabled && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }

    if (countdown === 0) {
      setIsDisabled(false);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isDisabled, countdown]);

  const triggerAttendance = async () => {
    console.log("Sending attendance check event");
    await call.sendCustomEvent({
      type: "attendance-check",
      data: {
        timestamp: Date.now(),
      },
    });
    console.log("Attendance check event sent");
    
    // Start the cooldown
    setIsDisabled(true);
    setCountdown(30);
  };

  if (!isHost) {
    return null;
  }

  return (
    <div>
      <Button 
        onClick={triggerAttendance}
        disabled={isDisabled}
        className={`${
          isDisabled 
            ? 'bg-gray-700 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isDisabled 
          ? `wait ${countdown}s` 
          : 'Take Attendance'}
      </Button>
    </div>
  );
};

export default AttendanceButton;