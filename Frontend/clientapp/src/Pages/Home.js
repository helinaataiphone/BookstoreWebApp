import React, { useEffect, useState } from "react";
import NavBar from "../Components/NavBar";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import "./Home.css";
import { UserProvider } from "../Components/UserAdminContext";
import Footer from "../Components/Footer";

import Category from "../Components/Category";
import axios from "axios";
import ScrollableCategories from "../Components/ScrollableCategories";
import { Link } from "react-router-dom";


const Home = () => {

  const [categories, setCategories] = useState([]);

  // Fetch categories from the backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories/'); // Update this URL based on your backend endpoint
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  
  return (
    <div style={{ backgroundColor: "#f4f4f4" }}>
      <UserProvider>
        <NavBar
          logoSrc="/St_Mary_COC_Logo_No_Background.png"
          title="St. Mary's Coptic Orthodox Church Bookstore"
        />
      </UserProvider>

      <Container className="container">
        {/* Hero Section */}
        <Box
          className="hero-banner-modern"
          sx={{
            backgroundColor: "#00203FFF", // Navy Blue
            backgroundImage: `linear-gradient(to bottom right, #00203FFF, #5F6368)`, // Gradient with grey and navy blue
            color: "#fff",
            height: "40vh", // Smaller height for a more compact design
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "10px", // Less padding for a compact look
            borderRadius: "10px",
            position: "relative", // Allows for angled sections and other creative layouts
            overflow: "hidden",
          }}
        >
          {/* Decorative Elements */}
          <Box
            sx={{
              position: "absolute",
              width: "120%",
              height: "100px",
              backgroundColor: "#5F6368", // Grey to match the theme
              top: "0",
              left: "-10%",
              transform: "rotate(-3deg)",
              zIndex: 0,
            }}
          ></Box>
          <Box
            sx={{
              position: "absolute",
              width: "120%",
              height: "100px",
              backgroundColor: "#00203FFF", // Navy Blue
              bottom: "-10px",
              left: "-10%",
              transform: "rotate(2deg)",
              zIndex: 0,
            }}
          ></Box>

          <Box sx={{ position: "relative", zIndex: 1 }}>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)", // Smaller font size
                fontWeight: "700",
                color: "#FFFFFF", // White text
                letterSpacing: "2px",
                textTransform: "uppercase",
                marginBottom: "20px", // Less margin to keep it compact
                textShadow: "1px 1px 10px rgba(0,0,0,0.2)", // Subtle text shadow for depth
              }}
            >
              Welcome to St. Mary's Bookstore
            </h1>
            <p
              style={{
                fontSize: "clamp(1rem, 2vw, 1.5rem)", // Smaller description text
                color: "#E0E0E0", // Light grey for softer contrast
                marginBottom: "20px",
                maxWidth: "900px",
                lineHeight: "1.4",
                textAlign: "center", // Ensure the text is centered
              }}
            >
              Your source for spiritual books and gifts for every occasion.
            </p>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              size="medium"
              className="cta-button"
              sx={{
                backgroundColor: "#5F6368", // Grey button to match the theme
                color: "#FFFFFF",
                padding: "10px 30px", // Smaller button for the compact design
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: "30px",
                boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.1)", // Less shadow for smaller button
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#E0E0E0", // Lighter grey on hover
                  color: "#00203FFF", // Navy text on hover
                  transform: "scale(1.05)", // Subtle hover animation
                },
              }}
            >
              Shop Now
            </Button>
          </Box>
        </Box>

        <div className="homeheader" style={{ marginTop: "30px" }}>
          Categories
        </div>
        <ScrollableCategories categories={categories} />
      </Container>
      <Footer />
    </div>
  );
};

export default Home;
