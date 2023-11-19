import React, { useState } from 'react';
import './Registration.css';

function Registration() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [isFreelancer, setIsFreelancer] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (termsAccepted) {

            //
            // add actual oauth call to save profile data
            //

            console.log('Form submitted', { firstName, lastName, isFreelancer });
        } else {
            alert('Please accept the terms of service to continue.');
        }
    };

    const inputContainerStyle = {
        display: 'block',
        marginBottom: '20px',
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '5px',
    };

    const inputStyle = {
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
    };

    const checkboxContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        margin: '20px 0'
    };

    const checkboxStyle = {
        marginRight: '10px'
    }


    return (
        <>
            <header style={{
                position: 'absolute',
                top: 0,
                left: 0,
                padding: '20px',
                fontSize: '48px',
                fontFamily: 'var(--header-font-family)',
                fontWeight: 'var(--header-font-weight)',
                lineHeight: 'var(--header-line-height)',
                letterSpacing: 'var(--header-letter-spacing)',
                color: 'black'
            }}>
                Lancelot
            </header>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: 'var(--peach)',
                padding: '40px'
            }}>
                <form onSubmit={handleSubmit} style={{
                    width: '50%',
                    maxWidth: '500px',
                    padding: '40px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'var(--mint)'
                }}>
                    <h2 style={{
                        textAlign: 'center',
                        padding: '10px',
                        fontSize: '40px'
                    }}>Sign Up</h2>
                    <div style={{       // placeholder for google oauth reference. like just the gmail address and profile pic
                        width: '60%',
                        height: '2em',
                        backgroundColor: 'white',
                        margin: '20px auto',
                        maxWidth: '300px',
                        textAlign: 'center'
                    }}>reference to google account</div>
                    <div style={{ ...inputContainerStyle }}>
                        <label style={{ ...labelStyle }}>First Name</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            style={{ ...inputStyle }}
                        />
                    </div>
                    <div style={{ ...inputContainerStyle }}>
                        <label style={{ ...labelStyle }}>Last Name</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            style={{ ...inputStyle }}
                        />
                    </div>
                    <div style={checkboxContainerStyle}>
                        <input
                            type="checkbox"
                            checked={isFreelancer}
                            onChange={(e) => setIsFreelancer(e.target.checked)}
                            style={checkboxStyle}
                        />
                        <label>I am a Freelancer</label>
                    </div>
                    <div style={checkboxContainerStyle}>
                        <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            style={checkboxStyle}
                        />
                        <label>
                            Yes, I understand and agree to the Lancelot Terms of Service, including the User Agreement and Privacy Policy
                        </label>
                    </div>
                    <button type="submit" style={{
                        width: '100%',
                        padding: '10px',
                        marginTop: '20px',
                        borderRadius: '5px',
                        border: 'none',
                        backgroundColor: 'var(--dark-mint)',
                        color: 'white'
                    }}>Register</button>
                </form>
            </div>
        </>
    );
}

export default Registration;