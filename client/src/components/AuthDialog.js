import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Zoom,
} from "@mui/material";
import { login, register } from "../api"; // Adjust the import based on your API file structure

const AuthDialog = ({ open, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const response = await login(formData);
        localStorage.setItem("token", response.data.token);
      } else {
        const response = await register(formData);
        localStorage.setItem("token", response.data.token);
      }
      onAuthSuccess(); // Callback to inform parent component
      onClose(); // Close the dialog
    } catch (error) {
      alert(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  function handleClose(event, reason) {
    if (reason !== "backdropClick") {
      onClose();
    }
  }

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      scroll="body"
      onClose={handleClose}
      TransitionComponent={Zoom}
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: "10px",
          padding: "16px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          width: "90%" /* Make dialog width responsive */,
          maxWidth: "500px" /* Limit maximum width */,
        },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: "bold",
          fontSize: "1.5em",
          position: "relative",
        }}
      >
        {isLogin ? "Log In" : "Register"}
      </DialogTitle>
      <DialogContent sx={{ marginTop: 1 }}>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <TextField
                name="firstName"
                label="First Name"
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                InputProps={{ sx: { fontFamily: "'Montserrat', sans-serif" } }} // Custom Input styles
              />
              <TextField
                name="lastName"
                label="Last Name"
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                InputProps={{ sx: { fontFamily: "'Montserrat', sans-serif" } }} // Custom Input styles
              />
            </>
          )}
          <TextField
            name="email"
            label="Email"
            type="email"
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{ sx: { fontFamily: "'Montserrat', sans-serif" } }} // Custom Input styles
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{ sx: { fontFamily: "'Montserrat', sans-serif" } }} // Custom Input styles
          />
          <Typography
            variant="body2"
            sx={{ fontFamily: "'Montserrat', sans-serif", marginTop: 2 }}
          >
            {isLogin ? "Don't have an account? " : "Already have an account?"}
            <Button
              onClick={() => setIsLogin(!isLogin)}
              sx={{
                textDecoration: "underline",
                padding: 0,
                color: "#3f51b5", // Change this to your desired color
                "&:hover": {
                  color: "#303f9f", // Hover color
                },
              }}
            >
              {isLogin ? "Register" : "Log In"}
            </Button>
          </Typography>
        </form>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end", padding: "16px" }}>
        <Button
          onClick={() => {
            onClose();
            alert("Notes will not persist the session.");
          }}
          sx={{
            fontFamily: "'Montserrat', sans-serif",
            color: "#f44336", // Example color for "Stay Logged Out" button
            "&:hover": {
              color: "#c62828", // Hover color
              background: "#fff",
            },
          }}
          variant="outlined"
        >
          Stay Logged Out
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          sx={{
            fontFamily: "'Montserrat', sans-serif",
            backgroundColor: "#4caf50", // Example color for submit button
            "&:hover": {
              backgroundColor: "#388e3c", // Hover color
            },
          }}
          variant="contained"
        >
          {isLogin ? "Log In" : "Register"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AuthDialog;
