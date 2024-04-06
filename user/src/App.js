import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Navigation from './components/Navigation'


// ABIs
import TokenMaster from './abis/TokenMaster.json'
import StudentRegistration from './components/StudentRegistration';



function App() {

  
  return (
    <div>
      <header>

        <h2 className="header__title"><strong>Welcome to Tokenmaster</strong></h2>
        <Navigation/>
      </header>
        <StudentRegistration/>

    </div>
  );
}

export default App;