import axios from 'axios';

// Define a constant for the base URL
const API_URL = "https://my-react-drf-api-rec.herokuapp.com/";

// Create a custom axios instance for non-authenticated requests
export const axiosPublic = axios.create({
  baseURL: API_URL,
});

// Create a custom axios instance for authenticated requests
export const axiosPrivate = axios.create({
  baseURL: API_URL,
});

