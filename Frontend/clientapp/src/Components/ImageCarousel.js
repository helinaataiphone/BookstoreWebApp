import React, { useState, useEffect } from "react";
import "./ImageCarousel.css";

const initialImages = ["./spiritualbooks.jpg", "./cross.jpg", "./agpeya.webp"];

const ImageCarousel = () => {
  const [images, setImages] = useState(initialImages);

  useEffect(() => {
    const interval = setInterval(() => {
      setImages((prevImages) => {
        return [...prevImages.slice(1), prevImages[0]]; // Rotate images in array
      });
    }, 3000); // Change positions every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel">
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Slide ${index}`}
          className={`carousel__item item-${index}`}
        />
      ))}
    </div>
  );
};
export default ImageCarousel;
