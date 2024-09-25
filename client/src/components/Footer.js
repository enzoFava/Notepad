import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer>
      <p>Created by: Enzo Fava. {year}</p>
    </footer>
  );
}

export default Footer;