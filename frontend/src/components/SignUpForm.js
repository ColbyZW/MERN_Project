import React, { useState } from 'react';
import './SignUpForm.css';

function SignUpForm() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isFreelancer, setIsFreelancer] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState('');

    const handleRegister = (event) => {
        event.preventDefault();
        // Registration logic goes here
    };

    return (
        <div className="signup-form">
            <h1>Sign Up</h1>
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <div>
                    <label>
                        <input
                            type="radio"
                            value="freelancer"
                            checked={isFreelancer === 'freelancer'}
                            onChange={() => setIsFreelancer('freelancer')}
                        />
                        Freelancer
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="radio"
                            value="agreed"
                            checked={agreedToTerms === 'agreed'}
                            onChange={() => setAgreedToTerms('agreed')}
                        />
                        Yes, I understand and agree to the Lancelot Terms of Service, including the User Agreement and Privacy Policy
                    </label>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default SignUpForm;