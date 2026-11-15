import React from 'react';
import { NavLink } from 'react-router-dom';
import "../assets/style.css";
import "../assets/bootstrap.min.css";

const Header = () => {
    const logout = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${window.location.origin}/djangoapp/logout`, {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Logout failed.");
      const username = sessionStorage.getItem('username') || result.userName;
      sessionStorage.removeItem('username');
      window.location.assign("/");
      window.location.reload();
    } catch (error) {
      window.alert(error.message || "Unable to sign out. Please try again.");
    }
  };
    
//The default home page items are the sign-in and registration links
let home_page_items = <div className="input_panel">
  <NavLink className="nav_item" to="/login">Login</NavLink>
  <NavLink className="nav_item" to="/register">Register</NavLink>
</div>

//Gets the username in the current session
let curr_user = sessionStorage.getItem('username')

//If the user is logged in, show the username and logout option on home page
if ( curr_user !== null &&  curr_user !== "") {
    home_page_items = <div className="input_panel">
      <text className='username'>{sessionStorage.getItem("username")}</text>
    <a className="nav_item" href="/" onClick={logout}>Logout</a>
  </div>
}
    return (
      <nav className="navbar navbar-expand-lg site-navbar">
        <div className="container-fluid">
          <NavLink className="brand-link navbar-brand" to="/" aria-label="Dealerships home">
            <span className="brand-mark" aria-hidden="true">D</span>
            <span className="brand-name">Dealerships</span>
          </NavLink>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#siteNavigation" aria-controls="siteNavigation" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="siteNavigation">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item"><NavLink end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/">Home</NavLink></li>
              <li className="nav-item"><NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/about">About Us</NavLink></li>
              <li className="nav-item"><NavLink className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} to="/contact">Contact Us</NavLink></li>
            </ul>
            <div className="account-area" id="loginlogout">{home_page_items}</div>
          </div>
        </div>
      </nav>
    )
}

export default Header
