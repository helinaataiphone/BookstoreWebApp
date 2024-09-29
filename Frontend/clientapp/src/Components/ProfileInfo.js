import React, { useState, useContext  } from "react";
import {
  Avatar,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Link,
} from "@mui/material";
import "./ProfileInfo.css";
import { useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CustomButton from "./CustomeButton";
import axios from 'axios'; // Make sure Axios is imported
import { AuthContext } from '../AuthContext';  // Import AuthContext to use userId


const ProfileInfo = ({ user, isAdmin }) => {

  // Store the initial form data to revert on cancel
  console.log(user);
  const initialFormData = {
    firstName: user.first_name,
    lastName: user.last_name,
    username: user.username,
    password: user.password,
    accountCreated: user.date_joined,
    shippingAddress: user.address,
    phoneNumber: user.phonenumber,
    email: user.email,
    isAdmin: user.is_staff,
    gender: user.gender || "male", // Default to male if not specified
  };

  // State to manage the edit mode and form data
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [hasChanged, setHasChanged] = useState(false); // Track if fields have been changed
  const [emailError, setEmailError] = useState(""); // Track email validation error
  const [phoneError, setPhoneError] = useState(""); // Track phone number validation error
  const navigate = useNavigate();
  const { userId } = useContext(AuthContext); 

  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  
  // Set CSRF token for every request
  const csrftoken = getCookie('csrftoken');
  axios.defaults.headers.common['X-CSRFToken'] = csrftoken;

  // Handle tab change navigation
  const handleTabChange = (event, newValue) => {
    if (newValue === 0) {
      navigate("/orders");
    } else if (newValue === 1) {
      navigate("/cart");
    }
  };

  // Capitalize the first letter of each name
  const capitalizeFirstLetter = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Validate phone number: must be 10 digits and contain no letters
  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  // Validate email: must contain "@" symbol
  const isValidEmail = (email) => {
    return email.includes("@");
  };

  // Handle edit button click
  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    let valid = true;
  
    // Validation logic for email and phone number
    if (!isValidEmail(formData.email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }
  
    if (!isValidPhoneNumber(formData.phoneNumber)) {
      setPhoneError("Please enter a valid 10-digit phone number.");
      valid = false;
    } else {
      setPhoneError("");
    }
  
    if (valid) {
      try {
        // Send the update request to the `edit_user_info` endpoint
        const response = await axios.patch(
          `http://localhost:8000/api/users/edit/`, // Replace with your actual URL
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phonenumber: formData.phoneNumber,
            address: formData.shippingAddress,
            gender: formData.gender,
          },
          {
            withCredentials: true, // Ensure cookies are sent with the request if necessary
          }
        );
        
        console.log("User info updated:", response.data);
        setIsEditing(false); // Disable editing mode after saving
        setHasChanged(false); // Reset change tracking
      } catch (error) {
        console.error("Error updating user info:", error.response ? error.response.data : error.message);
      }
    }
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    // Reset form data to the original values (including gender)
    setFormData(initialFormData);
    setIsEditing(false);
    setHasChanged(false); // Reset change tracking
    setEmailError(""); // Clear email validation error
    setPhoneError(""); // Clear phone number validation error
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    if (name === "firstName" || name === "lastName") {
      // Capitalize the first letter of the name
      newValue = capitalizeFirstLetter(value);
    } else if (name === "email") {
      // Convert email to lowercase
      newValue = value.toLowerCase();
    } else if (name === "phoneNumber") {
      // Remove any non-digit characters from the phone number
      newValue = value.replace(/\D/g, ""); // Keep only digits
    }

    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
    setHasChanged(true); // Mark that a change has been made
  };

  // Handle gender change from the dropdown
  const handleGenderChange = (e) => {
    setFormData((prevData) => ({ ...prevData, gender: e.target.value }));
    setHasChanged(true); // Mark that a change has been made
  };

  // Handle admin checkbox toggle
  const handleAdminChange = (e) => {
    const { checked } = e.target;
    setFormData((prevData) => ({ ...prevData, isAdmin: checked }));
    setHasChanged(true);
  };

  // Determine avatar image based on gender
  const getAvatarImage = () => {
    if (formData.gender === "female") {
      return "./female.png";
    } else if (formData.gender === "male") {
      return "./male.png";
    }
  };

  return (
    <Box className="profile-info-container">
      <Box className="left-side">
        <Avatar
          src={getAvatarImage()}
          alt="User Avatar"
          sx={{
            width: { xs: 150, sm: 200, md: 300 },
            height: { xs: 150, sm: 200, md: 300 },
            borderRadius: "50%",
            marginBottom: "8px",
          }}
        >
          JD
        </Avatar>
        <Box sx={{ textAlign: "center", marginTop: "8px" }}>
          <div style={{ fontSize: "30px", fontWeight: "bold" }}>
            {formData.firstName} {formData.lastName}
          </div>
        </Box>
        <Box sx={{ textAlign: "center", marginTop: "16px" }}>
          {/* Add "Change Password" link below Cart */}
          <Link
            href="/resetpassword"
            underline="none"
            sx={{
              fontSize: "14px",
              color: "#001f3f",
              fontWeight: "bold",
              cursor: "pointer",
              textDecoration: "none", // No underline on hover
              "&:hover": {
                textDecoration: "none", // Ensure no underline on hover
              },
            }}
          >
            Change Password
          </Link>
        </Box>
        <Tabs
          orientation="vertical"
          value={false}
          onChange={handleTabChange}
          className="profile-tabs"
          TabIndicatorProps={{ style: { display: "none" } }}
        >
          <Tab
            icon={<ListAltIcon />}
            iconPosition="start"
            label="Orders"
            className="tab-button"
          />
          <Tab
            icon={<ShoppingCartIcon />}
            iconPosition="start"
            label="Cart"
            className="tab-button"
          />
        </Tabs>
      </Box>
      <Box className="right-side">
        <Box className="profile-details">
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing} // Enable when editing
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            fullWidth
            margin="normal"
            disabled // Username is not editable
          />
          <TextField
            label="Password"
            name="password"
            value={formData.password}
            fullWidth
            margin="normal"
            disabled // Password field is always uneditable
          />
          <TextField
            label="Account Created"
            name="accountCreated"
            value={formData.accountCreated}
            fullWidth
            margin="normal"
            disabled
          />
          <TextField
            label="Shipping Address"
            name="shippingAddress"
            value={formData.shippingAddress}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
            error={!!phoneError} // Show error if phone number validation fails
            helperText={phoneError} // Show error message
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
            error={!!emailError} // Show error if email validation fails
            helperText={emailError} // Show error message
          />

          {/* Gender Dropdown Field */}
          <FormControl fullWidth margin="normal" disabled={!isEditing}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={formData.gender}
              onChange={handleGenderChange}
              label="Gender"
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Admin checkbox - only shown if the logged-in user is an admin */}
        {isAdmin && (
          <Box sx={{ marginBottom: "16px" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.isAdmin}
                  onChange={handleAdminChange}
                  color="primary"
                />
              }
              label="Make admin"
            />
          </Box>
        )}

        {/* Buttons */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
        >
          {!isEditing ? (
            <CustomButton text="Edit Information" onClick={handleEditClick} />
          ) : (
            <>
              {hasChanged && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveClick}
                  sx={{ marginRight: "10px" }}
                >
                  Save
                </Button>
              )}
              <Button
                variant="outlined"
                sx={{
                  color: "#001f3f", // Navy blue color
                  borderColor: "#001f3f", // Navy blue border
                }}
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileInfo;
