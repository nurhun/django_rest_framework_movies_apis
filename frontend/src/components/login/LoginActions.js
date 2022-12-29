import axios from "axios";
import { push } from "connected-react-router";
import { toast } from "react-toastify";
import { SET_TOKEN, SET_CURRENT_USER, UNSET_CURRENT_USER } from "./LoginTypes";
import { setAxiosAuthToken, toastOnError } from "../../utils/Utils";

export const login = (userData, redirectTo) => dispatch => {
  axios
    .post("/api/v1/users/auth/login/", userData)
    .then(response => {
      // console.log(response.data);
      // console.log(response.data.key);
      // const { auth_token } = response.data;
      setAxiosAuthToken(response.data.key);
      // setAxiosAuthToken(auth_token);
      dispatch(setToken(response.data.key));
      // dispatch(setToken(auth_token));
      dispatch(getCurrentUser(response.data.key, redirectTo));
      // dispatch(getCurrentUser(auth_token, redirectTo));
    })
    .catch(error => {
      dispatch(unsetCurrentUser());
      toastOnError(error);
    });
};

export const getCurrentUser = (auth_token, redirectTo) => dispatch => {
  // console.log(auth_token)
  axios
    .get("/api/v1/users/auth/user/",
    {
      // headers: { Authorization: `Token ee7c137a04978ad4b9a073a6ce4cab1bdea4c531` }
      headers: { Authorization: `Token ${auth_token}` }
    })
    .then(response => {
      const user = {
        username: response.data.username,
        email: response.data.email
      };
      dispatch(setCurrentUser(user, redirectTo));
    })
    .catch(error => {
      dispatch(unsetCurrentUser());
      if (error.response) {
        if (
          error.response.status === 401 &&
          error.response.hasOwnProperty("data") &&
          error.response.data.hasOwnProperty("detail") &&
          error.response.data["detail"] === "User inactive or deleted."
        ) {
          dispatch(push("/resend_activation"));
        }
      } else {
        toastOnError(error);
      }
    });
};

export const setCurrentUser = (user, redirectTo) => dispatch => {
  localStorage.setItem("user", JSON.stringify(user));
  dispatch({
    type: SET_CURRENT_USER,
    payload: user
  });

  if (redirectTo !== "") {
    dispatch(push(redirectTo));
  }
};

export const setToken = token => dispatch => {
  setAxiosAuthToken(token);
  localStorage.setItem("token", token);
  dispatch({
    type: SET_TOKEN,
    payload: token
  });
};

export const unsetCurrentUser = () => dispatch => {
  setAxiosAuthToken("");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  dispatch({
    type: UNSET_CURRENT_USER
  });
};

export const logout = () => dispatch => {
  axios
    .post("/api/v1/users/auth/logout/")
    .then(response => {
      dispatch(unsetCurrentUser());
      dispatch(push("/"));
      toast.success("Logout successful.");
    })
    .catch(error => {
      dispatch(unsetCurrentUser());
      toastOnError(error);
    });
};
