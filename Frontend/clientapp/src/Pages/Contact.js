import React, { useState } from "react";
import "./Contact.css";
import NavBar from "../Components/NavBar"; // Assuming you already have a NavBar component
import Footer from "../Components/Footer"; // Assuming Footer component with social media links
import { UserProvider } from "../Components/UserAdminContext"; // Context for user data
import { TextField, Button, Typography } from "@mui/material";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    notes: "",
  });

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form Data Submitted:", formData);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div className="background">
      <UserProvider>
        <NavBar
          logoSrc="/St_Mary_COC_Logo_No_Background.png"
          title="St. Mary's Coptic Orthodox Church Bookstore"
        />
      </UserProvider>
      <div className="contact-background">
        <div className="contact-container">
          <Typography variant="h4" align="center" gutterBottom>
            Contact Us
          </Typography>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                required
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                required
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                sx={{ marginBottom: 2 }}
              />
            </div>
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              required
              name="email"
              value={formData.email}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <div className="spacer"></div> {/* Spacer for visual separation */}
            <TextField
              label="Notes"
              variant="outlined"
              fullWidth
              required
              multiline
              rows={4}
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <Button type="submit" variant="contained" fullWidth>
              Submit
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
