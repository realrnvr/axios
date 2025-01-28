
import EnableStrictModeButton from "./StrictModeButton";

const StrictModePopup = ({ isStrictPopop, setIsStrictPopup }) => {
  if (!isStrictPopop) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-overlay") {
      setIsStrictPopup(false);
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
          onClick={() => setIsStrictPopup(false)}
        >
          ×
        </button>
        <h2 className="text-xl text-yellow-500 font-bold mb-4">Strict Mode</h2>
        <p className="mb-4 text-white-500 max-w-2xl">Strict Mode helps participants stay focused by keeping them in fullscreen and stopping them from switching tabs. This reduces distractions and prevents cheating, making it great for tests, vivas, or any important sessions.</p>
        <EnableStrictModeButton />
      </div>
    </div>
  );
};

export default StrictModePopup;
