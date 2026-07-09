import axios from "axios";

const API = axios.create({
  baseURL: "/api/designs", // change if needed
});

// attach token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const createDesignAPI = (data) => API.post("/", data);
export const getFoldersAPI = () => API.get("/folders");
export const createFolderAPI = (data) => API.post("/folders", data);
