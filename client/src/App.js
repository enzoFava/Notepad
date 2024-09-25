import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Note from "./components/Note";
import CreateArea from "./components/CreateArea";
import { getNotes, addNote, deleteNote } from "./api";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      setLoading(true); // Set loading state to true at the start
      try {
        const response = await getNotes();
        setNotes(response.data);
      } catch (error) {
        setError("Error fetching notes. Please try again later.");
        console.error("Error del GET", error);
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    getData();
  }, []);

  async function handleAdd(note) {
    try {
      const response = await addNote(note);
      setNotes((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding new note ", error);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter(note => note.id !== id));
    } catch (error) {
      console.error("Error deleting note ", error);
    }
  }

  return (
    <div>
      <Header />
      <CreateArea onAdd={handleAdd} />
      {loading && <p>Loading notes...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {notes.length > 0 ? (
        notes.map((note) => {
          return (
            <Note
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              onDelete={handleDelete}
            />
          );
        })
      ) : (
        <p>No notes available.</p>
      )}
      <Footer />
    </div>
  );
}

export default App;