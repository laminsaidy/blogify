import React, { useContext } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { CurrentUserContext } from "../App";
import logo from "../assets/Logo.png";
import styles from "../styles/NavBar.module.css";
import useToggle from "../hooks/useToggle"; // Import custom hook

const NavBar = () => {
  // Access the current user from context
  const currentUser = useContext(CurrentUserContext);

  // Toggle state for the burger menu
  const [isOpen, toggleMenu] = useToggle();

  // Define icons based on user's login state
  const loggedInIcons = <span>Hello, {currentUser?.username}</span>;
  const loggedOutIcons = (
    <>
      <NavLink className={styles.NavLink} activeClassName={styles.Active} to="/signin">
        <i className="fas fa-sign-in-alt"></i>Sign in
      </NavLink>
      <NavLink to="/signup" className={styles.NavLink} activeClassName={styles.Active}>
        <i className="fas fa-user-plus"></i>Register</NavLink>
    </>
  );

  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height="45" />
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          aria-expanded={isOpen} // Indicate toggle state
          onClick={toggleMenu} // Toggle menu on click
        />
        <Navbar.Collapse id="basic-navbar-nav" className={isOpen ? 'show' : ''}>
          <Nav className="ml-auto text-left">
            <NavLink exact className={styles.NavLink} activeClassName={styles.Active} to="/">
              <i className="fas fa-home"></i>Home
            </NavLink>
            {/* Render logged-in or logged-out icons based on currentUser */}
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;