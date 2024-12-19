import "./home.css";
import CenterPart from "@/components/centerPart/CenterPart";
import Navbar from "@/components/navbar/Navbar";

const Home = () => {
  return (
    <>
      <Navbar />
      <div className="home__content">
        <CenterPart />
        <div className="shadow"></div>
      </div>
    </>
  );
};

export default Home;
