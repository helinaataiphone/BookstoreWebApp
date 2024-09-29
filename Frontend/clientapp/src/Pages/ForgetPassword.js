import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import NavBar from "../Components/NavBar";
import "./ForgetPassword.css"; // Create a CSS file for additional styling
import axios from 'axios'; // Ensure Axios is imported

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


const handleSubmit = async (e) => {
  e.preventDefault();
  
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    setError(true);
    return;
  }
  setError(false);

  try {
    const response = await axios.post('http://localhost:8000/api/password-reset/', { email: email });
    setSuccessMessage("A password reset link has been sent to your email.");
    setEmail(""); // Optionally clear email field
  } catch (error) {
    console.error("Failed to send password reset email:", error.response ? error.response.data : "Server error");
    // Optionally set error state here to inform the user
  }
};


  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <div>
      <NavBar
        logoSrc="/St_Mary_COC_Logo_No_Background.png"
        title="St. Mary's Coptic Orthodox Church Bookstore"
      />

      <Box className="forget-password-container">
        <Typography variant="h4" gutterBottom>
          Forgot Password
        </Typography>
        <Typography variant="body1" gutterBottom>
          Enter your email address to reset your password. We will send a link to your email.
        </Typography>

        <form onSubmit={handleSubmit} className="forget-password-form">
          <TextField
            label="Email Address"
            type="email"
            value={email}
            onChange={handleInputChange}
            fullWidth
            error={error}
            helperText={error ? "Please enter a valid email address" : ""}
            margin="normal"
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className="submit-button"
          >
            Send Password Reset Link
          </Button>

          {successMessage && (
            <Typography variant="body2" color="success" className="success-message">
              {successMessage}
            </Typography>
          )}
        </form>
      </Box>
    </div>
  );
};

export default ForgetPassword;