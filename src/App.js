import { createContext, useEffect, useState, useCallback } from 'react';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';

import './api/axiosDefaults';
import styles from './App.module.css';
import NavBar from './components/NavBar';
import Container from 'react-bootstrap/Container';
import SignUpForm from './pages/auth/SignUpForm';
import SignInForm from './pages/auth/SignInForm';
import PostCreateForm from './posts/PostCreateForm';
import PostPage from './posts/PostPage';
import PostEditForm from './posts/PostEditForm';
import PostsPage from './posts/PostsPage';
import ProfilePage from "./profiles/ProfilePage";

import ProfileUsernameForm from "./profiles/ProfileUsernameForm";
import ProfileUsernamePassword from "./profiles/ProfileUsernamePassword";
import ProfileEditForm from "./profiles/ProfileEditForm";

// Contexts for current user and the function to set it
export const CurrentUserContext = createContext(null);
export const SetCurrentUserContext = createContext(null);

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Fetches the current user data on mount
  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await axios.get('/dj-rest-auth/user/');
      setCurrentUser(data);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  }, []);

  // useEffect for initial mount
  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        <div className={styles.App}>
          <NavBar />
          <Container className={styles.Main}>
            <Switch>
              <Route
                exact
                path="/profiles/:id/edit/username"
                render={() => <ProfileUsernameForm />}
              />
              <Route
                exact
                path="/profiles/:id/edit/password"
                render={() => <ProfileUsernamePassword />}
              />
              <Route
                exact
                path="/profiles/:id/edit"
                render={() => <ProfileEditForm />}
              />
              <Route exact path="/" render={() => <h1>Home Page</h1>} />
              <Route exact path="/signin" component={SignInForm} />
              <Route exact path="/signup" component={SignUpForm} />
              <Route exact path="/posts/create" component={PostCreateForm} />
              <Route exact path="/posts/:id" component={PostPage} />
              <Route exact path="/posts" component={PostsPage} />
              <Route exact path="/posts/:id/edit" render={() => <PostEditForm />} />
              <Route exact path="/profiles/:id" render={() => <ProfilePage />} />

              <Route render={() => <p>Page not found!</p>} />
            </Switch>
          </Container>
        </div>
      </SetCurrentUserContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
