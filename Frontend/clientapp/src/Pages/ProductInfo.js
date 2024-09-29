import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Alert, Container, Row, Col, Carousel } from "react-bootstrap";
import NavBar from "../Components/NavBar";
import "./ProductInfo.css"; // Import the CSS for the animation
import axios from "axios";

const ProductInfo = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState();  // State to store product data
  const [isAdded, setIsAdded] = useState(false); // State for cart animation
  const [error, setError] = useState(null); // State for error handling
  const images = [
    "https://via.placeholder.com/400",
    "https://via.placeholder.com/400/0000FF",
    "https://via.placeholder.com/400/FF0000",
  ]

  // Fetch product data from the API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/products/${id}/`);
        if (!response.ok) {
          throw new Error('Product not found');
        }

        const data = await response.json();  // Parse the response into JSON

        setProduct(data);   // Set the parsed data in state
      } catch (err) {
        setError(err.message);
      }
    };
    fetchProduct();
  }, [id]);

  // Helper function to get CSRF token from cookies
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}

const csrfToken = getCookie('csrftoken');  // Assuming you're using Django's default CSRF setup


const handleAddToCart = async () => {
  try {
    // Retrieve the CSRF token from cookies
    const csrfToken = getCookie('csrftoken'); 

    // Data to be sent in the request body
    const data = {
      quantity: 1,
      productid: product.productid  // Ensure productid is coming from your product object
    };

    // Send the POST request using Axios
    const response = await axios.post('http://localhost:8000/api/cart/add/', data, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken  // Include the CSRF token for session-based authentication
      },
      withCredentials: true  // Ensure credentials (cookies) are sent with the request
    });

    if (response.status >= 200 && response.status < 300) {
      console.log(response.data.message);  // Log success message
      setIsAdded(true);  // Trigger the animation
    } else {
      throw new Error('Failed to add to cart');
    }
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);  // Detailed error logging
  }

  // Reset the animation after 2 seconds
  setTimeout(() => {
    setIsAdded(false);
  }, 2000);
};


  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">Loading...</Alert>
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: "#f4f4f4" }}>
      <NavBar
        logoSrc="/St_Mary_COC_Logo_No_Background.png"
        title="St. Mary's Coptic Orthodox Church Bookstore"
      />
      <Container className="mt-4">
        <Row>
          <Col md={6}>
            {/* Carousel with manual navigation */}
           {/* Carousel with manual navigation */}
           <Carousel controls={true} indicators={false}>
              {images.map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={image}
                    alt={`Slide ${index}`}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>
          <Col md={6}>
            <h2>{product.productname}</h2>
            <p>{product.productdescription}</p>
            <h4 className="text-primary">${product.productprice}</h4>

            {/* Display stock and requestable info */}
            {product.availablequantity > 0 || product.isrequestable ? (
              <>
                {product.availablequantity === 0 && product.isrequestable && (
                  <Alert variant="warning">This item is being restocked and may take longer to deliver.</Alert>
                )}
                <Button variant="primary" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
              </>
            ) : (
              <Alert variant="danger">Out of Stock</Alert>
            )}

            {/* Animation for "Item added to cart" */}
            {isAdded && (
              <div className="cart-animation" onClick={handleAddToCart}>Item added to cart!</div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProductInfo;
