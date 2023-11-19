import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Registration.css';
import { Container } from 'react-bootstrap';

const serverURL = process.env.REACT_APP_SERVER_URL;

function Registration() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [gmail, setGmail] = useState('');
    const [isFreelancer, setIsFreelancer] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [err, setErr] = useState(false);
    const [errMsg, setErrMsg] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetch(serverURL + "/user")
        .then(res => res.json())
        .then(data => setGmail(data.email));
    }, [])

    const handleSubmit = (event) => {
        event.preventDefault();
        setErr(false);
        if (!companyName.trim().length || !firstName.trim().length || !lastName.trim().length) {
            setErr(true);
            setErrMsg("Please fill out all fields");
        }
        if (termsAccepted) {
            let url = serverURL + "/user";
            if (isFreelancer) {
                url = url + "/lancer"
            } else {
                url = url + "/client"
            }
            let payload = {
                name: `${firstName} ${lastName}`,
                company: companyName
            }
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            }).then(res => {
                if (res.status === 200) {
                    navigate("/home");
                }
            })
        } else {
            setErr(true);
            setErrMsg("Please accept the Terms of Service");
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
        <Container fluid className="min-vh-100"
            style={{
                backgroundColor: 'var(--peach)',
            }}
        >
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
                padding: '40px'
            }}>
                <form onSubmit={handleSubmit} style={{
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
                    <div className="my-0 text-center text-decoration-underline">
                        You are signing up with this email
                    </div>
                    <div 
                        className="w-100 d-flex mx-auto justify-content-center border border-dark mb-3"
                        style={{       // placeholder for google oauth reference. like just the gmail address and profile pic
                        height: '2em',
                        backgroundColor: 'white',
                        maxWidth: '300px',
                        textAlign: 'center'
                    }}>
                        <p>{gmail}</p>
                    </div>
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
                    <div style={{ ...inputContainerStyle }}>
                        <label style={{ ...labelStyle }}>Company Name (N/A if not applicable)</label>
                        <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
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
                    {err && <p className="text-danger">{errMsg}</p>}
                </form>
            </div>
        </Container>
    );
}

export default Registration;