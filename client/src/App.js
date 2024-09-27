import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Note from "./components/Note";
import CreateArea from "./components/CreateArea";
import AuthDialog from "./components/AuthDialog";
import { getNotes, addNote, deleteNote, login, register } from "./api";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage authentication state

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token'); // Assuming you store the JWT token in local storage
      if (token) {
        setIsLoggedIn(true); // User is logged in
        console.log(notes);
      } else {
        setShowAuthDialog(true); // Show auth dialog if no token
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true); // Set loading state to true at the start
      try {
        if (isLoggedIn) {
          const response = await getNotes(); // Fetch notes from the API
          setNotes(response.data);
        }
      } catch (error) {
        setError("Error fetching notes. Please try again later.");
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    if (isLoggedIn) {
      fetchNotes();
    }

  }, [isLoggedIn]);
    
  function logOut(){
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowAuthDialog(true);
    setNotes([]);
  }

  const handleAdd = async (note) => {
    try {
      if (isLoggedIn) {
        const response = await addNote(note);
        setNotes((prev) => [...prev, response.data]);
      } else {
        const tempNote = { ...note, id: Date.now().toString() };
        setNotes((prev) => [...prev, tempNote]);
      }
    } catch (error) {
      console.error("Error adding new note ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (isLoggedIn) {
        await deleteNote(id);
      }
      setNotes((prev) => prev.filter(note => note.id !== id));
    } catch (error) {
      console.error("Error deleting note ", error);
    }
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setShowAuthDialog(false); // Close dialog on successful auth
  };

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} logOut={logOut}/>
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

      {/* Auth Dialog */}
      {!isLoggedIn && 
      <AuthDialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onAuthSuccess={handleAuthSuccess}
      />
      }
    </div>
  );
}

export default App;
