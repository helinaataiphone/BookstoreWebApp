import React from 'react';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import './ItemCardBig.css';
import { Link } from "react-router-dom";

const ItemCardBig = ({ image, title, price, quantity, onRemove, stockNumber, isCart }) => {
  return (
    <Card className="item-card-big">
      <div className="item-card-container">
        <div className="item-image">
          {/* Wrapping the image in a link */}
          <Link to={'/product/2'} style={{ textDecoration: "none" }}>
            <img src={image} alt={title} />
          </Link>
        </div>
        <div className="item-details">
          <Typography variant="h6" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Only {stockNumber} left in stock - order soon.
          </Typography>

          {isCart ? (
            <div className="item-actions">
              <label htmlFor="quantity">Qty:</label>
              <select name="quantity" id="quantity" value={quantity}>
                {[...Array(10).keys()].map((num) => (
                  <option key={num + 1} value={num + 1}>
                    {num + 1}
                  </option>
                ))}
              </select>
              <Button variant="text" onClick={onRemove}>
                Delete
              </Button>
            </div>
          ) : null /* Do not display anything when isCart is false */}
        </div>
        <div className="item-price">
          <Typography variant="h6" component="div">
            ${price}
          </Typography>
        </div>
      </div>
    </Card>
  );
};

export default ItemCardBig;
