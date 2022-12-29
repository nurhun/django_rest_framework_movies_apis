import axios from "axios";
import { toastOnError } from "../../utils/Utils";
import { GET_MOVIES, ADD_MOVIE, DELETE_MOVIE, UPDATE_MOVIE } from "./MoviesTypes";

export const getNotes = () => dispatch => {
  axios
    .get("/api/v1/movie/")
    .then(response => {
      dispatch({
        type: GET_MOVIES,
        payload: response.data
      });
    })
    .catch(error => {
      toastOnError(error);
    });
};

export const addNote = note => dispatch => {
  axios
    .post("/api/v1/movie/", note)
    .then(response => {
      dispatch({
        type: ADD_MOVIE,
        payload: response.data
      });
    })
    .catch(error => {
      toastOnError(error);
    });
};

export const deleteNote = id => dispatch => {
  axios
    .delete(`/api/v1/movie/${id}/`)
    .then(response => {
      dispatch({
        type: DELETE_MOVIE,
        payload: id
      });
    })
    .catch(error => {
      toastOnError(error);
    });
};

export const updateNote = (id, note) => dispatch => {
  axios
    .patch(`/api/v1/movie/${id}/`, note)
    .then(response => {
      dispatch({
        type: UPDATE_MOVIE,
        payload: response.data
      });
    })
    .catch(error => {
      toastOnError(error);
    });
};
