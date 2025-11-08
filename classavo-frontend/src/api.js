import axios from "axios";

const API_BASE = "http://127.0.0.1:8000/api/";

// Store JWT access token in memory and persist it in localStorage
let accessToken = localStorage.getItem("accessToken") || null;

export const setAccessToken = (token) => {
  accessToken = token;
  localStorage.setItem("accessToken", token); // persist token
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
export const joinCourse = (courseId) => API.post(`courses/${courseId}/join/`);
export const createCourse = (courseData) => API.post("courses/", courseData);
export const getCurrentUser = () => API.get("current-user/");
export const getMyCourses = () => API.get("/my-courses/");
export const getCourseDetails = (id) => API.get(`/courses/${id}/`);
export const getChaptersByCourse = (id) => API.get(`/chapters/?course=${id}`);
export const getStudentsByCourse = (id) => API.get(`/courses/${id}/students/`);
export const removeStudentFromCourse = (courseId, userId) =>
  API.delete(`/courses/${courseId}/students/${userId}/`);
export const deleteCourse = (id) => API.delete(`/courses/${id}/`);
export const unenrollCourse = (id) => API.post(`/courses/${id}/unenroll/`);
export const toggleChapterVisibility = (id) =>
  API.patch(`/chapters/${id}/visibility/`);

// Login function (gets JWT token)
export const login = async (username, password) => {
  const response = await axios.post("http://127.0.0.1:8000/api/token/", {
    username,
    password,
  });
  setAccessToken(response.data.access); // store the access token
  return response;
};