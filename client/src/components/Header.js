import React from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import { useMediaQuery } from "@mui/material";

function Header({ isLoggedIn, logOut }) {
  const isMobile = useMediaQuery("(max-width:600px)");

  return (
    <header>
      <Container
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row", // Stack on small screens
          justifyContent: "space-between",
          alignItems: "center",
          margin: 0,
          width: "100%",
          padding: isMobile ? "10px" : "10px", // Consistent padding
        }}
      >
        <h1 style={{ fontSize: isMobile ? "1.5rem" : "2rem" }}>
          <DescriptionIcon sx={{ marginRight: "8px" }} />
          Notepad
        </h1>
          <Button
            onClick={logOut}
            sx={{
              textDecoration: "none",
              fontFamily: "'Montserrat', sans-serif",
              padding: "6px 16px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              color: "#fff",
              backgroundColor: "#4caf50",
              "&:hover": {
                backgroundColor: "#317434",
              },
              fontSize: isMobile ? "0.9rem" : "1rem", // Responsive font size
            }}
          >
            {isLoggedIn ? "Log out" : "Log In | Register"}
          </Button>
      </Container>
    </header>
  );
}

export default Header;
