import "./end-call-button.css";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { useNavigate } from "react-router-dom";

const EndCallButton = () => {
  const call = useCall();
  const navigate = useNavigate();

  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isMeetingOwner =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call?.state.createdBy.id;

  if (!isMeetingOwner) {
    return null;
  }

  return (
    <button
      onClick={async () => {
        await call.endCall();
        navigate("/");
      }}
      className="bg-red-500 call__btn"
    >
      Hang up
    </button>
  );
};

export default EndCallButton;
