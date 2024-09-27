import React from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

function Header({ isLoggedIn, logOut }) {
  return (
    <header>
      <Container
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: 0,
          boxSizing: "border-box",
        }}
      >
        <h1>
          <DescriptionIcon />
          Notepad
        </h1>
        {isLoggedIn && (
          <Button
            onClick={() => logOut()}
            sx={{
              textDecoration: "none",
              fontFamily: "'Montserrat', sans-serif",
              padding: "6px, 16px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              color: "#fff",
              backgroundColor: "#4caf50", // Change this to your desired color
              "&:hover": {
                backgroundColor: "#317434", // Hover color
              },
            }}
          >
            Log out
          </Button>
        )}
      </Container>
    </header>
  );
}

export default Header;
