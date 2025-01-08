
import { Button } from "../ui/button";
import { isHostAtom } from "../../Atoms/Atom";
import { useRecoilValue } from "recoil";
import { useCall} from "@stream-io/video-react-sdk";

const AttendanceButton = () => {
  const call = useCall();
  const isHost = useRecoilValue(isHostAtom);

  const triggerAttendance = async () => {
    console.log("Sending attendance check event");
    await call.sendCustomEvent({
      type: "attendance-check",
      data: {
        timestamp: Date.now(),
      },
    });
    console.log("Attendance check event sent");
  };

  if (!isHost) {
    return null;
  }

  return (
    <div>
      <Button 
        onClick={triggerAttendance}
        className="bg-blue-500 hover:bg-blue-600"
      >
        Attendance
      </Button>
    </div>
  );
};

export default AttendanceButton;