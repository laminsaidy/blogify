import React from 'react';
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignupForm from './components/SignupForm';
import SignInForm from './components/SignInForm';

function App() {
  return (
    <Router>
      <div className={styles.App}>
        <NavBar />
        <Container className={styles.Main}>
          <Switch>
            <Route exact path="/" render={() => <h1>Home Page</h1>} />
            <Route exact path="/signin" component={SignInForm} />
            <Route exact path="/register" component={SignupForm} />
            <Route render={() => <p>Page not found!</p>} />
          </Switch>
        </Container>
      </div>
    </Router>
  );
}

export default App;