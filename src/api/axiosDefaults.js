import axios from "axios";

axios.defaults.baseURL = "https://my-react-drf-api-rec.herokuapp.com/";
axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
axios.defaults.withCredentials = true;