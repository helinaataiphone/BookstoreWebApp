import React from "react";
import ItemCardBig from "../Components/ItemCardBig";
import NavBar from "../Components/NavBar";
import "./Cart.css";
import { UserProvider } from "../Components/UserAdminContext";

const Orders = () => {
  const orders = [
    {
      orderId: "12345",
      items: [
        {
          id: 1,
          image: "https://via.placeholder.com/150",
          title:
            "Christopher Knight Home Daisy Outdoor Club Chair with Cushion (Set of 4), Teak Finish, Cream",
          description: "",
          price: 824.91,
          quantity: 1,
          stockNumber: 8,
        },
        {
          id: 2,
          image: "https://via.placeholder.com/150",
          title:
            "Christopher Knight Home Daisy Outdoor Club Chair with Cushion (Set of 4), Teak Finish, Cream",
          description: "",
          price: 824.91,
          quantity: 1,
          stockNumber: 8,
        },
      ],
    },
    {
      orderId: "67890",
      items: [
        {
          id: 3,
          image: "https://via.placeholder.com/150",
          title:
            "Christopher Knight Home Daisy Outdoor Club Chair with Cushion (Set of 4), Teak Finish, Cream",
          description: "",
          price: 824.91,
          quantity: 10,
          stockNumber: 8,
        },
      ],
    },
  ];

  return (
    <div>
      <UserProvider>
        <NavBar
          logoSrc="/St_Mary_COC_Logo_No_Background.png"
          title="St. Mary's Coptic Orthodox Church Bookstore"
        />
      </UserProvider>
      <div className="header">Your Orders</div>
      {orders.map((order) => (
        <div key={order.orderId} className="order-section">
          <h3>Order #{order.orderId}</h3>
          {order.items.map((item) => (
            <div key={item.id}>
              <ItemCardBig
                image={item.image}
                title={item.title}
                price={item.price}
                quantity={item.quantity}
                stockNumber={item.stockNumber}
                isCart={false} // Indicates this is not the cart
              />
            </div>
          ))}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              marginTop: "10px",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>
              Total ({order.items.length} item
              {order.items.length > 1 ? "s" : ""}): $
              {order.items
                .reduce((acc, item) => acc + item.price * item.quantity, 0)
                .toFixed(2)}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
