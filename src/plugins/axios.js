import axios from "axios";
import { useRouter } from "vue-router";

const api = axios.create({
  // baseURL: "http://localhost:8101/api/v1",
  baseURL: "http://localhost:8980/api/v1",
  timeout: 60000,
});

// Add a request interceptor
api.interceptors.request.use(
  function (config) {
    // Do something before request is sent

    const token = (localStorage && localStorage.getItem("token")) || null;
    token && (config.headers["Authorization"] = `Bearer ${token}`);

    config.headers["Accept-Language"] = "uz";

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response?.data;
  },
  function (error) {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("me");
      window.location.href = "/auth/sign-in";
    }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

export default api;
