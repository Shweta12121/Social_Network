import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    
    if (
      token &&
      !config.url.includes("login") &&
      !config.url.includes("signup")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;