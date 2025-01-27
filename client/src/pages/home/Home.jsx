import "./home.css";
import CenterPart from "@/components/centerPart/CenterPart";
import Navbar from "@/components/navbar/Navbar";
import {BackgroundBeams} from "../../components/extraUicom/backgroundBeams"
const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home__content">
        <CenterPart />
        <div className="shadow"></div>
      </div>
      <BackgroundBeams/>
    </>
  );
};

export default Home;
