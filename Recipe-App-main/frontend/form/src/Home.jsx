import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";
import { userGetUserID } from "./hooks/userGetUserID";

export const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [clickedRecipes, setClickedRecipes] = useState([]); // Track clicked recipes
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const UserID = userGetUserID();

  // Fetch recipes and saved recipes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Home");
        setRecipes(response.data);
        console.log("Fetched Recipes:", response.data);
      } catch (err) {
        console.log("Error fetching recipes:", err);
      }
    };

    const fetchSavedRecipes = async () => {
      if (!UserID) return; // Avoid fetching if UserID is not available

      try {
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
      }
    };

    // Fetch recipes and saved recipes on mount
    if (UserID) {
      fetchRecipes();
      fetchSavedRecipes();
    }
  }, [UserID]);

  // Search handler
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtered recipes based on search query
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const saveRecipe = async (recipeID) => {
    if (!UserID) {
      console.log("User not logged in!");
      return; // Optionally, redirect the user to the login page here.
    }

    // Avoid saving the same recipe twice by checking if it's already in savedRecipes
    if (savedRecipes.some((saved) => saved._id === recipeID)) {
      console.log("This recipe is already saved.");
      return;
    }

    // Mark the recipe as clicked
    setClickedRecipes((prevClickedRecipes) => [
      ...prevClickedRecipes,
      recipeID,
    ]);

    try {
      // Send a PUT request to save the recipe
      const response = await axios.put("http://localhost:3001/Home", {
        UserID,
        recipeID,
      });

      console.log("Saved Recipe:", response.data);

      // Optimistically update the UI by adding the saved recipe to the state
      setSavedRecipes((prevSavedRecipes) => {
        return [...prevSavedRecipes, response.data.savedRecipes];
      });

      // Alert when the recipe is successfully saved
      alert(`New Recipe has been saved!`);
    } catch (err) {
      console.log("Error saving recipe:", err);
    }
  };

  const isRecipeSaved = (recipeID) => {
    return savedRecipes.some((saved) => saved._id === recipeID);
  };

  const isRecipeClicked = (recipeID) => {
    // Check if the recipe has been clicked to disable the button
    return clickedRecipes.includes(recipeID);
  };

  return (
    <div>
      <Outlet />
      <div className="container my-4 ">
        {/* Search Input */}
        <h4>Search Recipes</h4>
        <div className="mb-4 w-50">
          {" "}
          {/* Adjust w-50 to control width */}
          <input
            type="text"
            className="form-control"
            placeholder="Search for a recipe..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Recipe Cards */}
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div key={recipe._id} className="col">
                <div className="card h-100 shadow-sm">
                  {/* Recipe Image */}
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.name}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    {/* Recipe Name */}
                    <h5 className="card-title">{recipe.name}</h5>

                    {/* Cooking Time */}
                    <p className="text-muted">
                      Cooking Time: {recipe.cookingTime} minutes
                    </p>

                    {/* Save Button */}
                    <button
                      onClick={() => saveRecipe(recipe._id)}
                      disabled={isRecipeClicked(recipe._id)}
                      className={`btn ${
                        isRecipeSaved(recipe._id)
                          ? "btn-success"
                          : "btn-outline-success"
                      } w-100`}
                    >
                      {isRecipeSaved(recipe._id) ? "Saved" : "Save"}
                    </button>
                    <Link
                      to={`/recipe/${recipe._id}`}
                      className="btn btn-success w-100 mt-2 text-white uppercase"
                    >
                      View Recipe
                    </Link>
                    {/* Display "ALREADY SAVED" if recipe is in saved list */}
                    {isRecipeSaved(recipe._id) && (
                      <p className="text-success mt-2">ALREADY SAVED</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="text-center text-muted">No recipes found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
