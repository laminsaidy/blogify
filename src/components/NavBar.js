import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import logo from "../assets/Logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <Navbar className={styles.NavBar} expand="md" fixed="top">
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <img src={logo} alt="logo" height="45" />
          </Navbar.Brand>
        </NavLink>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            <NavLink to="/"
              exact
              className={styles.NavLink}
            >Home</NavLink>
            <NavLink to="/signin"
              className={styles.NavLink}
            >Sign in</NavLink>
            <NavLink
              to="/register"
              className={styles.NavLink}
            >Register</NavLink>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;