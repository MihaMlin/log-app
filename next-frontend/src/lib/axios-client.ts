import axios from "axios";

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
};

const APIRefresh = axios.create(options);
const API = axios.create(options);

APIRefresh.interceptors.response.use((response) => response);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { data, status } = error.response;
    if (data.errorCode === "InvalidAccessToken" && status === 401) {
      try {
        await APIRefresh.get("/auth/refresh");
        return API(error.config); // Retry the original request with the new access token
      } catch (error) {
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject({
      ...data,
    });
  }
);

export default API;
export { APIRefresh };
