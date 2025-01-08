import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {isAttendanceActiveAtom,isHostAtom} from "../../Atoms/Atom"
import { useRecoilValue } from 'recoil';
import { useAuth0 } from "@auth0/auth0-react";
import { useCall} from "@stream-io/video-react-sdk";
const AttendancePopup = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState(30);
  const [isVisible, setIsVisible] = useState(false);
  const isActive=useRecoilValue(isAttendanceActiveAtom);
  const call = useCall();
  const {user} = useAuth0();
  const isHost=useRecoilValue(isHostAtom);

  useEffect(() => {
    if (isActive) {
      const maxWidth = window.innerWidth - 300;
      const maxHeight = window.innerHeight - 200;
      
      const randomX = Math.floor(Math.random() * maxWidth);
      const randomY = Math.floor(Math.random() * maxHeight);
      
      setPosition({ x: randomX, y: randomY });
      setTimeLeft(30);
      setIsVisible(true);
    }
  }, [isActive]);


  useEffect(() => {
    let timer;
    if (isVisible && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsVisible(false);
    }

    return () => clearInterval(timer);
  }, [isVisible, timeLeft]);

  if(isHost){return;}
  const markAttendance = async () => {
    try {
      await call.sendCustomEvent({
        type: "mark-attendance",
        data: {
          userId: user.email,
          name: user.name,
          time: Date.now(),
          attendanceStatus: "present"
        }
      });
      console.log("Attendance marked successfully");
      setIsVisible(false);
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md z-10">
  <div
    style={{
      position: 'fixed',
      left: `${position.x}px`,
      top: `${position.y}px`,
      zIndex: 1000,
      transition: 'all 0.3s ease',
    }}
    className="p-4"
  >
    <Alert className="w-80 shadow-2xl rounded-xl bg-gradient-to-br from-gray-800 to-black bg-opacity-60 backdrop-blur-lg border border-gray-700">
      <AlertTitle className="text-xl font-bold text-white tracking-wide">
        Mark Your Attendance!
      </AlertTitle>
      <AlertDescription className="mt-3 text-sm text-gray-300">
        <div className="mb-4 text-base">
          Time remaining: <span className="font-semibold text-green-400">{timeLeft}</span> seconds
        </div>
        <Button
          onClick={markAttendance}
          className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-medium rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Mark Attendance
        </Button>
      </AlertDescription>
    </Alert>
  </div>
</div>

  
  );
};

export default AttendancePopup;