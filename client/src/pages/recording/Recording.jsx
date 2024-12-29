import { useParams } from "react-router-dom";
import "./recording.css";

const Recording = () => {
  const { recUrl } = useParams();
  return <div>Recording: {recUrl}</div>;
};

export default Recording;
