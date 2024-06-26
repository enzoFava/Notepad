import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { Zoom } from "@mui/material";
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
      <div className="note">
        <h1>{props.title}</h1>
        <p>{props.content}</p>
        <button onClick={() => openDelete(props.id)}>
          <DeleteIcon />
        </button>
      </div>
    </Zoom>
    <ConfirmBox
    open={open}
    closeDialog={() => setOpen(false)}
    title={props?.title}
    deleteFunction={() => handleDelete(props.id).then(setOpen(false))}
  />
  </>
  );
}

export default Note;
