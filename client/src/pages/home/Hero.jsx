// import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Button } from "@/components/ui/button";
const Hero = () => {
const {user,logout} =useAuth0();
  return (
    <div>
      hello {user.name}
      <div>
      <Button variant="secondary" onClick={()=>{logout()}}>Logout</Button>
      </div>
    </div>
  )
}

export default Hero
