import { useStrictMode } from "../../hooks/useStrictMode";
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";

const EnableStrictModeButton = () => {
  const { isStrictMode, setStrictMode } = useStrictMode();
  const call = useCall();
  const { useLocalParticipant } = useCallStateHooks();
  const localParticipant = useLocalParticipant();

  const isHost =
    localParticipant &&
    call?.state.createdBy &&
    localParticipant.userId === call?.state.createdBy.id;

  if (!isHost) {
    return null;
  }

  const toggleStrictMode = async () => {
    const newStrictMode = !isStrictMode;
    setStrictMode(newStrictMode);
  
    console.log('Sending custom event');
    await call.sendCustomEvent({
      type: 'strict-mode-change',  
      data: {
        isStrictMode: newStrictMode
      }
    });
    console.log('Custom event sent');
  };
  return (
    <button
      onClick={toggleStrictMode}
      className={`px-2 py-1 rounded-lg ${
        isStrictMode ? "bg-green-500" : "bg-blue-500"
      } text-base`}
    >
      {isStrictMode ? "Disable Strict Mode" : "Enable Strict Mode"}
    </button>
  );
};

export default EnableStrictModeButton;