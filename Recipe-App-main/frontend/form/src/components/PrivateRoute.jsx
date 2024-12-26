import { Navigate, Outlet } from "react-router-dom";

// Function to get the value of a cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// PrivateRoute checks if the user is authenticated
function PrivateRoute() {
  const authToken = getCookie("token"); // Get token from cookies

  // If there is no auth token, redirect to the login page
  if (!authToken) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child components
  return <Outlet />;
}

export default PrivateRoute;
