import React, { useState, useEffect } from "react";
import ItemCardBig from "../Components/ItemCardBig";
import NavBar from "../Components/NavBar";
import TextField from "@mui/material/TextField";
import { Box, Typography, Grid } from "@mui/material";
import "./AdminAddItems.css";
import { UserProvider } from "../Components/UserAdminContext";
import CustomButton from "../Components/CustomeButton";

const AdminAddItems = () => {
  const [items, setItems] = useState([]); // Initialize items state as an empty array

  const [newItem, setNewItem] = useState({
    id: "",
    images: [],
    title: "",
    description: "",
    price: "",
    stockNumber: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    // Check if all fields are filled
    const allFieldsFilled =
      newItem.images.length > 0 &&
      newItem.title &&
      newItem.description &&
      newItem.price &&
      newItem.stockNumber;

    setIsButtonDisabled(!allFieldsFilled);
  }, [newItem]);

  // Handle image upload (multiple images)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    const readers = files.map((file) => {
      const reader = new FileReader();
      return new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((images) => {
      setNewItem((prevItem) => ({ ...prevItem, images }));
    });
  };

  const handleAddItem = () => {
    setItems([...items, { ...newItem, id: items.length + 1 }]);
    setNewItem({
      id: "",
      images: [],
      title: "",
      description: "",
      price: "",
      stockNumber: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({ ...prevItem, [name]: value }));
  };

  return (
    <div>
      <UserProvider>
        <NavBar
          logoSrc="/St_Mary_COC_Logo_No_Background.png"
          title="St. Mary's Coptic Orthodox Church Bookstore"
        />
      </UserProvider>
      <Box className="header">
        <Typography variant="h4" component="h1">
          Add Items
        </Typography>
      </Box>

      <Box className="admin-form">
        {/* File Upload Input */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          style={{ marginBottom: "20px" }}
        />
        <TextField
          label="Title"
          name="title"
          value={newItem.title}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={newItem.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          multiline
          rows={4} // Text area for description
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={newItem.price}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Stock Number"
          name="stockNumber"
          type="number"
          value={newItem.stockNumber}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Box className="admin-actions">
          <CustomButton
            variant="contained"
            onClick={handleAddItem}
            text={"Add Item"}
            disabled={isButtonDisabled} // Disable button based on form validation
          />
        </Box>
      </Box>

      <Grid container spacing={3} style={{ marginTop: "20px" }}>
        {items
          .filter(
            (item) =>
              item.images.length > 0 &&
              item.title &&
              item.description &&
              item.price &&
              item.stockNumber
          ) // Only show items with all fields filled
          .map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <ItemCardBig
                image={item.images[0]} // Show the first image
                title={item.title}
                description={item.description}
                price={item.price}
                stockNumber={item.stockNumber}
                isCart={false}
              />
            </Grid>
          ))}
      </Grid>
    </div>
  );
};

export default AdminAddItems;
