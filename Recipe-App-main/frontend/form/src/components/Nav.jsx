import { Link } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Importing Bootstrap CSS

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-success shadow-md fixed top-0 left-0 w-full z-10">
      <nav className="navbar navbar-expand-lg navbar-dark bg-success">
        <div className="container-fluid">
          {/* Logo or App Name */}
          <Link to="/home" className="navbar-brand">
            RecipeHome
          </Link>

          {/* Hamburger Menu Button (Mobile) */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded={isOpen ? "true" : "false"}
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Desktop Navigation Links */}
          <div
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  to="/home"
                  className="nav-link text-white hover:text-gray-400 transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/Create-recipe"
                  className="nav-link text-white hover:text-gray-400 transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Create Recipe
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/savedRecipes"
                  className="nav-link text-white hover:text-gray-400 transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Saved Recipes
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/login"
                  className="nav-link text-white hover:text-gray-400 transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
