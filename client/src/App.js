import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Note from "./components/Note";
import CreateArea from "./components/CreateArea";
import AuthDialog from "./components/AuthDialog";
import { getNotes, addNote, deleteNote } from "./api"; // Removed unused imports

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
      } else {
        setShowAuthDialog(true);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        if (isLoggedIn) {
          const response = await getNotes();
          setNotes(response.data);
        }
      } catch (error) {
        setError("Error fetching notes. Please try again later.");
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchNotes();
    }
  }, [isLoggedIn]);

  function logOut() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setShowAuthDialog(true);
    setNotes([]);
  }

  function getUser(currentUser) {
    setUser(currentUser);
    console.log(currentUser)
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
      console.error("Error adding new note", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (isLoggedIn) {
        await deleteNote(id);
      }
      setNotes((prev) => prev.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note", error);
    }
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setShowAuthDialog(false);
  };

  return (
    <div className="main-content">
      <Header isLoggedIn={isLoggedIn} logOut={logOut} user={user}/>
      <div className="create-area">
        <CreateArea onAdd={handleAdd} />
      </div>
      {loading && <p className="loading">Loading notes...</p>}
      {error && (
        <p className="error" style={{ color: "red" }}>
          {error}
        </p>
      )}
      <div className="note-container">
        {notes.length > 0 ? (
          notes.map((note) => (
            <Note
              key={note.id}
              id={note.id}
              title={note.title}
              content={note.content}
              onDelete={handleDelete}
              className="note"
            />
          ))
        ) : (
          <p>No notes available.</p>
        )}
      </div>
      <Footer />
      {!isLoggedIn && (
        <AuthDialog
          open={showAuthDialog}
          onClose={() => setShowAuthDialog(false)}
          onAuthSuccess={handleAuthSuccess}
          getUser={getUser}
        />
      )}
    </div>
  );
}

export default App;
