import React from "react";
import './Header.css'

function Header() {
    return (
        <div className="head mb-4 d-flex justify-content-start">
            <div className="py-3 px-3 py-sm-4 px-sm-4 text-center">
              <p className="h1 title">LANCELOT</p>  
              <p className="h6 d-none d-sm-block">Empower Your Passion</p>
              <p className="h6 d-none d-sm-block">Freelance Freely</p>
            </div>
        </div>
    )
}

export default Header;