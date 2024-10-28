import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import Cart from "./Pages/Cart";
import ProductInfo from "./Pages/ProductInfo";
import Profile from "./Pages/Profile";
import Orders from "./Pages/Orders";
import AdminAddItems from "./Pages/AdminAddItems";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Products from "./Pages/Products";
import ForgetPassword from "./Pages/ForgetPassword";
import { AuthProvider } from "./AuthContext";
import ResetPassword from "./Pages/ResetPassword";
import ManageOrders from "./Pages/ManageOrders";
import ManageUsers from "./Pages/ManageUsers";
import OrderDetails from "./Pages/OrderDetails";
import Checkout from "./Pages/Checkout";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

function App() {
  return (
    <AuthProvider>
      <PayPalScriptProvider
        options={{
          "client-id":
            "ASA9MyBBHBGfvFmH5wuSh2_9k5zWNo0QxkeXk-6bcBDNoRTGEXxds6Fp0pSMrPvQAakJolPY0eZwZS8S",
          currency: "USD",
          disableFunding: "paylater",
        }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/productinfo/:id" element={<ProductInfo />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/adminadditems" element={<AdminAddItems />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/products/:id/*" element={<Products />} />
            <Route path="/products/" element={<Products />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
            <Route path="/auth/reset/:uid/:token" element={<ResetPassword />} />
            <Route path="/manageorders" element={<ManageOrders />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orderdetails/:id" element={<OrderDetails />} />
            <Route path="/manageusers" element={<ManageUsers />} />
          </Routes>
        </Router>
      </PayPalScriptProvider>
    </AuthProvider>
  );
}

export default App;
