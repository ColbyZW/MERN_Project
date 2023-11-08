import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";

const serverURL = process.env.REACT_APP_SERVER_URL

function LancelotNav() {
    const navigate = useNavigate()
    useEffect(() => {
        fetch(serverURL + "/user/isLoggedIn")
        .then(response => response.json())
        .then(data => {
          if (data.redirect) {
            navigate(data.redirect)
          }
        })
    }, [])

    function handleLogout() {
        fetch(serverURL + "/user/logout")
        .then(res => res.json())
        .then(() => {
            navigate("/")
        })
    }
    return (
        <div>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container style={{backgroundColor: "var(--peach)"}} fluid>
                    <Navbar.Brand  href="/home">Lancelot</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/home">Browse Jobs</Nav.Link>
                            <Nav.Link href="/home/newJob">Post a Job</Nav.Link>
                            <Nav.Link href="/home/profile">Profile</Nav.Link>
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div>
                <Outlet/>
            </div>
        </div>
    )
}

export default LancelotNav;