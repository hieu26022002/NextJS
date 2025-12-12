import axios from "axios";

const instance = axios.create({
    baseURL: "http://localhost:8082/api/auth",
});

export default instance;