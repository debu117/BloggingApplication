import React from "react";
import logoImage from "../assets/logoTwo.jpeg"; // Make sure the path and extension are correct

function Logo({ width = "100px" }) {
  return (
    <img
      src={logoImage}
      alt="Logo"
      style={{ width }}
      className="object-contain rounded-xl stroke-yellow-400 remove-backgroud"
    />
  );
}

export default Logo;
