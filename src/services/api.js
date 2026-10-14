import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://the-lens-hut-backend-freelance.vercel.app/api/v1",
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 1e4
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("thelenshut_auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
export {
  api
};
