
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

    await call.sendMessage({
      text: `Strict mode has been ${newStrictMode ? "enabled" : "disabled"}.`,
      customData: { isStrictMode: newStrictMode },
    });
  };

  return (
    <button
      onClick={toggleStrictMode}
      className={`px-4 py-2 rounded-lg ${
        isStrictMode ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {isStrictMode ? "Disable Strict Mode" : "Enable Strict Mode"}
    </button>
  );
};

export default EnableStrictModeButton;
