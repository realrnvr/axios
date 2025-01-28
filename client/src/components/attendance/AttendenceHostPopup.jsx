
import AttendanceButton from "./AttendanceButton";

const AttendenceHostPopup = ({ isAttendencePopop,setIsAttendencePopup }) => {
  if (!isAttendencePopop) return null;

  const handleOutsideClick = (e) => {
    if (e.target.id === "popup-overlay") {
        setIsAttendencePopup(false);
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
          onClick={() => setIsAttendencePopup(false)}
        >
          ×
        </button>
        <h2 className="text-xl text-yellow-500 font-bold mb-4">Attendence</h2>
        <p className="mb-4 text-white-500 max-w-2xl">This section is for taking attendance. When you click the button, a popup will appear on the participants' screens. They must mark their attendance; otherwise, they will be marked as absent.</p>
      <AttendanceButton/>
      </div>
    </div>
  );
};

export default AttendenceHostPopup;
