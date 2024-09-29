import React, { useState, useEffect } from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios"; // Import Axios
import { useNavigate } from "react-router-dom";  // Import useNavigate for navigation

const StyledList = styled(List)({
  width: "100%",
  maxWidth: 360,
  backgroundColor: "#ffffff",
});

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "isActive",
})(({ isActive }) => ({
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
  ...(isActive && {
    backgroundColor: "#ececec",
  }),
}));

const CategorySidebar = () => {
  const [categories, setCategories] = useState([]);  // State to hold categories
  const [activeCategory, setActiveCategory] = useState("All Items");
  const navigate = useNavigate();  

  // Fetch categories from the backend API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/categories/');  // Adjust the URL as per your API
        let fetchedCategories = response.data;
        
        // Add a special category that has no id
        const allProductsCategory = {
          categoryname: "All Products",
          categoryid: null  // No ID for this category
        };

        // Prepend the special category to the list of categories
        fetchedCategories = [allProductsCategory, ...fetchedCategories];
        
        setCategories(fetchedCategories);  // Update state with the modified categories
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);  // Fetch categories when the component mounts

  const handleCategoryClick = (category) => {
    setActiveCategory(category.categoryname);  // Set the active category by its name
    
    // Check if the category has an ID, if not, handle it as "All Products"
    if (category.categoryid) {
      navigate(`/products/${category.categoryid}`);  // Navigate to /products/id if there is a category ID
    } else {
      navigate(`/products`);  // Navigate to /products for "All Products"
    }
  };
  
  return (
    <StyledList component="nav">
      {categories.map((category, index) => (
        <StyledListItem
          key={category.categoryid}  // Use CategoryID as the key
          isActive={category.categoryname === activeCategory}
          onClick={() => handleCategoryClick(category)}
        >
          <ListItemText primary={category.categoryname} />
        </StyledListItem>
      ))}
    </StyledList>
  );
};

export default CategorySidebar;
