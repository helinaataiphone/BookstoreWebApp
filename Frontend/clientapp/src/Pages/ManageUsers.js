import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { UserProvider } from "../Components/UserAdminContext";
import NavBar from "../Components/NavBar";
import "./ManageUsers.css"; // Your CSS file for extra styles

const usersData = [
  { id: 1, name: "John Doe", isAdmin: true },
  { id: 2, name: "Jane Smith", isAdmin: false },
  { id: 3, name: "Mike Johnson", isAdmin: true },
  { id: 4, name: "Emily Davis", isAdmin: false },
];

const ManageUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const filteredUsers = usersData.filter((user) =>
    user.name.toLowerCase().includes(searchQuery)
  );

  const goToProfile = (id) => {
    navigate(`/profile/${id}`); // Navigate to the profile page with user ID
  };

  return (
    <div>
      <UserProvider>
        <NavBar
          logoSrc="/St_Mary_COC_Logo_No_Background.png"
          title="St. Mary's Coptic Orthodox Church Bookstore"
        />
      </UserProvider>
      <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
        <div className="homeheader">Manage Users</div>

        {/* Search Box */}
        <TextField
          label="Search users..."
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginBottom: "20px", borderRadius: "8px" }}
        />

        {/* Users List */}
        <TableContainer
          component={Paper}
          elevation={3}
          style={{ borderRadius: "12px" }}
        >
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                <TableCell>
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    Name
                  </Typography>
                </TableCell>
                <TableCell align="center">
                  <Typography variant="h6" style={{ fontWeight: "bold" }}>
                    Admin
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow
                    key={user.id}
                    hover
                    style={{
                      backgroundColor: user.id % 2 === 0 ? "#fafafa" : "#fff",
                      cursor: "pointer",
                    }}
                    onClick={() => goToProfile(user.id)}
                  >
                    <TableCell>
                      <Typography
                        variant="body1"
                        color="primary"
                        style={{
                          fontWeight: "bold", // Removed textDecoration: "underline"
                        }}
                      >
                        {user.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography
                        variant="body1"
                        style={{
                          color: user.isAdmin ? "#4caf50" : "#f44336",
                          fontWeight: "bold",
                        }}
                      >
                        {user.isAdmin ? "Yes" : "No"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <Typography variant="body2" color="textSecondary">
                      No users found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default ManageUsers;
