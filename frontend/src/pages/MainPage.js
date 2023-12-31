import './MainPage.css';
import React from 'react';
import {Card} from 'react-bootstrap';
import GoogleButton from '../components/GoogleButton.js'
import Header from '../components/Header';
import LancelotFooter from '../components/LancelotFooter.js';

const serverURL = process.env.REACT_APP_SERVER_URL

function MainPage() {
  const googleLogin = () => {
    window.location.href = "/auth/google"    
  }

  return (
    <div className="main d-flex flex-column content">
      <Header/>
      <div className="mt-3 vw-100 d-flex flex-column flex-sm-row center-content align-items-center align-items-sm-start">
        <div className="px-4 d-flex flex-column vw-sm-25 text-center">
          <div className="h4">
            Connecting Community Crafts & Needs
          </div>
          <div className="d-none d-sm-inline">
            Where freelancers meet opportunities and clients 
            find talent. Your community's hub for all contract 
            work. Engage today and enrich your local connections.
          </div>
        </div>
        <Card className="mx-5 w-75 mw-50 w-sm-50 text-center dark-peach pt-3 shadow-lg">
          <Card.Body>
            <Card.Title className="mb-3">
              <p className="h4 dark-mint-text">Welcome to Lancelot!</p>
              <p className="h6 gray">Please Sign in/Register</p>
            </Card.Title>
            <div className="py-4 d-flex h-100 flex-column justify-content-center align-items-center">
              <GoogleButton onClick={googleLogin} text={"Sign in with Google"} />
              <div className="my-2">or</div>
              <GoogleButton onClick={googleLogin} text={"Register with Google"}/>
            </div>

          </Card.Body> 
        </Card>
      </div>
      <LancelotFooter/>
    </div>
  );
}

export default MainPage;