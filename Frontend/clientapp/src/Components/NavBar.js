import React, { useState, useRef, useEffect, useContext  } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  MenuItem,
  Menu,
  Box,
  Button,
  Drawer,
  InputBase,
} from "@mui/material";
import {
  Search as SearchIcon,
  AccountCircle,
  ShoppingCart,
  Logout,
  Login,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AuthContext } from "../AuthContext";
import axios from 'axios';

const Navbar = ({ children }) => {
  const theme = useTheme();
  const below870px = useMediaQuery("(max-width:870px)");

  // Simulate authenticated user ID and admin status
  const { isAuthenticated, isAdmin, userId } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false); // Manage search bar visibility
  const [searchTerm, setSearchTerm] = useState(""); // Manage search term

  const searchInputRef = useRef(null); // Ref to search input

  // Simulating an authenticated user ID for profile link (replace with actual authentication logic)
// Example user ID

  // Focus the input when search is open
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus(); // Focus on input when search opens
    }
  }, [searchOpen]);

  // Handle account menu
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    setDrawerOpen(open);
  };

  const getCsrfToken = () => {
    const cookies = document.cookie.split(';');
    const csrfToken = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
    return csrfToken ? decodeURIComponent(csrfToken.split('=')[1]) : null;
  };
  const handleLogout = async () => {
    try {
        // Get CSRF token from cookies
        const csrfToken = getCsrfToken();

        // Axios post request to logout endpoint
        const response = await axios.post('http://localhost:8000/api/logout/', {}, {
            headers: {
                'X-CSRFToken': csrfToken, // Include CSRF token as header
            },
            withCredentials: true  // Necessary to handle the CSRF token and session cookie
        });

        console.log(response.data.message); // 'Logout successful'

        // Optionally, clear local authentication state
        // Assuming you have a context or state management solution for auth:
        // authContext.setIsAuthenticated(false);
        // authContext.setIsAdmin(false);
        
        // Redirect or update the UI
        window.location = '/'; // Redirect to home or login page after logout
    } catch (error) {
        console.error('Logout failed:', error.response || error);
    }
};

  const toggleSearchBar = () => {
    setSearchOpen((prev) => !prev); // Toggle search bar visibility
    setSearchTerm(""); // Clear search term when closing
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "#00203FFF",
          padding: below870px ? "5px 10px" : "10px 20px",
          boxShadow: "none",
          borderBottom: "2px solid #ADEFD1FF",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", alignItems: "center" }}>
          {/* If search is not open, show the regular navbar */}
          {!searchOpen ? (
            <>
              {/* Hamburger menu for mobile and below 870px */}
              {below870px && (
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{ display: "block" }}
                >
                  <MenuIcon sx={{ fontSize: "30px" }} />
                </IconButton>
              )}

              {/* Logo and Title */}
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  color: "white",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "bold",
                    fontSize: "clamp(0.8rem, 2.5vw, 1.5rem)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <img
                    src="/St_Mary_Coc_Logo_No_Background.png"
                    alt="Logo"
                    style={{
                      height: "clamp(30px, 5vw, 60px)",
                      marginRight: "10px",
                      borderRadius: "50%",
                    }}
                  />
                  St.Mary's Bookstore
                </Typography>
              </Box>

              {/* Links for larger screens (hidden below 870px) */}
              {!below870px && (
                <Box
                  sx={{
                    display: "flex",
                    gap: "20px",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  <Button
                    component={Link}
                    to="/"
                    sx={{
                      fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
                      fontWeight: 600,
                      color: "white",
                      textTransform: "none",
                      "&:hover": {
                        transition: "0.3s ease",
                      },
                    }}
                  >
                    Home
                  </Button>

                  {/* Admin Links */}
                  {isAdmin && (
                    <>
                      <Button
                        component={Link}
                        to="/products"
                        sx={{
                          fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
                          fontWeight: 600,
                          color: "white",
                          textTransform: "none",
                          "&:hover": {
                            transition: "0.3s ease",
                          },
                        }}
                      >
                        Products
                      </Button>
                      <Button
                        component={Link}
                        to="/manageorders"
                        sx={{
                          fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
                          fontWeight: 600,
                          color: "white",
                          textTransform: "none",
                          "&:hover": {
                            transition: "0.3s ease",
                          },
                        }}
                      >
                        Orders
                      </Button>
                      <Button
                        component={Link}
                        to="/manageusers"
                        sx={{
                          fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
                          fontWeight: 600,
                          color: "white",
                          textTransform: "none",
                          "&:hover": {
                            transition: "0.3s ease",
                          },
                        }}
                      >
                        Users
                      </Button>
                    </>
                  )}

                  {!isAdmin && (
                    <>
                      <Button
                        component={Link}
                        to="https://www.stmaryseattle.org/OurChurch.aspx"
                        sx={{
                          fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
                          fontWeight: 600,
                          color: "white",
                          textTransform: "none",
                          "&:hover": {
                            transition: "0.3s ease",
                          },
                        }}
                      >
                        St.Mary's COC Website
                      </Button>
                      <Button
                        component={Link}
                        to="/contact"
                        sx={{
                          fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
                          fontWeight: 600,
                          color: "white",
                          textTransform: "none",
                          "&:hover": {
                            transition: "0.3s ease",
                          },
                        }}
                      >
                        Contact Us
                      </Button>
                    </>
                  )}
                </Box>
              )}

              {/* Search icon */}
              <IconButton color="inherit" onClick={toggleSearchBar}>
                <SearchIcon sx={{ fontSize: "30px" }} />
              </IconButton>

              {/* Account and Cart Icons */}
              {!below870px && (
                <>
                  <IconButton
                    edge="end"
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                    sx={{ marginLeft: "10px" }}
                  >
                    <AccountCircle sx={{ color: "white", fontSize: "30px" }} />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    PaperProps={{
                      style: {
                        backgroundColor: "#00203FFF",
                        color: "#fff",
                      },
                    }}
                  >
                    {!isAuthenticated ? (
                      <>
                        <MenuItem onClick={handleClose}>
                          <Login />
                          <Link
                            to="/login"
                            style={{ textDecoration: "none", color: "white" }}
                          >
                            Login
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                          <Link
                            to="/signup"
                            style={{ textDecoration: "none", color: "white" }}
                          >
                            Signup
                          </Link>
                        </MenuItem>
                      </>
                    ) : (
                      <>
                        <MenuItem onClick={handleClose}>
                          <Link
                            to={`/profile`} // Use userId here
                            style={{ textDecoration: "none", color: "white" }}
                          >
                            Profile
                          </Link>
                        </MenuItem>
                        {!isAdmin && ( // Hide orders if the user is an admin
                          <MenuItem onClick={handleClose}>
                            <Link
                              to="/manageorders"
                              style={{ textDecoration: "none", color: "white" }}
                            >
                              Orders
                            </Link>
                          </MenuItem>
                        )}
                        <MenuItem onClick={handleClose}>
                          <Link
                            to="/cart"
                            style={{ textDecoration: "none", color: "white" }}
                          >
                            <ShoppingCart /> Cart
                          </Link>
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>
                          <Logout /> Logout
                        </MenuItem>
                      </>
                    )}
                  </Menu>
                </>
              )}
            </>
          ) : (
            // When search is open, show the search bar instead of title and links
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                gap: 1,
              }}
            >
              <InputBase
                placeholder="Search…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                inputRef={searchInputRef} // Attach ref to search input
                sx={{
                  flexGrow: 1,
                  backgroundColor: "transparent", // Transparent background
                  color: "white", // White text color
                  border: "none", // Remove border
                  padding: "5px 10px",
                  borderRadius: "5px",
                  outline: "none", // Remove outline
                  "&:focus": {
                    outline: "none", // Ensure no outline on focus
                  },
                  "& input": {
                    "&:focus": {
                      outline: "none", // Ensure no outline on the actual input
                    },
                  },
                }}
                inputProps={{ "aria-label": "search" }}
              />
              {searchTerm && (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#00203FFF", // Match navbar background
                    color: "white", // White text color for button
                    "&:hover": {
                      backgroundColor: "#00203FFF", // Ensure no hover effect
                    },
                  }}
                >
                  Search
                </Button>
              )}
              <IconButton onClick={toggleSearchBar} sx={{ color: "white" }}>
                <CloseIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Add padding to compensate for the fixed navbar height */}
      <Box sx={{ paddingTop: "70px" }}>{children}</Box>

      {/* Drawer for mobile view */}
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{
            width: 250,
            backgroundColor: "#00203FFF",
            height: "100%",
            color: "#fff",
            padding: "10px",
            transition: "transform 0.3s ease-in-out",
          }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <MenuItem>
            <Link to="/" style={{ color: "white", textDecoration: "none" }}>
              Home
            </Link>
          </MenuItem>

          {/* Admin Links in Drawer */}
          {isAdmin && (
            <>
              <MenuItem>
                <Link
                  to="/products"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Products
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/manageorders"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Orders
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/manageusers"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Users
                </Link>
              </MenuItem>
            </>
          )}

          {/* Non-admin links */}
          {!isAdmin && (
            <>
              <MenuItem>
                <Link
                  to="https://www.stmaryseattle.org/OurChurch.aspx"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  St.Mary's COC Website
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/contact"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Contact Us
                </Link>
              </MenuItem>
            </>
          )}

          {!isAuthenticated ? (
            <>
              <MenuItem>
                <Link
                  to="/login"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Login
                </Link>
              </MenuItem>
              <MenuItem>
                <Link
                  to="/signup"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Signup
                </Link>
              </MenuItem>
            </>
          ) : (
            <>
              <MenuItem>
                <Link
                  to={`/profile/${userId}`} // Use userId here in the drawer
                  style={{ color: "white", textDecoration: "none" }}
                >
                  Profile
                </Link>
              </MenuItem>
              {!isAdmin && ( // Hide orders for admins
                <MenuItem>
                  <Link
                    to="/manageorders"
                    style={{ color: "white", textDecoration: "none" }}
                  >
                    Orders
                  </Link>
                </MenuItem>
              )}
              <MenuItem>
                <Link
                  to="/cart"
                  style={{ color: "white", textDecoration: "none" }}
                >
                  <ShoppingCart /> Cart
                </Link>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout /> Logout
              </MenuItem>
            </>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
