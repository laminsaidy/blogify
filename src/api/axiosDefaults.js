import axios from 'axios';

// A variable for the base URL
const API_URL = "https://my-react-drf-api-rec.herokuapp.com/";

// exports a custom axios instance for non-authenticated requests
export const axiosPublic = axios.create({
  baseURL: API_URL,
});

// exports a custom axios instance for authenticated requests
export const axiosPrivate = axios.create({
  baseURL: API_URL,
});

