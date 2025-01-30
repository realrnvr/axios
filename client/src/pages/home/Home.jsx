import "./home.css";
import CenterPart from "@/components/centerPart/CenterPart";
import Navbar from "@/components/navbar/Navbar";
import { BackgroundLines } from "../../components/extraUicom/backgroundLines";

const Home = () => {
  return (
    <div className="Home_main_container ">
      <Navbar />
      <div className="home__content">
        <CenterPart />
      </div>
      <BackgroundLines className={"opacity-50"} />
    </div>
  );
};

export default Home;
