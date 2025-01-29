import AttendanceButton from "./AttendanceButton";
import "./AttendanceHostPopup.css";
import { CallParticipantsList } from "@stream-io/video-react-sdk";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useRecoilValue } from "recoil";
import { presentParticipantsAtom } from "@/Atoms/Atom";

const AttendenceHostPopup = ({ isAttendencePopop, setIsAttendencePopup }) => {
  const { useParticipants } = useCallStateHooks();
  const participants = useParticipants();
  const presentParticipants = useRecoilValue(presentParticipantsAtom);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  if (!isAttendencePopop) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-overlay") {
      setIsAttendencePopup(false);
    }
  };

  const ParticipantsList = () => (
    <div>
      {participants.map((participant) => (
        <div key={participant.sessionId} className="participant-item">
          {participant.name || participant.userId}
        </div>
      ))}
    </div>
  );

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
            This section is for taking attendence. When you click the button, a
            popup will appear on the participants' screens. They must mark their
            attendence; otherwise, they will be marked as absent.
          </p>
          <div className="attendence-party">
            {`Total Participants: ${participants.length}`}
          </div>
          <AttendanceButton />
        </div>
        <div className="lowerDiv-attendence">
          <div className="Total-party-data">
            currently connected with: 
            <ParticipantsList />
          </div>
          <div className="present-participants">
            Active ({presentParticipants.length})
            <div className="present-party-data">
              {presentParticipants.length > 0 ? (
                <ul className="present-list">
                  {presentParticipants.map((participant) => (
                    <li 
                      key={participant.userId} 
                      className="present-participant"
                    >
                      <div className="participant-info">
                        <span className="participant-name">{participant.name}</span>
                        <span className="participant-time">
                          {formatTime(participant.time)}
                        </span>
                      </div>
                      <span className="participant-status">
                        {participant.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-presents">No participants marked present yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendenceHostPopup;