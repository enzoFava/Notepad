import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from '@mui/icons-material/EditNote';
import { Zoom, Card, CardContent, Typography, IconButton } from "@mui/material";
import ConfirmBox from "./ConfirmBox";
import EditBox from "./EditBox";

function Note(props) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  async function handleDelete(id) {
    await props.onDelete(id);
  }

  async function handleEdit(updateNote, id) {
    await props.onEdit(updateNote, id).then(() => setEdit(false));
  }

  function openEdit(id){
    setEdit(true);
  }

  function openDelete(id) {
    setOpen(true);
  }

  return (
    <>
      <Zoom in={true}>
        <Card
          sx={{
            margin: "16px", // Add equal margin on all sides
            width: { xs: "calc(100% - 32px)", sm: "240px" }, // Adjust width to match the create area on small screens
            padding: "10px",
            boxShadow: "0 2px 5px #ccc",
            borderRadius: "7px",
            backgroundColor: "#fff", // Ensure the background color is consistent
          }}
        >
          <CardContent>
            <Typography
              sx={{
                fontSize: "1.1em",
                marginBottom: "6px",
                fontWeight: "bold",
                fontFamily: "'Montserrat', sans-serif",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              {props.title}
            </Typography>
            <Typography
              sx={{
                fontSize: "1em",
                marginBottom: "6px",
                fontFamily: "'Montserrat', sans-serif",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              {props.content}
            </Typography>
          </CardContent>
          
          <IconButton
            title="delete"
            aria-label="delete"
            className="note-button"
            onClick={() => openDelete(props.id)}
            sx={{
              position: "relative",
              float: "right",
              marginRight: "10px",
              color: "#4caf50",
              "&:hover": {
                color: "#317434",
                background: "#fff",
              },
              
            }}
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            title="edit"
            aria-label="edit"
            className="note-button"
            onClick={() => openEdit(props.id)}
            sx={{
              position: "relative",
              float: "right",
              color: "#4caf50",
              "&:hover": {
                color: "#317434",
                background: "#fff",
              },
            }}
          >
            <EditNoteIcon fontSize="medium"/>
          </IconButton>
        </Card>
      </Zoom>
      <ConfirmBox
        open={open}
        closeDialog={() => setOpen(false)}
        title={props?.title}
        deleteFunction={() => handleDelete(props.id).then(() => setOpen(false))}
      />
      <EditBox 
        open={edit}
        closeDialog={() => setEdit(false)}
        title={props?.title}
        content={props?.content}
        id={props?.id}
        editFunction={handleEdit}
      />
    </>
  );
}

export default Note;
