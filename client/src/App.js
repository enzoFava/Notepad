import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Note from "./components/Note";
import CreateArea from "./components/CreateArea";
import AuthDialog from "./components/AuthDialog";
import { Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { getNotes, addNote, deleteNote, getUser, editNote } from "./api";

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthDialog, setShowAuthDialog] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    const checkTokenExp = () => {
      const token = localStorage.getItem("token");

      if (token) {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          localStorage.removeItem("token");
          console.log("token expired, user logged out");
        }
      }
    };
    checkTokenExp();
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token) {
        setIsLoggedIn(true);
      } else {
        setShowAuthDialog(true);
      }
    };

    const fetchUser = async () => {
      try {
        if (isLoggedIn) {
          const result = await getUser();
          setUser(result.data);
        }
      } catch (error) {
        console.log("Error in fetchUser", error);
      }
    };
    checkAuth();
    fetchUser();
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        if (isLoggedIn) {
          const response = await getNotes();
          const sortedNotes = response.data.sort((a, b) => a.id - b.id);
          setNotes(sortedNotes);
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
    setUser({});
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

  const handleEditNote = async (updateNote) => {
    try {
      if (isLoggedIn) {
        const response = await editNote(updateNote);
        setNotes((prev) =>
          prev.map((note) =>
            note.id === response.data.id ? response.data : note
          )
        );
      } else {
        setNotes((prev) =>
          prev.map((note) =>
            note.id === updateNote.id
              ? {
                  title: updateNote.newTitle,
                  content: updateNote.newContent,
                  id: Date.now().toString(),
                }
              : note
          )
        );
      }
    } catch (error) {
      console.error("Error updating note", error);
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
      <Header isLoggedIn={isLoggedIn} logOut={logOut} user={user} />
      <Typography
        className="custom-h1"
        sx={{
          fontSize: "3em",
          marginBottom: "0",
          fontFamily: "'Montserrat', sans-serif",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "100px",
        }}
      >
        Write your notes!
      </Typography>
      <div className="create-area">
        <CreateArea onAdd={handleAdd} />
      </div>
      {isLoggedIn && (
        <>
          {loading && <p className="loading">Loading notes...</p>}
          {error && (
            <p className="error" style={{ color: "red" }}>
              {error}
            </p>
          )}
        </>
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
              onEdit={handleEditNote}
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
