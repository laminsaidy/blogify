import axios from 'axios';

export const axiosRes = axios.create({
    baseURL: "https://my-react-drf-api-rec.herokuapp.com/"// Update with your actual API URL
    // Other config options
});

export const axiosReq = axios.create({
    baseURL: "https://my-react-drf-api-rec.herokuapp.com/",// Same here
    // Other config options
});