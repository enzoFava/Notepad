import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Zoom, Card, CardContent, Typography, IconButton } from "@mui/material";
import ConfirmBox from "./ConfirmBox";

function Note(props) {
  const [open, setOpen] = useState(false);

  async function handleDelete(id) {
    await props.onDelete(id);
  }

  function openDelete(id) {
    setOpen(true);
  }

  return (
    <>
      <Zoom in={true}>
        <Card
          sx={{
            margin: "16px",
            width: "240px",
            float: "left",
            padding: "10px",
            boxShadow: "0 2px 5px #ccc",
            borderRadius: "7px",
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
            aria-label="delete"
            className="note-button"
            onClick={() => openDelete(props.id)}
            sx={{
              position: "relative",
              float: "right",
              marginRight: "10px",
              color: "#4caf50",
              '&:hover': {
                color: "#317434",
                background: "#fff"
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Card>
      </Zoom>
      <ConfirmBox
        open={open}
        closeDialog={() => setOpen(false)}
        title={props?.title}
        deleteFunction={() => handleDelete(props.id).then(() => setOpen(false))}
      />
    </>
  );
}

export default Note;
