// import axios from "axios";

// axios.defaults.baseURL = "https://my-react-drf-api-rec.herokuapp.com/";
// axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
// axios.defaults.withCredentials = true;

import axios from 'axios';

export const axiosRes = axios.create({
    baseURL: "https://my-react-drf-api-rec.herokuapp.com/"// Update with your actual API URL
    // Other config options
});

export const axiosReq = axios.create({
    baseURL: "https://my-react-drf-api-rec.herokuapp.com/",// Same here
    // Other config options
});