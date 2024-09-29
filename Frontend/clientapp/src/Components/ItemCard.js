import React, { useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import ListItemText from "@mui/material/ListItemText";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import "./ItemCard.css";
import axios from "axios";

export default function ItemCard({
  id,
  title,
  price,
  image,
  quantity,
  isRequestable,
  isAdmin,
}) {
  const navigate = useNavigate();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editedProduct, setEditedProduct] = useState({
    title,
    price,
    image,
    quantity,
    isRequestable,
    categories: [],
    description: "",
    images: Array.isArray(image) ? image : [], // Initialize images as an array
  });

  const getCsrfToken = () => {
    const csrfCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] : null;
  };

  // Prepopulate with some dummy categories
  const [categories, setCategories] = useState([
    "Books",
    "Apparel",
    "Jewelry",
    "Accessories",
    "Church Supplies",
    "Food Products",
    "Crosses",
    "Children",
  ]);

  const [errors, setErrors] = useState({
    title: "",
    price: "",
    quantity: "",
    description: "",
    categories: "",
  });

  const outOfStock = quantity === 0 && !isRequestable;
  const requestable = quantity === 0 && isRequestable;

  // Handle card click to navigate to product info page
  const handleCardClick = () => {
    if (!outOfStock) {
      navigate(`/productinfo/${id}`);
    }
  };

  // Handle menu open/close
  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  // Handle opening the edit dialog
  const handleEditClick = () => {
    setIsDialogOpen(true);
    handleMenuClose();
  };

  // Handle closing the edit dialog
  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  // Handle closing the add category dialog
  const handleAddCategoryDialogClose = () => {
    setIsAddCategoryDialogOpen(false);
    setNewCategory("");
  };

  // Capitalize the first letter of every word in a string
  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Capitalize the first letter of every sentence in the description
  const capitalizeSentences = (description) => {
    return description.replace(/(?:^|[.!?]\s+)([a-z])/g, (c) =>
      c.toUpperCase()
    );
  };

  // Handle input change in the dialog with constraints
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === "title") {
      formattedValue = capitalizeWords(value); // Capitalize all words in the title
    } else if (name === "description") {
      formattedValue = capitalizeSentences(value); // Capitalize each sentence in the description
    } else if (name === "price") {
      formattedValue = value.replace(/[^0-9.]/g, ""); // Remove non-numeric characters except for period (.)
      if (!formattedValue.startsWith("$")) {
        formattedValue = `$${formattedValue}`; // Add $ sign at the start
      }
    } else if (name === "quantity") {
      formattedValue = value.replace(/\D/g, ""); // Remove non-digits to ensure only whole numbers
      if (parseInt(formattedValue) < 0) {
        formattedValue = "0"; // Ensure quantity is not negative
      }
    }

    setEditedProduct((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "", // Clear error message for this field on change
    }));
  };

  // Handle category selection change
  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setEditedProduct((prev) => ({
      ...prev,
      categories: typeof value === "string" ? value.split(",") : value,
    }));

    setErrors((prev) => ({
      ...prev,
      categories:
        value.length === 0 ? "At least one category is required." : "",
    }));
  };

  // Handle checkbox change for requestable status
  const handleRequestableChange = (event) => {
    setEditedProduct((prev) => ({
      ...prev,
      isRequestable: event.target.checked,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));

    setEditedProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));
  };

  // Handle save functionality
  const handleSave = () => {
    const newErrors = {
      title: editedProduct.title ? "" : "Product name is required.",
      price: editedProduct.price ? "" : "Price is required.",
      quantity: editedProduct.quantity ? "" : "Stock quantity is required.",
      description: editedProduct.description
        ? ""
        : "Product description is required.",
      categories:
        editedProduct.categories.length === 0
          ? "At least one category is required."
          : "",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err !== "");

    if (!hasError) {
      console.log("Saved product", editedProduct);
      setIsDialogOpen(false);
    }
  };

  // Handle adding new category (capitalize words in the new category)
  const handleAddNewCategory = () => {
    if (newCategory.trim()) {
      const formattedCategory = capitalizeWords(newCategory); // Capitalize each word
      setCategories([...categories, formattedCategory]);
      setEditedProduct((prev) => ({
        ...prev,
        categories: [...prev.categories, formattedCategory],
      }));
      handleAddCategoryDialogClose();
    }
  };

  return (
    <Card
      className={`card-hover ${outOfStock ? "out-of-stock" : ""}`}
      sx={{
        maxWidth: { xs: 300, sm: 345, md: 400 },
        position: "relative",
        height: "100%", // Fix the height of the card
      }}
    >
      <CardActionArea
        onClick={handleCardClick}
        disabled={outOfStock}
        sx={{ cursor: outOfStock ? "not-allowed" : "pointer",
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          }
        }}
      >
        <CardMedia
          component="img"
          sx={{ height: 200, objectFit: "cover" }}
          image={image}
          alt={title}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{
              fontSize: {
                xs: "1.1rem",
                sm: "1.3rem",
                md: "1.5rem",
                lg: "1.75rem",
              },
              fontWeight: 500,
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
                md: "1.1rem",
                lg: "1.2rem",
              },
              color: "text.secondary",
            }}
          >
            {price}
          </Typography>

          {outOfStock && (
            <Typography sx={{ color: "red", fontSize: "0.8rem", mt: 0.5 }}>
              Out of Stock
            </Typography>
          )}
          {!outOfStock && (
            <Typography
              sx={{ color: "transparent", fontSize: "0.8rem", mt: 0.5 }}
            >
              Empty
            </Typography>
          )}
          {requestable && (
            <Typography sx={{ color: "green", fontSize: "0.8rem", mt: 0.5 }}>
              Requestable
            </Typography>
          )}
        </CardContent>
      </CardActionArea>

      {/* Show three dots menu only if the user is an admin */}
      {isAdmin && (
        <>
          <IconButton
            aria-label="settings"
            onClick={handleMenuOpen}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEditClick}>Edit Product</MenuItem>
            <MenuItem
              onClick={() => {
                console.log("Initiating removal of product and its categories", id);

                // First, attempt to delete related product categories
                axios.delete(`http://localhost:8000/api/products/delete_related_categories/${id}/`, {
                  withCredentials: true,
                  headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCsrfToken(),  // Ensure CSRF token is correctly handled
                  }
                })
                .then(response => {
                  console.log('Related product categories deleted successfully:', response.data);

                  // If successful, proceed to delete the product
                  axios.delete(`http://localhost:8000/api/products/delete/${id}/`, {
                    withCredentials: true,
                    headers: {
                      'Content-Type': 'application/json',
                      'X-CSRFToken': getCsrfToken(),
                    }
                  })
                  .then(response => {
                    console.log('Product deleted successfully:', response.data);
                    // Optionally, update the UI to reflect the product deletion
                  })
                  .catch(error => {
                    console.error('Failed to delete product:', error.response ? error.response.data : 'Server error');
                  });

                })
                .catch(error => {
                  console.error('Failed to delete related product categories:', error.response ? error.response.data : 'Server error');
                });
              }}
            >
              Remove Product
            </MenuItem>

          </Menu>
        </>
      )}

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          {/* Categories */}
          <Grid item xs={12}>
            <FormControl
              fullWidth
              margin="normal"
              required
              error={!!errors.categories}
            >
              <InputLabel id="category-select-label">Categories</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                multiple
                value={editedProduct.categories}
                onChange={handleCategoryChange}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 48 * 4.5 + 8, // Show only 3 categories at once, then make it scrollable
                      width: 250,
                    },
                  },
                }}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    <Checkbox
                      checked={editedProduct.categories.indexOf(category) > -1}
                    />
                    <ListItemText primary={category} />
                  </MenuItem>
                ))}
              </Select>
              {errors.categories && (
                <Typography sx={{ color: "red", fontSize: "0.8rem", mt: 0.5 }}>
                  {errors.categories}
                </Typography>
              )}
              <Button
                variant="text"
                color="primary"
                onClick={() => setIsAddCategoryDialogOpen(true)}
              >
                + Add Category
              </Button>
            </FormControl>
          </Grid>
          <Grid container spacing={2}>
            {/* Product Name */}
            <Grid item xs={12}>
              <TextField
                label="Product Name"
                name="title"
                value={editedProduct.title}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={!!errors.title}
                helperText={errors.title}
              />
            </Grid>
            {/* Description */}
            <Grid item xs={12}>
              <TextField
                label="Product Description"
                name="description"
                value={editedProduct.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                margin="normal"
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            {/* Price */}
            <Grid item xs={12}>
              <TextField
                label="Price"
                name="price"
                value={editedProduct.price}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>
            {/* Stock Quantity */}
            <Grid item xs={12}>
              <TextField
                label="Stock Quantity"
                name="quantity"
                value={editedProduct.quantity}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                error={!!errors.quantity}
                helperText={errors.quantity}
              />
            </Grid>

            {/* Images */}
            <Grid item xs={12}>
              <Typography variant="h6">Product Images</Typography>
              <Grid container spacing={2}>
                {editedProduct.images?.map((img, index) => (
                  <Grid item xs={4} key={index}>
                    <img
                      src={img}
                      alt={`Product Image ${index + 1}`}
                      style={{ width: "100%", borderRadius: "4px" }}
                    />
                  </Grid>
                ))}
              </Grid>
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
            </Grid>
            {/* Requestable */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={editedProduct.isRequestable}
                    onChange={handleRequestableChange}
                  />
                }
                label="Requestable"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog
        open={isAddCategoryDialogOpen}
        onClose={handleAddCategoryDialogClose}
      >
        <DialogTitle>Add New Category</DialogTitle>
        <DialogContent style={{ padding: "16px" }}>
          <TextField
            label="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(capitalizeWords(e.target.value))}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddCategoryDialogClose}>Cancel</Button>
          <Button onClick={handleAddNewCategory} variant="contained">
            Add Category
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
