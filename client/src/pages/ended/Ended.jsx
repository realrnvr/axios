import CallList from "@/components/callList/CallList";
import { useLocation } from "react-router-dom";

const Ended = () => {
  const { pathname } = useLocation();

  return (
    <div>
      <CallList type={pathname.substring(1)} />
    </div>
  );
};

export default Ended;
