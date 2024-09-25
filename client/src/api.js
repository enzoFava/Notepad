import axios from "axios";

const api = axios.create({
  baseURL: "https://notepad-app-server.vercel.app/", // 'http://localhost:5000/' || 
});

export const getNotes = () => api.get("/");
export const addNote = (note) => api.post("/add", { note });
export const deleteNote = (id) => api.post("/delete", { id });
