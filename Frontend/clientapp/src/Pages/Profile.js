import React, { useEffect, useState, useContext } from "react";
import ProfileInfo from "../Components/ProfileInfo";
import NavBar from "../Components/NavBar";
import { UserProvider } from "../Components/UserAdminContext";
import { AuthContext } from '../AuthContext'; // Ensure you are using AuthContext
import axios from 'axios';

const Profile = () => {
  const { isAuthenticated } = useContext(AuthContext); // Use context for authentication
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user_details/', {
          withCredentials: true // Ensure cookies are sent
        });
        setUser(response.data); // Set the user data
        setLoading(false); // Stop loading when data is fetched
      } catch (error) {
        console.error('Error fetching user details:', error);
        setLoading(false); // Stop loading on error
      }
    };

    if (isAuthenticated) {
      fetchUserDetails();
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <UserProvider>
        <NavBar/>
      </UserProvider>
      {user && <ProfileInfo user={user} />}
    </div>
  );
};

export default Profile;
