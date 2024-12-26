import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "../index.css";
import { userGetUserID } from "../hooks/userGetUserID";

const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]); // Saved recipes state
  const [loading, setLoading] = useState(false); // Loading state (for fetching and deleting)
  const [error, setError] = useState(null); // Error state
  const [deletingRecipeId, setDeletingRecipeId] = useState(null); // State to track which recipe is being deleted
  const UserID = userGetUserID(); // Assuming this is your method to get the UserID

  // Function to fetch saved recipes
  const fetchSavedRecipes = async () => {
    if (!UserID) return; // Avoid fetching if UserID is not available

    try {
      setLoading(true); // Start loading
      setError(null); // Reset any previous error

      // Fetch saved recipes using the correct UserID
      const response = await axios.get(
        `http://localhost:3001/Home/savedRecipes/ids/${UserID}`
      );
      console.log("Fetched Saved Recipes:", response.data.savedRecipes);

      if (response.data && response.data.savedRecipes) {
        setSavedRecipes(response.data.savedRecipes); // Set saved recipes
      } else {
        setSavedRecipes([]); // If no saved recipes, set as empty
      }
    } catch (err) {
      console.log(
        "Error fetching saved recipes:",
        err.response ? err.response.data : err.message
      );
      setError("Failed to load saved recipes. Please try again later."); // Set error message
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Function to delete a recipe
  const deleteRecipe = async (recipeId) => {
    setDeletingRecipeId(recipeId); // Track which recipe is being deleted
    try {
      const response = await axios.delete(
        `http://localhost:3001/Home/recipe/${recipeId}`
      );
      console.log("Recipe deleted:", response.data);

      // Update the savedRecipes state by removing the deleted recipe
      setSavedRecipes((prevSavedRecipes) =>
        prevSavedRecipes.filter((recipe) => recipe._id !== recipeId)
      );
    } catch (err) {
      console.log(
        "Error deleting recipe:",
        err.response ? err.response.data : err.message
      );
      setError("Failed to delete the recipe. Please try again later.");
    } finally {
      setDeletingRecipeId(null); // Reset deleting state
    }
  };

  // Fetch saved recipes when the component mounts or UserID changes
  useEffect(() => {
    if (UserID) {
      fetchSavedRecipes();
    }
  }, [UserID]); // Only trigger when UserID changes

  return (
    <div>
      <Outlet />
      <body className="bg-gradient-to-b from-gray-200 to-gray-400 bg-fixed h-full">
        <div className="container mx-auto p-4">
          <h1 className="text-center text-4xl mb-8">Your Saved Recipes</h1>

          {/* Loading State */}
          {loading && (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center text-danger mb-4">
              <p>{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && savedRecipes.length === 0 && (
            <div className="text-center text-gray-500 mb-4">
              <p>You have no saved recipes.</p>
            </div>
          )}

          {/* Recipes List */}
          {!loading && !error && savedRecipes.length > 0 && (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-16">
              {savedRecipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="col d-flex justify-content-center"
                >
                  <div className="card w-100 shadow-md rounded-md overflow-hidden">
                    <img
                      className="card-img-top"
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title text-green-400">
                        {recipe.name}
                      </h5>
                      <div className="d-flex justify-content-between mb-3 text-gray-500">
                        <div className="d-flex align-items-center">
                          <span className="ml-1">
                            {recipe.cookingTime} minutes For Cook
                          </span>
                        </div>
                      </div>

                      <Link
                        to={`/recipe/${recipe._id}`}
                        className="btn btn-success w-100 text-white uppercase mb-2"
                      >
                        View Recipe
                      </Link>

                      <button
                        onClick={() => deleteRecipe(recipe._id)}
                        disabled={deletingRecipeId === recipe._id}
                        className={`btn w-100 ${
                          deletingRecipeId === recipe._id
                            ? "btn-warning"
                            : "btn-danger"
                        } text-white uppercase`}
                      >
                        {deletingRecipeId === recipe._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </body>
    </div>
  );
};

export default SavedRecipes;
