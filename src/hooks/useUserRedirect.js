import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

export const useUserRedirect = (authStatus) => {
  const history = useHistory();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        await axios.post("/dj-rest-auth/token/refresh/");
        // Redirect if the user is logged in
        if (authStatus === "loggedIn") {
          history.push("/");
        }
      } catch (err) {
        // Redirect if the user is not logged in
        if (authStatus === "loggedOut") {
          history.push("/");
        }
      }
    };

    checkAuthStatus();
  }, [history, authStatus]);
};