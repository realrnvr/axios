import { useParams } from "react-router-dom";

const Call = () => {
  const { callId } = useParams();

  return <div>Call id: {callId}</div>;
};

export default Call;
