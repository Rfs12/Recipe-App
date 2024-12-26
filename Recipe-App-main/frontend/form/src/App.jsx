import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "./index.css";
import Nav from "./components/nav"; // Import the Nav component
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import ShowProduct from "./assets/ShowProduct";
import PrivateRoute from "./components/PrivateRoute";
import RecipeForm from "./assets/Create-recipe";
import SavedRecipe from "./assets/Saved-recipe";

function App() {
  const location = useLocation(); // Get the current route

  // List of routes where the navbar should not be displayed
  const noNavRoutes = ["/login", "/rejister"];

  // Check if current route is in the noNavRoutes array
  const showNav = !noNavRoutes.includes(location.pathname);

  return (
    <div>
      {/* Conditionally render the Nav component */}
      {showNav && <Nav />}

      {/* Routes for the app */}
      <Routes>
        <Route path="/rejister" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/recipe/:id" element={<ShowProduct />} />
        <Route path="/Create-recipe" element={<RecipeForm />} />
        <Route path="/savedRecipes" element={<SavedRecipe />} />
      </Routes>
    </div>
  );
}

// Wrapping App with BrowserRouter to provide Router context
function AppWithRouter() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}

export default AppWithRouter;
