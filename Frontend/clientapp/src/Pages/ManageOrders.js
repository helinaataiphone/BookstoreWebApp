import React, { useState, useEffect, useContext } from "react";
import axios from "axios"; // Import Axios
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Chip,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../Components/NavBar";
import { UserProvider } from "../Components/UserAdminContext";
import { AuthContext } from "../AuthContext"; // Import AuthContext
import "./ManageOrders.css";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [orderIdSearch, setOrderIdSearch] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null); // Track which order is being edited
  const [editedStatus, setEditedStatus] = useState(""); // Track the status being edited

  const { isAuthenticated, isAdmin } = useContext(AuthContext); // Use AuthContext
  const navigate = useNavigate();


  useEffect(() => {
    // Fetch orders based on user role (admin or regular user)

    const fetchOrders = async () => {
      try {
        let response;
        const config = {
          withCredentials: true,  // Ensures cookies are sent along with the request
          headers: {
            'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)[1] // Include CSRF token from cookies
          },
        };
        if (isAdmin) {
          // Admin can get all orders
          response = await axios.get("http://localhost:8000/api/orders/all/",config); // This should map to your `get_all_orders` view
        } else {
          // Regular users can get their own orders
          response = await axios.get("http://localhost:8000/api/orders/user/", config); // This should map to your `get_user_orders` view
        }
        setOrders(response.data); // Set orders with fetched data
        setFilteredOrders(response.data); // Set filtered orders with fetched data
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [isAdmin]);

  useEffect(() => {
    let filtered = orders;

    if (statusFilter) {
      filtered = filtered.filter((order) => order.orderstatus === statusFilter);
    }

    if (orderIdSearch) {
      filtered = filtered.filter((order) =>
        order.orderid.toString().includes(orderIdSearch)
      );
    }

    setFilteredOrders(filtered);
  }, [statusFilter, orderIdSearch, orders]);

  const statusColor = (status) => {
    switch (status) {
      case "Processing":
        return "orange";
      case "Dispatched":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "grey";
    }
  };

  const handleStatusChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleOrderIdSearch = (event) => {
    setOrderIdSearch(event.target.value);
  };

  const startEditing = (orderId, currentStatus) => {
    setEditingOrderId(orderId);
    setEditedStatus(currentStatus);
  };

  const saveStatus = async (orderId) => {
    const csrfToken = document.cookie.match(/csrftoken=([^;]+)/);
    const config = {
      withCredentials: true,
      headers: {
        'X-CSRFToken': csrfToken ? csrfToken[1] : '', // Fallback to an empty string if not found
      },
    };
  
    try {
      // Make the PATCH request to update the status of the order
      const response = await axios.patch(
        `http://localhost:8000/api/orders/${orderId}/`, // Adjust to your actual endpoint
        { orderstatus: editedStatus },  // Payload with the new status
        config
      );
  
      // If the request is successful, update the local orders state
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderid === orderId ? { ...order, orderstatus: editedStatus } : order // Use order.id for consistency
        )
      );
      setEditingOrderId(null); // Stop editing mode
    } catch (error) {
      console.error("Error updating the order status:", error);
    }
  };
  
  

  return (
    <div>
      <UserProvider>
        <NavBar
          logoSrc="/St_Mary_COC_Logo_No_Background.png"
          title="St. Mary's Coptic Orthodox Church Bookstore"
        />
      </UserProvider>
      <Box>
        <div className="homeheader">Manage Orders</div>

        {/* Filter and search */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "column", md: "row" },
            justifyContent: "space-between",
            mb: 2,
            p: 2,
          }}
        >
          <FormControl
            sx={{
              width: { xs: "100%", sm: "100%", md: 200 },
              ml: { xs: 0, sm: 0, md: 7 },
              mb: { xs: 2, sm: 2, md: 0 },
            }}
          >
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusChange}
              label="Status Filter"
            >
              <MenuItem value="">
                <em>All</em>
              </MenuItem>
              <MenuItem value="Processing">Processing</MenuItem>
              <MenuItem value="Dispatched">Dispatched</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Search by Order ID"
            variant="outlined"
            value={orderIdSearch}
            onChange={handleOrderIdSearch}
            sx={{
              ml: { xs: 0, sm: 0, md: 2 },
              mr: { xs: 0, sm: 0, md: 7 },
              width: { xs: "100%", sm: "100%", md: 250 },
            }}
          />
        </Box>

        {/* Orders Table */}
        <TableContainer
          component={Paper}
          elevation={3}
          sx={{ mt: 3, width: "90%", margin: "0 auto" }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Order ID
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Date/Time
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Customer
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Status
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Items
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Total
                  </Typography>
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Actions
                    </Typography>
                  </TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow
                  key={order.id}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    "&:hover": {
                      backgroundColor: "#f1f1f1",
                    },
                  }}
                >
                  <TableCell component="th" scope="row">
                    <Link
                      to={`/orderdetails/${order.orderid}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Chip label={`#${order.orderid}`} color="primary" clickable />
                    </Link>
                  </TableCell>
                  <TableCell>{order.orderdate}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    {editingOrderId === order.orderid ? (
                      <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                        <Select
                          value={editedStatus}
                          onChange={(e) => setEditedStatus(e.target.value)}
                        >
                          <MenuItem value="Processing">Processing</MenuItem>
                          <MenuItem value="Dispatched">Dispatched</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    ) : (
                      <Tooltip title={order.orderstatus} placement="top" arrow>
                        <Chip
                          label={order.orderstatus}
                          sx={{
                            backgroundColor: statusColor(order.orderstatus),
                            color: "white",
                          }}
                        />
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell>{order.items_count}</TableCell>
                  <TableCell>{order.total_price}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <Grid container spacing={1}>
                        <Grid item>
                          {editingOrderId === order.orderid ? (
                            <Tooltip title="Save" arrow>
                              <IconButton
                                aria-label="save"
                                onClick={() => saveStatus(order.orderid)}
                              >
                                <CheckIcon color="success" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title="Edit Status" arrow>
                              <IconButton
                                aria-label="edit"
                                onClick={() =>
                                  startEditing(order.orderid, order.orderstatus)
                                }
                              >
                                <EditIcon color="secondary" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Grid>
                        <Grid item>
                          <Tooltip title="Delete Order" arrow>
                            <IconButton aria-label="delete">
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </Grid>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default ManageOrders;
