import NavBar from "../Components/NavBar";
import { UserProvider } from "../Components/UserAdminContext";
import React, { useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Components/Footer";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import "./Login.css"; // Add custom styles here
import { AuthContext } from '../AuthContext';
import axios from 'axios'; // Ensure Axios is imported



const Login = () => {
  const [username, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { isAuthenticated, checkAuthentication } = useContext(AuthContext);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    // If user is already authenticated, redirect to home
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);


  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login/', {
        username: username, // Ensure these match the expected keys in your Django view
        password: password
      }, {
        withCredentials: true // Ensure session cookies are handled
      });
      console.log("Login succesminasful", response.data);
      checkAuthentication();
      navigate("/");
      // Handle further actions after successful login like redirecting the user or storing the login token
    } catch (error) {
      console.error("Login failed:", error.response ? error.response.data : "Server error");
      // Handle errors (like showing a notification to the user)
    }
  };


  return (
    <div className="background">
      <UserProvider>
        <NavBar
          logoSrc="/St_Mary_COC_Logo_No_Background.png"
          title="St. Mary's Coptic Orthodox Church Bookstore"
        />
      </UserProvider>
      <div className="login-background">
        <div className="login-container">
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Email Address"
                variant="outlined"
                type="username"
                fullWidth
                required
                value={username}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    color="primary"
                  />
                }
                label="Remember me"
              />
            </Box>
            <Button type="submit" variant="contained" fullWidth sx={{ mb: 2 }}>
              Login
            </Button>
            <Box display="flex" justifyContent="space-between">
              <Link to="/forgetpassword" className="links">
                Forgot password?
              </Link>
              <Link to="/signup" className="links">
                Don’t have an account? Sign Up
              </Link>
            </Box>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
