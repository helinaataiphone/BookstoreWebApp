import React, { useRef } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { Link } from "react-router-dom"; // Import Link for navigation
import "./ScrollableCategories.css"; // Add your styles

const ScrollableCategories = ({ categories }) => {
  const scrollRef = useRef(null); // Create a ref for the scrollable container

  // Function to handle scrolling
  const scroll = (direction) => {
    const { current } = scrollRef; // Access the current DOM element

    if (direction === "left") {
      current.scrollLeft = Math.max(current.scrollLeft - 300, 0); // Prevent scrolling before the first item
    } else {
      current.scrollLeft = Math.min(
        current.scrollLeft + 300,
        current.scrollWidth - current.clientWidth
      ); // Prevent scrolling past the last item
    }
  };

  return (
    <Box position="relative" display="flex" alignItems="center">
      {/* Left Arrow */}
      <IconButton
        onClick={() => scroll("left")}
        style={{ position: "absolute", left: 0, zIndex: 1 }}
      >
        <ArrowBackIosIcon />
      </IconButton>

      {/* Scrollable Container */}
      <Box
        ref={scrollRef} // Attach ref to the Box for scrolling
        className="scrollable-container"
      >
        {categories.map((category, index) => (
          <Link
            key={index}
            //if categories have an id
            // to={`/products/${category.id}`}
            to={`/products/${category.categoryid}`} // Adjust the path as needed
            style={{ textDecoration: "none", color: "inherit" }} // Remove underline and inherit color
          >
            <Box
              className="category-box"
              display="flex"
              flexDirection="column"
              alignItems="center"
              minWidth="200px" // Ensure there's a minWidth to prevent shrinking
              margin="0 10px" // Margin between items
            >
              <img
                src={'/tote.png'}
                alt={category.categoryname}
                style={{
                  width: "100%",
                  borderRadius: "12px",
                  height: "150px",
                  objectFit: "cover",
                }}
              />
              <h3>{category.categoryname}</h3>
            </Box>
          </Link>
        ))}
      </Box>

      {/* Right Arrow */}
      <IconButton
        onClick={() => scroll("right")}
        style={{ position: "absolute", right: 0, zIndex: 1 }}
      >
        <ArrowForwardIosIcon />
      </IconButton>
    </Box>
  );
};

export default ScrollableCategories;
