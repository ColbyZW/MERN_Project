import './MainPage.css';
import React from 'react';
import {Card} from 'react-bootstrap';
import GoogleButton from '../components/GoogleButton.js'
import Header from '../components/Header';
import Footer from '../components/Footer';

function MainPage() {
  const googleLogin = () => {
    window.location.href = "/auth/google"    
  }
  return (
    <div className="main d-flex flex-column content">
      <Header/>
      <div className="w-100 d-flex center-content align-items-start justify-content-between">
        <div className="px-4 d-flex flex-column w-50 text-center">
          <div className="h4">
            Connecting Community Crafts & Needs
          </div>
          <div className="">
            Where freelancers meet opportunities and clients 
            find talent. Your community's hub for all contract 
            work. Engage today and enrich your local connections.
          </div>
        </div>
        <Card className="mx-5 h-100 w-50 text-center pt-3 mint shadow-lg">
          <Card.Body>
            <Card.Title className="mb-3">
              <p className="h4 dark-mint-text">Welcome to Lancelot!</p>
              <p className="h6 gray">Please Sign in/Register</p>
            </Card.Title>
            <div className="py-4 d-flex flex-column justify-content-center align-items-center">
              <GoogleButton onClick={googleLogin} text={"Sign in with Google"} />
              <div className="my-2">or</div>
              <GoogleButton onClick={googleLogin} text={"Register with Google"}/>
            </div>

          </Card.Body> 
        </Card>
      </div>
      <Footer/>
    </div>
  );
}

export default MainPage;