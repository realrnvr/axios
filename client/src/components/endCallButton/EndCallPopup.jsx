
import EndCallButton from "./EndCallButton";

const EndCallPopup = ({ isEndCallPopop,setEndCallPopup }) => {
  if (!isEndCallPopop) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-overlay") {
        setEndCallPopup(false);
    }
  };

  return (
    <div
      id="popup-overlay"
      className="dialog-box fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-10"
      onClick={handleOutsideClick}
    >
      <div className="bg-black bg-opacity-90 p-6 rounded-xl shadow-xl text-center relative">
        <button
          className="absolute top-2 right-2 text-red-500 text-xl font-bold"
          onClick={() => setEndCallPopup(false)}
        >
          ×
        </button>
        <h2 className="text-xl text-yellow-500 font-bold mb-4">End Call For Everyone</h2>
        <p className="mb-4 text-white-500 max-w-2xl">Clicking this button will end call for all the participants</p>
      <EndCallButton/>
      </div>
    </div>
  );
};

export default EndCallPopup;
