import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5187/api",
});

api.defaults.serURL = "http://localhost:5187";

export default api;