import React, { useState, useEffect } from "react";
import "./Checkout.css";
import NavBar from "../Components/NavBar";
import { UserProvider } from "../Components/UserAdminContext";
import { useNavigate } from "react-router-dom";
import { PayPalButtons } from "@paypal/react-paypal-js";

function Checkout() {
  const [pickup, setPickup] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [step, setStep] = useState(1);
  const [orderTotal, setOrderTotal] = useState(0); // For dynamic total
  const navigate = useNavigate();

  const orderItems = [
    {
      id: 1,
      image: "https://via.placeholder.com/100",
      name: "Product 1",
      price: 20.0,
      quantity: 2,
    },
    {
      id: 2,
      image: "https://via.placeholder.com/100",
      name: "Product 2",
      price: 15.0,
      quantity: 1,
    },
  ];

  // Calculate total dynamically based on `orderItems`
  useEffect(() => {
    const total = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setOrderTotal(total.toFixed(2)); // Convert to string with two decimal places
  }, [orderItems]);

  const handlePickupChange = (event) => setPickup(event.target.checked);
  const handleEditCart = () => navigate("/cart");
  const handleDeliveryOptionChange = (event) =>
    setDeliveryOption(event.target.value);
  const handlePaymentChange = (event) => setPaymentMethod(event.target.value);
  const handleNextStep = () => setStep((prevStep) => Math.min(prevStep + 1, 3));
  const handlePreviousStep = () =>
    setStep((prevStep) => Math.max(prevStep - 1, 1));

  const createOrder = async () => {
    // Send order total to Django backend
    const response = await fetch(
      "http://localhost:8000/api/paypal/create-order/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: orderTotal }),
      }
    );
    const data = await response.json();
    return data.id; // Return PayPal order ID
  };

  const onApprove = async (data) => {
    // Capture the payment after approval
    const response = await fetch(
      `http://localhost:8000/api/paypal/capture-order/${data.orderID}/`,
      {
        method: "POST",
      }
    );
    const captureData = await response.json();
    if (captureData.status === "COMPLETED") {
      alert("Payment successful!");
      // Redirect or update order status here if needed
    } else {
      alert("Payment not completed");
    }
  };

  return (
    <div className="checkout-wrapper">
      <UserProvider>
        <NavBar
          logoSrc="/St_Mary_COC_Logo_No_Background.png"
          title="St. Mary's Coptic Orthodox Church Bookstore"
        />
      </UserProvider>

      <div className="checkout-container">
        <div className="shipping-info">
          <h2>Checkout</h2>
          <div className="steps">
            <div className={`step ${step === 1 ? "active" : ""}`}>
              <span>1</span> Shipping and Gift Options
            </div>
            <div className={`step ${step === 2 ? "active" : ""}`}>
              <span>2</span> Payment and Billing
            </div>
            <div className={`step ${step === 3 ? "active" : ""}`}>
              <span>3</span> Review and Place Order
            </div>
          </div>

          {/* Step 1: Shipping and Gift Options */}
          {step === 1 && (
            <form>
              <div className="form-group">
                <label>
                  Delivery Options:
                  <select
                    value={deliveryOption}
                    onChange={handleDeliveryOptionChange}
                    required
                  >
                    <option value="">Please select a delivery method</option>
                    <option value="inperson">
                      Pickup in person at 4110 204th St SW, Lynnwood, WA 98036
                    </option>
                    <option value="homedelivery">Home Delivery</option>
                  </select>
                </label>
              </div>

              {pickup && (
                <div>
                  <label>
                    Payment Method:
                    <select
                      onChange={handlePaymentChange}
                      value={paymentMethod}
                    >
                      <option value="">Select</option>
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                    </select>
                  </label>
                  {paymentMethod && (
                    <>
                      <label>
                        First Name: <input type="text" required />
                      </label>
                      <label>
                        Last Name: <input type="text" required />
                      </label>
                      <label>
                        Email: <input type="email" required />
                      </label>
                      <label>
                        Phone Number: <input type="tel" required />
                      </label>
                    </>
                  )}
                </div>
              )}

              {!pickup && (
                <>
                  <div className="form-group">
                    <label>
                      First Name: <input type="text" required />
                    </label>
                    <label>
                      Last Name: <input type="text" required />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      Street Address: <input type="text" required />
                    </label>
                    <label>
                      Add apt, suite, or other: <input type="text" />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      Postal Code: <input type="text" required />
                    </label>
                    <label>
                      City: <input type="text" required />
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      State:
                      <select required>
                        <option value="">Please Select</option>
                        <option value="WA">Washington</option>
                      </select>
                    </label>
                  </div>
                  <div className="form-group">
                    <label>
                      Phone Number: <input type="tel" required />
                    </label>
                  </div>
                </>
              )}
              <div className="button-group">
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleNextStep}
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Payment and Billing */}
          {step === 2 && (
            <form className="payment-form">
              <h3>Payment Information</h3>
              <div className="paypal-buttons">
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={createOrder}
                  onApprove={onApprove}
                />
              </div>
              <div className="button-group">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handlePreviousStep}
                >
                  Back
                </button>
                <button
                  type="button"
                  className="primary-button"
                  onClick={handleNextStep}
                >
                  Next
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Review and Place Order */}
          {step === 3 && (
            <form>
              <h3>Review Your Order</h3>
              <p>Check the details and confirm your purchase.</p>
              <div className="order-details">
                {orderItems.map((item) => (
                  <div key={item.id} className="order-item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="product-image"
                    />
                    <div className="item-info">
                      <p>
                        <strong>Name:</strong> {item.name}
                      </p>
                      <p>
                        <strong>Price:</strong> ${item.price.toFixed(2)}
                      </p>
                      <p>
                        <strong>Quantity:</strong> {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="button-group">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={handlePreviousStep}
                >
                  Back
                </button>
                <button type="submit" className="primary-button big-button">
                  Place Order
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-details">
            <p>Merchandise: ${orderTotal}</p>
            <p>Shipping & Handling: CAD 19.95</p>
            <p>Tax: CAD 25.98</p>
            <p className="total">
              <strong>Order Total: CAD {orderTotal}</strong>
            </p>
            <button className="secondary-button" onClick={handleEditCart}>
              Edit cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
