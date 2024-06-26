import axios from "axios";

const api = axios.create({
  baseURL: "https://notepad-server.vercel.app", // "https://resume-creator-server.vercel.app/" || 
});

export const getNotes = () => api.get("/");
export const addNote = (note) => api.post("/add", { note });
export const deleteNote = (id) => api.post("/delete", { id });
