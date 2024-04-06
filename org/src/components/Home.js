import React from 'react';
import './home.css'

const Home = () => {
  return (
    <div className="safe-doc-decentralized-certification-dashboard">
      <div className="text-box">
        <div className="decentralized-text">Decentralized</div>
        <div className="certification-text">Certification</div>
      </div>
      <div className="buttons-container">
        <button className="register-button">Register</button>
        <button className="connect-button">Connect Safe Doc</button>
      </div>
    </div>
  );
}

export default Home
