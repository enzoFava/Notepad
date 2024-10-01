import axios from "axios";

const api = axios.create({
  baseURL: "https://notepad-app-server.vercel.app/", //  || 'http://localhost:5000/'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getUser = () => api.get("/user")
export const getNotes = () => api.get("/");
export const addNote = (note) => api.post("/add", { note });
export const deleteNote = (id) => api.post("/delete", { id });
export const editNote = (updateNote) => api.post("/edit", { updateNote });
export const login = (userData) => api.post("/login", userData);
export const register = (userData) => api.post("/register", userData);
