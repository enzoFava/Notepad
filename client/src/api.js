import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:5000/', // "https://notepad-app-server.vercel.app/" || 
});

export const getNotes = () => api.get("/");
export const addNote = (note) => api.post("/add", { note });
export const deleteNote = (id) => api.post("/delete", { id });
export const login = (userData) => api.post("/login", userData);
export const register = (userData) => api.post("/register", userData);
