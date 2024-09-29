import React from "react";
import { Box, Typography } from "@mui/material";
import "./ProductDetails.css";
import CustomButton from "../Components/CustomeButton";

const ProductDetails = ({ product, onAddToCart }) => {
  return (
    <Box className="product-details">
      <Box className="product-image-container">
        <img
          src={product.image}
          alt={product.name}
          className="product-image product-image-portrait"
        />
      </Box>
      <Box className="product-info">
        <Typography variant="h4" component="h2" className="product-title">
          {product.name}
        </Typography>
        <Typography variant="body1" className="product-description">
          {product.description}
        </Typography>
        <Typography variant="h6" className="product-price">
          Price: ${product.price}
        </Typography>
        <CustomButton
          variant="contained"
          color="primary"
          onClick={onAddToCart}
          text={"Add to Cart"}
        />
      </Box>
    </Box>
  );
};

export default ProductDetails;
