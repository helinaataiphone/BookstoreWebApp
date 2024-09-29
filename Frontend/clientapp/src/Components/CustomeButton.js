import React from "react";
import { Button } from "@mui/material";

const CustomButton = ({ text, onClick }) => {
  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: "#001f3f", // Navy blue
        color: "white",
        "&:hover": {
          backgroundColor: "#001a33", // Darker navy on hover
          color: "#e0d8b4", // Lighter text color on hover
        },
      }}
    >
      {text}
    </Button>
  );
};

export default CustomButton;
