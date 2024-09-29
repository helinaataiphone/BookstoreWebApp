import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Cart.css";
import { FaTrash } from "react-icons/fa";
import NavBar from "../Components/NavBar";
import { UserProvider } from "../Components/UserAdminContext";

function Cart() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [items, setItems] = useState([]);
  axios.defaults.xsrfHeaderName = 'X-CSRFToken';
  axios.defaults.xsrfCookieName = 'csrftoken';
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/users/cart/", // Use your actual API endpoint
          {
            withCredentials: true, // This ensures that cookies are sent with the request
          }
        );
        setItems(response.data); // Set the cart items from API response
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch cart items.");
        setLoading(false);
      }
    };
    
    fetchCartItems();
  }, []);
  
  


  // Helper function to get the CSRF token from cookies
  const getCsrfToken = () => {
    const csrfCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='));
    return csrfCookie ? csrfCookie.split('=')[1] : null;
  };
  
  const handleQuantityChange = async (productid, quantityChange) => {
    try {
      // Fetch the CSRF token
      const csrfToken = getCsrfToken();
      
      if (!csrfToken) {
        throw new Error('CSRF token not found');
      }
  
      // Find the current item to get the current quantity
      const currentItem = items.find((item) => item.productid.productid === productid);
      if (!currentItem) {
        throw new Error('Item not found in the cart.');
      }
  
      const newQuantity = currentItem.quantity + quantityChange;
      console.log({
        productid: productid,
        quantity: newQuantity,
        'X-CSRFToken': csrfToken,
      });
  
      if (newQuantity <= 0) {
        throw new Error('Quantity must be at least 1.');
      }
     
      const response = await axios.patch(
        "http://localhost:8000/api/cart/modify/", // Your API endpoint for modifying cart
        {
          productid: productid,
          quantity: newQuantity, // Send the new quantity
        },
        {
          headers: {
            'X-CSRFToken': csrfToken, // CSRF token for Django
            'Content-Type': 'application/json',
          },
          withCredentials: true, // Ensures cookies are sent with the request
        }
      );
  
      if (response.status === 200) {
        // Update the quantity in the frontend state
        setItems(
          items.map((item) =>
            item.productid.productid === productid
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } else {
        console.error('Error updating cart item quantity:', response.data);
      }
    } catch (error) {
      console.error('Error in modifying cart item quantity:', error.message);
    }
  };
  
  
  
  
  const handleRemoveItem = async (productid) => {
    try {
      const csrfToken = getCsrfToken();  // Get CSRF token from DOM
  
      const response = await axios({
        method: 'delete',
        url: `http://localhost:8000/api/cart/delete/`, // Do not pass productid in the URL
        data: {
          productid: productid, // Send the productid in the request body
        },
        headers: {
          'X-CSRFToken': csrfToken,  // Include CSRF token in the headers
          'Content-Type': 'application/json',
        },
        withCredentials: true,  // Ensure credentials (cookies) are sent
      });
  
      if (response.status === 204) {
        // Remove the item from the state only if the backend confirms deletion
        setItems(items.filter((item) => item.productid.productid !== productid));
      } else {
        throw new Error('Failed to remove the item from the cart.');
      }
    } catch (error) {
      setError("Failed to remove item. " + error.message);
    }
  };
  
  

  const navigateToProducts = () => {
    navigate("/products");
  };

  const navigateToCheckout = () => {
    navigate("/checkout"); // Assuming you have a route for checkout
  };

  const calculateSubtotal = () => {
    return items
      .reduce((acc, item) => acc + item.quantity * item.productid.productprice, 0)
      .toFixed(2);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <UserProvider>
        <NavBar
          logoSrc="/St_Mary_COC_Logo_No_Background.png"
          title="St. Mary's Coptic Orthodox Church Bookstore"
        />
      </UserProvider>
      <div className="cart-container">
        <h2>Your cart ({items.length} items)</h2>
        {items.map((item) => (
  <div className="item" key={item.cartproductid}>
    <img src={item.productid.imgSrc || "/tote.png"} alt={item.productid.productname} className="item-image" />
    <div className="item-details">
      <div className="item-info">
        <p className="item-title" style={{ fontSize: "25px" }}>
          {item.productid.productname}
        </p>
        <span className="item-price">
          ${parseFloat(item.productid.productprice).toFixed(2)}
        </span>
        <div className="quantity-selector">
          <button
            onClick={() => handleQuantityChange(item.productid.productid, -1)}
            className="quantity-button"
          >
            -
          </button>
          <input
            type="text"
            value={item.quantity}
            readOnly
            className="quantity-input"
          />
          <button
            onClick={() => handleQuantityChange(item.productid.productid, 1)}
            className="quantity-button"
          >
            +
          </button>
          <FaTrash
            className="delete-icon"
            onClick={() => handleRemoveItem(item.productid.productid)}
          />
        </div>
      </div>
    </div>
  </div>
))}

        <div className="subtotal">Subtotal: ${calculateSubtotal()}</div>
        <div className="buttons-container">
          <button
            onClick={navigateToProducts}
            className="add-more-items-button"
          >
            Add more items
          </button>
          <button
            onClick={navigateToCheckout}
            className="proceed-to-checkout-button"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Cart;
