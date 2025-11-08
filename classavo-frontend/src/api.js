import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/";

// Store JWT access token in memory
let accessToken = null;

// Function to set the access token after login
export const setAccessToken = (token) => {
  accessToken = token;
};

// Create an Axios instance for authenticated requests
const API = axios.create({
  baseURL: API_BASE,
});

// Add Authorization header if accessToken exists
API.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// API calls
export const getCourses = () => API.get("courses/");
export const getChapters = () => API.get("chapters/");

// Login function (gets JWT token)
export const login = async (username, password) => {
  const response = await axios.post("http://127.0.0.1:8000/api/token/", {
    username,
    password,
  });
  setAccessToken(response.data.access); // store the access token
  return response;
};