import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // to get the recipe ID from URL
import axios from "axios";
import { Link } from "react-router-dom";
import "../index.css";

const ShowProduct = () => {
  const { id } = useParams(); // Extract recipe ID from URL params
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the recipe details by ID
  useEffect(() => {
    const fetchRecipeDetails = async () => {
      setLoading(true); // Start loading
      setError(null); // Reset error state

      try {
        const response = await axios.get(
          `http://localhost:3001/Home/recipe/${id}`
        );
        setRecipe(response.data); // Set the recipe details in state
      } catch (err) {
        err.setError("Failed to fetch recipe details. Please try again later.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (id) {
      fetchRecipeDetails(); // Fetch the details when component mounts
    }
  }, [id]);

  // Render loading, error, or the recipe details
  if (loading) {
    return (
      <div className="text-center text-xl">
        <span>Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="text-center text-gray-500">
        <p>No recipe found.</p>
      </div>
    );
  }

  // Render the recipe details if data is available
  return (
    <div className="container my-5">
      <div className="row">
        {/* Recipe Image */}
        <div className="col-md-4 mb-4">
          <img
            src={recipe.imageUrl}
            alt={recipe.name}
            className="img-fluid rounded shadow-lg"
          />
        </div>

        {/* Recipe Information */}
        <div className="col-md-8">
          <div className="card p-4 shadow-lg rounded">
            <h2 className="display-4 text-success">{recipe.name}</h2>
            <p className="lead text-muted">
              {recipe.cookingTime} minutes to cook
            </p>

            {/* Ingredients */}
            <h4 className="mt-4">Ingredients:</h4>
            <ul className="list-group list-group-flush">
              {recipe.ingredients && recipe.ingredients.length > 0 ? (
                recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="list-group-item">
                    {ingredient}
                  </li>
                ))
              ) : (
                <li className="list-group-item">No ingredients listed.</li>
              )}
            </ul>

            <h4 className="mt-4">Instructions:</h4>
            <ul className="list-group list-group-flush">
              {recipe.instructions && recipe.instructions.length > 0 ? (
                recipe.instructions.map((instructions, index) => (
                  <li key={index} className="list-group-item">
                    {instructions}
                  </li>
                ))
              ) : (
                <li className="list-group-item">No Instructions listed.</li>
              )}
            </ul>
            {/* Additional Recipe Info (Optional) */}
            <h4 className="mt-4">How is This:</h4>
            <p>{recipe.description}</p>
            {/* Back Button */}
            <div className="mt-4">
              <Link
                to="/savedRecipes"
                className="btn btn-success btn-lg text-white"
              >
                Back to Recipes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowProduct;
