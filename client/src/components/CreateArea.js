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
  const [note, setNote] = useState({
    title: "",
    content: "",
  });
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

    //Validation
    if (note.title.trim() === "") {
      setError((prevError) => ({ ...prevError, title: true }));
      toast.error("Title is required.");
      return;
    }

    if (note.content.trim() === "") {
      setError((prevError) => ({ ...prevError, content: true }));
      toast.error("Content is required.");
      return;
    }

    //loading state
    setLoading(true);
    setClicked(false);

    try {
      //add note
      props.onAdd(note);
      //reset fields
      setNote({
        title: "",
        content: "",
      });
      toast.success("Note added succesfully!");
    } catch (error) {
      //handle errors
      console.error("Error adding note: ", error);
      toast.error("An error occurred while adding the note.");
    } finally {
      //reset loading
      setLoading(false);
    }
  }

  return (
    <form className="create-note">
      {/* Title Input */}
      <Grid item xs={12}>
        {clicked && (
          <TextField
            sx={{
              marginBottom: "2%",
            }}
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

      {/* Content Input */}
      <Grid item xs={12}>
        <TextField
          sx={{
            marginBottom: "2%",
          }}
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

      {/* Submit Button */}
      <Grid item xs={12} style={{ textAlign: "center" }}>
        <Zoom in={clicked}>
          <Fab
            type="submit"
            color="primary"
            onClick={submitNote}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : <AddIcon />}
          </Fab>
        </Zoom>
      </Grid>
    </form>
  );
}

export default CreateArea;
