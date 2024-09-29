import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import NavBar from "../Components/NavBar";
import { UserProvider } from "../Components/UserAdminContext";
import { AuthContext } from '../AuthContext';
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Import Axios


const Signup = () => {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize navigate hook
  const { isAuthenticated } = useContext(AuthContext);

  // Check if user is authenticated before rendering the component
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/"); // Redirect to home if authenticated
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    first_name: "",
    password: "",
    last_name: "",
    email: "",
    address: "",
    username: "",
    phonenumber: "",
    gender: "", // Add gender field in formData state
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Function to capitalize the first letter of each word
    const capitalizeWords = (str) =>
      str.replace(/\b(\w)/g, (s) => s.toUpperCase());

    if (name === "first_name" || name === "last_name") {
      // Capitalize the first letter of each word for names
      formattedValue = capitalizeWords(value.toLowerCase());
    } else if (name === "email" || name === "username") {
      // Convert email to lowercase
      formattedValue = value.toLowerCase();
    } else if (name === "address") {
      // Capitalize each word in the address
      formattedValue = capitalizeWords(value);
    }

    setFormData({ ...formData, [name]: formattedValue });
  };

  const validateForm = () => {
    const newErrors = {};

    // Password validation
    const password = formData.password;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isValidLength = password.length >= 8;

    if (!isValidLength || !hasUpperCase || !hasSpecialChar) {
      newErrors.password =
        "Password must be at least 8 characters long, contain at least one uppercase letter, and one special character.";
    }

    // Email validation
    if (!formData.email.includes("@")) {
      newErrors.email = "Email must contain an @ symbol and be a valid email.";
    }

    // Phone number validation (US 10-digit phone number)
    const phoneNumber = formData.phonenumber;
    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
      newErrors.phoneNumber =
        "Phone number must be a valid 10-digit US number.";
    }

    // Address validation (basic regex for US addresses)
    const addressRegex = /^\d+\s[\w\s.-]+/; // Accepts numbers, letters, spaces, dots, and hyphens
    if (!addressRegex.test(formData.address)) {
      newErrors.address = "Please enter a valid US address.";
    }

    // Username validation: only letters, numbers, and underscores
    const usernameRegex = /^[A-Za-z0-9_]+$/;
    if (!usernameRegex.test(formData.username)) {
      newErrors.username =
        "Username invalid. Only letters, numbers, and underscores are allowed.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Handle form submission logic here
      console.log(formData);
      try {
        const response = await axios.post("http://localhost:8000/api/register/", formData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        console.log("Response data:", response.data);
        navigate('/login');
      } catch (error) {
        console.error("Error registering user:", error.response ? error.response.data : error.message);
      }
      setErrors({});
    }
  };

  // Don't render the form if the user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="background">
      <UserProvider>
        <NavBar
          logoSrc="/St_Mary_COC_Logo_No_Background.png"
          title="St. Mary's Coptic Orthodox Church Bookstore"
        />
      </UserProvider>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" sx={{ color: "#2b2d42" }}>
              Sign Up
            </Typography>
          </Box>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="first_name"
                  name="first_name"
                  label="First Name"
                  variant="outlined"
                  value={formData.first_name}
                  onChange={handleChange}
                  InputLabelProps={{ sx: { color: "#2b2d42" } }}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="last_name"
                  name="last_name"
                  label="Last Name"
                  variant="outlined"
                  value={formData.last_name}
                  onChange={handleChange}
                  InputLabelProps={{ sx: { color: "#2b2d42" } }}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  name="email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  value={formData.email}
                  onChange={handleChange}
                  InputLabelProps={{ sx: { color: "#2b2d42" } }}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                  InputLabelProps={{ sx: { color: "#2b2d42" } }}
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  name="address"
                  label="Address"
                  variant="outlined"
                  value={formData.address}
                  onChange={handleChange}
                  InputLabelProps={{ sx: { color: "#2b2d42" } }}
                  error={!!errors.address}
                  helperText={errors.address}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  variant="outlined"
                  value={formData.username}
                  onChange={handleChange}
                  InputLabelProps={{ sx: { color: "#2b2d42" } }}
                  error={!!errors.username}
                  helperText={errors.username}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phonenumber"
                  name="phonenumber"
                  label="Phone Number"
                  type="tel"
                  variant="outlined"
                  value={formData.phonenumber}
                  onChange={handleChange}
                  InputLabelProps={{ sx: { color: "#2b2d42" } }}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="gender-label" sx={{ color: "#2b2d42" }}>
                    Gender
                  </InputLabel>
                  <Select
                    labelId="gender-label"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    label="Gender"
                    required
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box textAlign="center" mt={4}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: "#2b2d42",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#1d202e" },
                }}
              >
                Sign Up
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default Signup;
