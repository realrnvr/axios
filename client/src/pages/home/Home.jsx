import "./home.css";
import { Button } from "@/components/ui/button";
import { useAuth0 } from '@auth0/auth0-react'
const Home = () => {
  const {loginWithRedirect} =useAuth0();
  return (
    <>
      <div className="home__header-wrapper">
        <header className="home__header | container">
          <div className="home__logo">
            <h1 className="home__title">MEET</h1>
          </div>
          <div className="home__account">
          <Button variant="secondary" onClick={()=>{loginWithRedirect()}}>Login</Button>
            <button className="home__btn">
              <img className="home__img" src="/sun.svg" alt="" />
            </button>
          </div>
        </header>
      </div>
      <main className="home__content | container">
        <div className="home__content-wrapper">
          <div>
            <div className="home__intro">
              <h2 className="home__intro-title">
                <strong className="text-gradient--clr-pink">Meet</strong>,{" "}
                <strong className="text-gradient--clr-blue">connect</strong>,
                <br className="sm-screen" />
                and{" "}
                <strong className="text-gradient--clr-green">
                  collaborate
                </strong>{" "}
                effortlessly. Anytime, anywhere.
              </h2>
              <p className="home__description">
                Start meeting, collaborating, and connecting—just sign up and
                go!
              </p>
            </div>
            <div className="home__goto">
            <Button variant="secondary" onClick={()=>{loginWithRedirect()}}>Get Started</Button>
            </div>
          </div>
          <div className="home__hero-img-wrapper lg-screen">
            <img className="home__hero-img" src="/preview.png" alt="" />
            {/* <div className="shadow lg-screen"></div> */}
          </div>
        </div>
        <div className="shadow"></div>
      </main>
    </>
  );
};

export default Home;
