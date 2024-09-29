import React from "react";
import { Card, CardMedia, CardContent, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const ProductCard = ({ imageUrl, title, price, isOutOfStock }) => {
  return (
    <Link to="/product-detail" style={{ textDecoration: "none" }}>
      <Card
        sx={{
          maxWidth: 345,
          m: "auto",
          mb: 2,
          boxShadow: 3,
          "&:hover": { boxShadow: 6 },
        }}
      >
        <CardMedia component="img" height="140" image={imageUrl} alt={title} />
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            color="text.primary"
          >
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isOutOfStock ? "Out of stock" : `$${price}`}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
