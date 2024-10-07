import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddIcon from "@mui/icons-material/Add";

function CreateArea(props) {
  const [note, setNote] = useState({ title: "", content: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ title: false, content: false });
  const [clicked, setClicked] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
    setError((prevError) => ({ ...prevError, [name]: false }));
  }

  async function submitNote(event) {
    event.preventDefault();

    // Validation
    if (note.title.trim() === "") {
      setError((prevError) => ({ ...prevError, title: true }));
      return;
    }

    if (note.content.trim() === "") {
      setError((prevError) => ({ ...prevError, content: true }));
      return;
    }

    // Loading state
    setLoading(true);
    setClicked(false);

    try {
      // Add note
      props.onAdd(note);
      toast.success("Note added!");
      // Reset fields
      setNote({ title: "", content: "" });
      
    } catch (error) {
      console.error("Error adding note: ", error);
      toast.error("An error occurred while adding the note.");
    } finally {
      setLoading(false); // Reset loading
    }
  }

  return (
    <div className="create-area">
      <form className="create-note" onSubmit={submitNote}>
        <Grid item xs={12}>
          {clicked && (
            <TextField
              sx={{ marginBottom: "2%" }}
              label="Title"
              variant="standard"
              fullWidth
              name="title"
              value={note.title}
              onChange={handleChange}
              error={error.title}
              helperText={error.title ? "Title is required." : ""}
            />
          )}
        </Grid>

        <Grid item xs={12}>
          <TextField
            sx={{ marginBottom: "2%" }}
            onClick={() => {
              setClicked(true);
            }}
            label="Take a note..."
            variant="standard"
            multiline
            rows={3}
            fullWidth
            name="content"
            value={note.content}
            onChange={handleChange}
            error={error.content}
            helperText={error.content ? "Content is required." : ""}
          />
        </Grid>

        {/* Wrap the Fab inside a container div */}
        <div className="fab-container">
          <Zoom in={clicked}>
            <Fab type="submit" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <AddIcon />}
            </Fab>
          </Zoom>
        </div>
      </form>
    </div>
  );
}

export default CreateArea;
