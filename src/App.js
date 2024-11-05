import axios from 'axios';
import { createContext, useEffect, useState } from 'react';
import "./api/axiosDefaults";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm"; 

// Creating the contexts for current user and function to set it
export const CurrentUserContext = createContext(null);
export const SetCurrentUserContext = createContext(null);

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch the current user data on component mount
  const handleMount = async () => {
    try {
      const { data } = await axios.get("/dj-rest-auth/user/");
      setCurrentUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleMount();
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        <div className={styles.App}>
          <NavBar />
          <Container className={styles.Main}>
            <Switch>
              <Route exact path="/" render={() => <h1>Home Page</h1>} />
              <Route exact path="/signin" component={SignInForm} />
              <Route exact path="/signup" component={SignUpForm} />
              <Route render={() => <p>Page not found!</p>} />
            </Switch>
          </Container>
        </div>
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;