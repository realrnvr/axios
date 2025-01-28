import { useEffect, useState } from "react";
import { isHostAtom } from "../../Atoms/Atom";
import { useRecoilValue } from "recoil";
const StrictModeDialog = ({ message, onReenterFullscreen, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(30);
  const isHost =useRecoilValue(isHostAtom);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      onTimeout();
      clearInterval(interval);
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onTimeout]);
  if (isHost) {
    return null; 
  }
  return (
    <div className="dialog-box fixed inset-0 flex items-center justify-center bg-black bg-opacity-0 backdrop-blur-sm z-10">
      <div className="bg-black bg-opacity-90 p-6 rounded-xl shadow-xl text-center">
        <h2 className="text-xl text-red-500 font-bold mb-4">
          Strict Mode Alert
        </h2>
        <p className="mb-4 text-white-500">{message}</p>
        <p className="mb-4 text-red-500 font-semibold">
          Please re-enter fullscreen within {timeLeft} seconds.
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={onReenterFullscreen}
        >
          Click Here
        </button>
      </div>
    </div>
  );
};

export default StrictModeDialog;
