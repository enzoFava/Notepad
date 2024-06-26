import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Note from "./components/Note";
import CreateArea from "./components/CreateArea";
import { getNotes, addNote, deleteNote } from "./api";

function App() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getNotes();
        if (response.data.length > 0){
          setNotes(response.data);
        } else {
          setNotes([]);
        }
      } catch (error) {
        console.error("Error del GET", error);
      }
    };

    getData();
  }, []);

  async function handleAdd(note){
    try {
      const response = await addNote(note);
      setNotes((prev) => [...prev, response.data])
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
      <CreateArea onAdd={handleAdd}/>
      {notes.map((note) => {
        return (
          <Note
            key={note.id}
            id={note.id}
            title={note.title}
            content={note.content}
            onDelete={handleDelete}
          />
        );
      })}
      <Footer />
    </div>
  );
}

export default App;
