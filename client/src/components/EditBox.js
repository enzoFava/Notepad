import {
  Button,
  Dialog,
  DialogContent,
  Fade,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { forwardRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

function EditBox({ open, closeDialog, title, editFunction, content, id }) {
  const [updateNote, setUpdateNote] = useState({
    newTitle: "",
    newContent: "",
    id:null,
  });
  const [error, setError] = useState({ title: false, content: false });

  useEffect(() => {
    const populate = () => {
      setUpdateNote({
        newTitle: title,
        newContent: content,
        id: id,
      });
    };
    populate();
  }, [title, content, id]);

  function handleChange(event) {
    const { name, value } = event.target;
    setUpdateNote((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
    setError((prevError) => ({ ...prevError, [name]: false }));
  }

  function handleSave() {
    if (updateNote.newTitle.trim() === "") {
      setError((prevError) => ({ ...prevError, title: true }));
      toast.error("Title is required.");
      return;
    }

    if (updateNote.newContent.trim() === "") {
      setError((prevError) => ({ ...prevError, content: true }));
      toast.error("Content is required.");
      return;
    }

    try {
      editFunction(updateNote);
      toast.success("Note edited successfully!");
    } catch (error) {
      console.error("Error adding note: ", error);
      toast.error("An error occurred while editing the note.");
    } finally {
      closeDialog();
    }
  }

  function cancelEdit() {
    setUpdateNote({
      newTitle: title,
      newContent: content,
      id: id,
    });
  }

  return (
    <Dialog
      open={open}
      maxWidth="md"
      scroll="body"
      onClose={() => {
        closeDialog();
        cancelEdit();
      }}
      onBackdropClick={closeDialog}
      TransitionComponent={Transition}
    >
      <DialogContent sx={{ position: "relative" }}>
        <IconButton
          size="medium"
          onClick={() => {
            closeDialog();
            cancelEdit();
          }}
          sx={{
            padding: "0",
            position: "absolute",
            right: "1rem",
            top: "1rem",
            "&:hover": { background: "#fff", color: "black" },
          }}
        >
          X
        </IconButton>

        <Grid container spacing={2}>
          {" "}
          {/* Adjusted spacing for better responsiveness */}
          <Grid item xs={12}>
            <Box
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "flex-start",
                flexDirection: "column",
              }}
            >
              <Grid item xs={12}>
                <TextField
                  sx={{ marginBottom: "2%" }}
                  label="Title"
                  variant="standard"
                  fullWidth
                  name="newTitle"
                  value={updateNote.newTitle}
                  onChange={handleChange}
                  error={error.title}
                  helperText={error.title ? "Title is required." : ""}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  sx={{ marginBottom: "2%" }}
                  label="Edit the note..."
                  variant="standard"
                  multiline
                  rows={3}
                  fullWidth
                  name="newContent"
                  value={updateNote.newContent}
                  onChange={handleChange}
                  error={error.content}
                  helperText={error.content ? "Content is required." : ""}
                />
              </Grid>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <Button
              sx={{ fontFamily: "'Montserrat', sans-serif" }}
              onClick={() => {
                closeDialog();
                cancelEdit();
              }}
              size="medium"
              variant="contained"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              sx={{ fontFamily: "'Montserrat', sans-serif" }}
              onClick={handleSave}
              size="medium"
              variant="contained"
              color="success"
            >
              Edit
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default EditBox;
