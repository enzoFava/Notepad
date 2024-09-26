import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Note from "./components/Note";
import CreateArea from "./components/CreateArea";
import AuthDialog from "./components/AuthDialog"; // Import the AuthDialog component
import { getNotes, addNote, deleteNote, login, register } from "./api"; // Make sure to import your API functions

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
        fetchNotes(); // Fetch notes if user is logged in
      } else {
        setShowAuthDialog(true); // Show auth dialog if no token
      }
    };

    checkAuth();
  }, []);

  const fetchNotes = async () => {
    setLoading(true); // Set loading state to true at the start
    try {
      const response = await getNotes(); // Fetch notes from the API
      setNotes(response.data);
    } catch (error) {
      setError("Error fetching notes. Please try again later.");
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleAdd = async (note) => {
    try {
      const response = await addNote(note);
      setNotes((prev) => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding new note ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter(note => note.id !== id));
    } catch (error) {
      console.error("Error deleting note ", error);
    }
  };

  const handleAuthSuccess = () => {
    setIsLoggedIn(true);
    setShowAuthDialog(false); // Close dialog on successful auth
    fetchNotes(); // Fetch notes after successful login/register
  };

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

      {/* Auth Dialog */}
      <AuthDialog
        open={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;
