import { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Bootstrap for styling
import { userGetUserID } from "../hooks/userGetUserID"; // Assuming this is a custom hook
import { useNavigate } from "react-router-dom";
function RecipeForm() {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [description, setdescription] = useState("");
  const [userOwner, setUserOwner] = useState(""); // Will be populated with the user ID
  const [error, setError] = useState(""); // For error messages
  const navigate = useNavigate();
  // Fetch the user ID when the component mounts
  useEffect(() => {
    const userID = userGetUserID(); // Fetch the user ID from localStorage (JWT token)
    if (userID) {
      setUserOwner(userID); // Set the userOwner state to the user ID
    } else {
      setError("User is not logged in.");
    }
  }, []); // Empty dependency array means this will run once when the component mounts

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation to ensure fields are filled
    if (
      !name ||
      !ingredients.length ||
      !instructions.length ||
      !imageUrl ||
      !description ||
      !cookingTime ||
      !userOwner
    ) {
      setError("All fields are required!");
      return;
    }

    // Create the recipe object
    const recipeData = {
      name,
      ingredients,
      instructions,
      imageUrl,
      description,
      cookingTime,
      userOwner, // No need for the user to enter this manually
    };

    // Post the recipe to the backend API
    axios
      .post("http://localhost:3001/Home", recipeData) // Ensure your API route is correct
      .then((response) => {
        console.log(response.data);
        alert("Recipe added successfully!");
        navigate("/home");
        // Optionally clear the form after successful submission
        setName("");
        setIngredients([]);
        setInstructions([]);
        setImageUrl("");
        setdescription("");
        setCookingTime("");
        setUserOwner(""); // Reset userOwner after successful submission
        setError(""); // Clear any previous errors
      })
      .catch((error) => {
        console.error(error);
        setError("Error adding recipe! Please try again.");
      });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Add a New Recipe</h2>
      <div className="row">
        {/* Form Column */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            {/* Image URL Field */}
            <div className="form-group">
              <label htmlFor="imageUrl">Image URL</label>
              <input
                type="text"
                className="form-control"
                id="imageUrl"
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </div>
            {/* Recipe Name */}
            <div className="form-group">
              <label htmlFor="name">Recipe Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter recipe name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            {/* Cooking Time Field */}
            <div className="form-group">
              <label htmlFor="cookingTime">Cooking Time (in minutes)</label>
              <input
                type="number"
                className="form-control"
                id="cookingTime"
                placeholder="Enter cooking time"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                required
              />
            </div>

            {/* Ingredients Field */}
            <div className="form-group">
              <label htmlFor="ingredients">Ingredients (comma separated)</label>
              <textarea
                type="text"
                rows={5}
                className="form-control"
                id="ingredients"
                placeholder="Enter ingredients"
                value={ingredients.join(", ")}
                onChange={(e) =>
                  setIngredients(
                    e.target.value.split(",").map((item) => item.trim())
                  )
                }
                required
              />
            </div>

            {/* Instructions Field */}
            <div className="form-group">
              <label htmlFor="instructions">
                Instructions (comma separated)
              </label>
              <textarea
                type="text"
                className="form-control"
                id="instructions"
                placeholder="Enter instructions"
                value={instructions.join(", ")}
                onChange={(e) =>
                  setInstructions(
                    e.target.value.split(",").map((item) => item.trim())
                  )
                }
                required
              />
            </div>

            {/* Description Field */}
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                rows={5}
                className="form-control"
                id="description"
                placeholder="Enter Recipe Description"
                value={description}
                onChange={(e) => setdescription(e.target.value)}
                required
              />
            </div>

            {/* Error message display */}
            {error && <div className="alert alert-danger">{error}</div>}

            {/* Submit Button */}
            <button type="submit" className="btn btn-success btn-block mt-2">
              Submit Recipe
            </button>
          </form>
        </div>

        {/* Preview Column */}
        <div className="col-md-6">
          <div className="card shadow-sm">
            <img
              src={imageUrl}
              alt={name}
              className="card-img-top"
              style={{ height: "250px", objectFit: "cover" }}
            />
            <div className="card-body">
              <h5 className="card-title">{name || "Recipe Name"}</h5>
              <p className="card-text">
                <strong>Description:</strong>{" "}
                {description || "No description available"}
              </p>
              <p className="card-text">
                <strong>Cooking Time:</strong> {cookingTime || "N/A"} minutes
              </p>

              <h6>Ingredients:</h6>
              <ul>
                {ingredients.length > 0 ? (
                  ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))
                ) : (
                  <li>No ingredients entered.</li>
                )}
              </ul>

              <h6>Instructions:</h6>
              <p>
                {instructions.length > 0
                  ? instructions.join(", ")
                  : "No instructions entered."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeForm;
