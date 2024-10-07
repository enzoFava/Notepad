import {
  Button,
  Dialog,
  DialogContent,
  Fade,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { forwardRef } from "react";
import {toast} from 'react-toastify';

const Transition = forwardRef(function Transition(props, ref) {
  return <Fade ref={ref} {...props} />;
});

function ConfirmBox({ open, closeDialog, title, deleteFunction }) {
  return (
    <Dialog
      open={open}
      maxWidth="md"
      scroll="body"
      onClose={closeDialog}
      onBackdropClick={closeDialog}
      TransitionComponent={Transition}
    >
      <DialogContent sx={{ position: "relative" }}>
        <IconButton
          size="medium"
          onClick={closeDialog}
          sx={{
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
              <Typography
                sx={{ fontFamily: "'Montserrat', sans-serif" }}
                variant="h5"
              >
                Delete {title}
              </Typography>
              <Typography
                sx={{ fontFamily: "'Montserrat', sans-serif" }}
                variant="body1"
              >
                Are you sure you want to delete this {title}?
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}
          >
            <Button
              sx={{ fontFamily: "'Montserrat', sans-serif" }}
              onClick={closeDialog}
              size="medium"
              variant="contained"
              color="primary"
            >
              Cancel
            </Button>
            <Button
              sx={{ fontFamily: "'Montserrat', sans-serif" }}
              onClick={() => {
                deleteFunction();
                toast.error("Note deleted");
                closeDialog();
              }}
              size="medium"
              variant="contained"
              color="error"
            >
              Delete
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmBox;
