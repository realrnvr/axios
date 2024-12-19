// import React from 'react'
import { Button } from "@/components/ui/button";
import { useAuth0 } from '@auth0/auth0-react'
import "./home.css"


const Navbar =()=>{
 const {loginWithRedirect} =useAuth0();
return(
    <div className="navbar_container container">
    <div className="navbar">
        <div className="logo"><strong className="text-gradient--clr-blue">Enter</strong>Act</div>
        <div className="navbar_buttons"><Button variant="secondary" onClick={()=>{loginWithRedirect()}} >Login</Button></div>
    </div>
    </div>
)
}

const CenterPart=()=>{
  const {loginWithRedirect} =useAuth0();
    return(
        <div className="center_container container">
            <div className="centerpart">
            <h2>
                <strong className="text-gradient--clr-pink">Meet</strong>,{" "}
                <strong className="text-gradient--clr-blue">connect</strong>,
                <br className="sm-screen" />
                and{" "}
                <strong className="text-gradient--clr-green">
                  collaborate
                </strong>{" "}
                effortlessly. 
                <br/>Anytime, anywhere.
              </h2>
            </div>
            <div className="with"><h1>With</h1></div>
            <button className="centerpart_logo" onClick={()=>{loginWithRedirect()}} >   <h1> <strong className="text-gradient--clr-blue">Enter</strong>Act.</h1></button>
        </div>
    )
}

const Home= () => {
  return (
    <div>
      <Navbar/>
      <CenterPart/>
    </div>
  )
}

export default Home
