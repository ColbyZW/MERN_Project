import './Registration.css';
import React from "react";
import SignUpForm from '../components/SignUpForm';

function Registration() {
    return (
        <div className="registration-container">
            <div className="registration-header">LANCELOT</div>
            <div className="sign-up-container">
                <SignUpForm />
            </div>
        </div>
    );
}

export default Registration;
