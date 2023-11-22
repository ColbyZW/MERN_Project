import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar, Container, Nav } from "react-bootstrap";
import LancelotFooter from "./LancelotFooter";
import './LancelotNav.css'

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
    }, [navigate])

    function handleLogout() {
        fetch(serverURL + "/user/logout")
        .then(res => res.json())
        .then(() => {
            navigate("/")
        })
    }
    return (
        <div className="d-flex flex-column justify-content-between min-vh-100">
            <Navbar sticky="top" expand="lg" className="mb-3" style={{backgroundColor: "var(--peach)"}}>
                <Container style={{backgroundColor: "var(--peach)"}} fluid>
                    <Navbar.Brand  href="/home"> <h3>LANCELOT</h3> </Navbar.Brand>
                    <Navbar.Toggle className="no-focus" aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse className="no-focus" id="basic-navbar-nav">
                        <Nav className="me-auto no-focus">
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
            <LancelotFooter/>
        </div>
    )
}

export default LancelotNav;