import React, { useState } from "react";
import "./AddProductDialog.css"; // Import the CSS fi
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  Grid as GridDialog,
  FormControlLabel,
  Typography,
} from "@mui/material";

// Utility function to capitalize the first letter of each word
const capitalizeWords = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const AddProductDialog = ({
  open,
  handleClose,
  handleSave,
  categories,
  handleAddNewCategory,
  //   handleDeleteCategories, // Add this prop to handle category deletion
}) => {
  const [newProduct, setNewProduct] = useState({
    title: "",
    price: "$",
    image: "",
    quantity: "",
    isRequestable: false,
    categories: [],
    description: "",
    images: [],
  });

  const [selectedCategories, setSelectedCategories] = useState([]); // For selecting categories for the product
  //const [categoriesToDelete, setCategoriesToDelete] = useState([]); // For selecting categories to delete
  const [newCategoryDialogOpen, setNewCategoryDialogOpen] = useState(false); // For controlling the category dialog
  const [newCategory, setNewCategory] = useState(""); // Category name input
  const [newCategoryImage, setNewCategoryImage] = useState(null); // Category image

  const [errors, setErrors] = useState({
    title: false,
    price: false,
    quantity: false,
    description: false,
    categories: false,
  });

  // Handle changes in product fields
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "title") {
      formattedValue = capitalizeWords(value);
    } else if (name === "price") {
      formattedValue = value.startsWith("$") ? value : `$${value}`;
    } else if (name === "quantity") {
      formattedValue = value.replace(/[^0-9]/g, ""); // Only numbers allowed
    }

    setNewProduct((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleCategoryChangeAddProduct = (event) => {
    const value = event.target.value;
    setSelectedCategories(typeof value === 'string' ? value.split(',') : value);
  };


  axios.defaults.withCredentials = true;  // Enable axios to send cookies with every request

  const handleSaveNewProduct = async () => {
    // Validate input fields
    const categoryError = selectedCategories.length === 0;
    setErrors({
      title: !newProduct.title,
      price: !newProduct.price || newProduct.price === "$",
      quantity: !newProduct.quantity,
      description: !newProduct.description,
      categories: categoryError,
    });
  
    if (!newProduct.title || !newProduct.price || !newProduct.quantity || !newProduct.description || categoryError) {
      console.log("Error: Missing required fields.");
      return; // Stop the function if there are errors
    }
  
    // Prepare form data for adding the product
    const formData = new FormData();
    formData.append('productname', newProduct.title);
    formData.append('productprice', newProduct.price.replace('$', ''));
    formData.append('availablequantity', newProduct.quantity);
    formData.append('productdescription', newProduct.description);
    formData.append('isrequestable', newProduct.isRequestable);

    // Add image data here if necessary
    // newProduct.images.forEach(image => formData.append('images', image));
  
    try {
      // First, add the product
      const productResponse = await axios.post('http://localhost:8000/api/products/add/', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
      });
  
      const productId = productResponse.data.product_id; // Get the product ID from the response
  
      console.log('Product added successfully:', productId);
  
      console.log("Selected Categories:", selectedCategories); // Debug to check if data is correct

      const categoryData = {
        categories: selectedCategories, // Directly use the array of strings
      };
      console.log("Selected Categories2:", categoryData); // Debug to check if data is correct
      const categoryResponse = await axios.post(`http://localhost:8000/api/products/${productId}/add/`, categoryData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
      });
      console.log('Categories associated successfully:', categoryResponse.data);
      
      // Reset the form after both requests succeed
      resetForm();
    } catch (error) {
      console.error('Error:', error.response);
    }
  };
  
  const resetForm = () => {
    setNewProduct({
      title: "",
      price: "$",
      image: "",
      quantity: "",
      isRequestable: false,
      categories: [],
      description: "",
      images: [],
    });
    setSelectedCategories([]);
  };
  
  // Handle image uploads for product
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file)); // Convert the uploaded files to URLs

    setNewProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages], // Add new images to the existing array of images
    }));
  };

  // Open the "Add Category" dialog
  const openAddCategoryDialog = () => {
    setNewCategoryDialogOpen(true);
  };

  // Close the "Add Category" dialog
  const closeAddCategoryDialog = () => {
    setNewCategoryDialogOpen(false);
    setNewCategory("");
    setNewCategoryImage(null); // Reset fields
  };

  // Automatically capitalize the category name as the user types
  const handleNewCategoryChange = (e) => {
    setNewCategory(capitalizeWords(e.target.value)); // Automatically capitalize the first letter of each word
  };

  // Handle the new category image upload
  const handleNewCategoryImageUpload = (e) => {
    const file = e.target.files[0];
    setNewCategoryImage(URL.createObjectURL(file)); // Display the selected image
  };

  // Utility function to get CSRF token from cookies
const getCsrfToken = () => {
  const cookies = document.cookie.split(';');
  const csrfToken = cookies.find(cookie => cookie.trim().startsWith('csrftoken='));
  return csrfToken ? decodeURIComponent(csrfToken.split('=')[1]) : null;
};

const handleAddCategory = async () => {
  if (newCategory.trim()) {
    const formData = new FormData();
    formData.append("categoryname", newCategory.trim());
    if (newCategoryImage) {
      formData.append("imageurl", newCategoryImage);
    }

    try {
      // Configure request to include credentials and CSRF token
      const response = await axios.post('http://localhost:8000/api/add-categories/', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': getCsrfToken(), // Ensure the CSRF token is included in the headers
        },
      });

      // Handle response and update UI
      handleAddNewCategory({
        name: newCategory.trim(),
        image: newCategoryImage,
      });
      setSelectedCategories(prevCategories => [...prevCategories, newCategory.trim()]);
      closeAddCategoryDialog(); // Reset and close the dialog
      setNewCategory("");
      setNewCategoryImage(null);
    } catch (error) {
      console.error('Error adding category:', error.response.data);
    }
  }
};
  

  // Handle selecting categories to delete
  //   const handleCategoryDeleteChange = (event) => {
  //     setCategoriesToDelete(event.target.value);
  //   };

  // Handle deleting selected categories
  //   const handleDeleteSelectedCategories = () => {
  //     handleDeleteCategories(categoriesToDelete); // Pass the selected categories to parent for deletion
  //     setCategoriesToDelete([]); // Reset the selected categories for deletion
  //   };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          {/* Select categories for the product */}
          <FormControl
            fullWidth
            margin="normal"
            required
            error={errors.categories}
          >
            <InputLabel id="category-select-label">Categories</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              multiple
              value={selectedCategories}
              onChange={handleCategoryChangeAddProduct}
              renderValue={(selected) => selected.join(", ")}
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryname} value={category.categoryname}>
                  <Checkbox
                    checked={selectedCategories.indexOf(category.categoryname) > -1}
                  />
                  <ListItemText primary={category.categoryname} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Add a new category */}
          <GridDialog container spacing={2}>
            <GridDialog item xs={12}>
              <Button
                onClick={openAddCategoryDialog}
                variant="contained"
                sx={{ mt: 2 }}
              >
                + Add Category
              </Button>
            </GridDialog>
          </GridDialog>


          {/* Other fields for the new product */}
          <GridDialog container spacing={2}>
            <GridDialog item xs={12}>
              <TextField
                label="Product Name"
                name="title"
                value={newProduct.title}
                onChange={handleNewProductChange}
                fullWidth
                margin="normal"
                required
                error={errors.title}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '1.5rem', // Increase font size
                    height: '60px', // Adjust height of the text box
                  },
                  
                }}
              />
            </GridDialog>

            <GridDialog item xs={12}>
              <TextField
                label="Product Description"
                name="description"
                value={newProduct.description}
                onChange={handleNewProductChange}
                fullWidth
                multiline
                rows={3}
                margin="normal"
                required
                error={errors.description}
              />
            </GridDialog>

            <GridDialog item xs={12}>
              <TextField
                label="Price"
                name="price"
                value={newProduct.price}
                onChange={handleNewProductChange}
                fullWidth
                margin="normal"
                required
                error={errors.price}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '1.2rem', // Increase font size
                    height: '56px', // Control height of the input
                  },
                  '& .MuiInputLabel-root': {
                    fontSize: '1.2rem', // Increase label font size
                  },
                }}
              />
            </GridDialog>

            <GridDialog item xs={12}>
              <TextField
                label="Stock Quantity"
                name="quantity"
                value={newProduct.quantity}
                onChange={handleNewProductChange}
                fullWidth
                margin="normal"
                inputProps={{ type: "number", min: "0" }}
                required
                error={errors.quantity}
              />
            </GridDialog>

            {/* Product Images */}
            <GridDialog item xs={12}>
              <Typography variant="h6">Product Images</Typography>
              <GridDialog container spacing={2}>
                {newProduct.images?.map((img, index) => (
                  <GridDialog item xs={4} key={index}>
                    <img
                      src={img}
                      alt={`Product Image ${index + 1}`}
                      style={{ width: "100%", borderRadius: "4px" }}
                    />
                  </GridDialog>
                ))}
              </GridDialog>
              <Button variant="contained" component="label" sx={{ mt: 2 }}>
                Upload Images
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageUpload}
                />
              </Button>
            </GridDialog>

            {/* Requestable Checkbox */}
            <GridDialog item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={newProduct.isRequestable}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        isRequestable: e.target.checked,
                      }))
                    }
                  />
                }
                label="Requestable"
              />
            </GridDialog>
          </GridDialog>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSaveNewProduct} variant="contained">
            Add Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={newCategoryDialogOpen} onClose={closeAddCategoryDialog}>
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            value={newCategory}
            onChange={handleNewCategoryChange}
            fullWidth
            margin="normal"
            sx={{
              '& .MuiInputBase-root': {
                fontSize: '1.5rem', // Increase font size
                height: '60px',     // Adjust height of the text box
              },
             
            }}
          />
        
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Category Image
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleNewCategoryImageUpload}
            />
          </Button>
          {newCategoryImage && (
            <img
              src={newCategoryImage}
              alt="Category"
              style={{ width: "100%", height: "auto", marginTop: "10px" }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAddCategoryDialog}>Cancel</Button>
          <Button onClick={handleAddCategory} variant="contained">
            Add Category
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddProductDialog;
