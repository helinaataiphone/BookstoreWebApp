import React from "react";
import "./Category.css";
import { Link } from 'react-router-dom';

const Category = ({ categories }) => {
  const itemsPerRow = 4;
  const isLastRowFull = categories.length % itemsPerRow === 0;

  return (
    <div
      className={`categories-container ${
        !isLastRowFull ? "center-last-row" : ""
      }`}
    >
      {categories.map((category, index) => (
        <Link to={`/products/${category.categoryid}`} className="category-link">
          <div className="category-image-container">
            <img src={category.imageurl} alt={category.categoryname} />
          </div>
          <div className="category-title">{category.categoryname}</div>
        </Link>
      ))}
    </div>
  );
};

export default Category;
