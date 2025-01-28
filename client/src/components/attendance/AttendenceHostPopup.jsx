import AttendanceButton from "./AttendanceButton";
import './AttendanceHostPopup.css';
import {
  CallParticipantsList,
} from "@stream-io/video-react-sdk";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
const AttendenceHostPopup = ({ isAttendencePopop, setIsAttendencePopup }) => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  if (!isAttendencePopop) return null;
  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-overlay") {
      setIsAttendencePopup(false);
    }
  };

  return (
    <div
      id="popup-overlay"
      className="dialog-box-attendance"
      onClick={handleOutsideClick}
    >
      <div className="popup-content-attendence">
        <button
          className="close-button"
          onClick={() => setIsAttendencePopup(false)}
        >
          ×
        </button>
        <h2 className="title-attendence">Attendence</h2>
        <div className="attendence-div-start">
        <p className="description-attendence">
          This section is for taking attendence. When you click the button, 
          a popup will appear on the participants' screens. They must mark 
          their attendence; otherwise, they will be marked as absent.
        </p>
        <div className="attendence-party">{`Total Participants :  ${participants.length}`} 
        </div>
        <AttendanceButton />
        </div>
        <div className="lowerDiv-attendence">
        <div className="totol-participants">
          <div className="Total-party-data">
     <CallParticipantsList/>
          </div>
        </div>
        <div className="present-participants">Active
          <div className="present-party-data">

          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AttendenceHostPopup;