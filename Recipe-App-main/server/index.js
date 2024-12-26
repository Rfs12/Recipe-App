const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const UserModel = require("./models/Users");
const RecipeModel = require("./models/Recipes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser()); // Add cookie parser middleware

// ==========================
// JWT Token Verification Middleware (using cookies)
// ==========================
const verifyToken = (req, res, next) => {
  const token = req.cookies.token; // Get token from cookies
  if (token) {
    jwt.verify(token, "your_jwt_secret", (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Forbidden if token is invalid
      }
      req.user = decoded; // Add user info to request for further use
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized if no token is found
  }
};

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// ==========================
// Routes for Recipes
// ==========================
app.get("/Home", async (req, res) => {
  try {
    const recipes = await RecipeModel.find({});
    res.json(recipes); // Return all recipes as a JSON response
  } catch (err) {
    res.status(500).json({ message: "Error fetching recipes", error: err });
  }
});

app.post("/Home", (req, res) => {
  const recipeData = req.body;

  RecipeModel.create(recipeData)
    .then((recipe) => {
      res.status(201).json(recipe); // Respond with the created recipe
    })
    .catch((err) => {
      res.status(500).json({ message: "Error creating recipe", error: err });
    });
});

app.put("/Home", async (req, res) => {
  try {
    const { recipeID, UserID } = req.body;
    const recipe = await RecipeModel.findById(recipeID);
    const user = await UserModel.findById(UserID);

    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.savedRecipes.includes(recipeID)) {
      return res.status(400).json({ message: "Recipe already saved" });
    }

    user.savedRecipes.push(recipe);
    await user.save();

    res.status(200).json({
      message: "Recipe saved successfully",
      savedRecipes: user.savedRecipes,
    });
  } catch (err) {
    console.error("Error saving recipe:", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
});

app.get("/Home/savedRecipes/ids/:UserID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.UserID).populate(
      "savedRecipes"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching saved recipes", error: err });
  }
});

//show product details
app.get("/Home/recipe/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const recipe = await RecipeModel.findById(id); // Assuming you're using MongoDB
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch recipe" });
  }
});

//delete products
app.delete("/Home/recipe/:id", async (req, res) => {
  const { id } = req.params; // Extracting product ID from the URL parameters
  try {
    // Finding the product by its ID and removing it
    const deletedProduct = await RecipeModel.findByIdAndDelete(id);

    // If no product is found with the given ID
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Responding with a success message
    res.json({
      message: "Product successfully deleted",
      product: deletedProduct,
    });
  } catch (err) {
    // Catching any errors that occur during the deletion process
    res.status(500).json({ message: "Failed to delete product" });
  }
});

app.get("/savedRecipes/:UserID", async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.UserID);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const savedRecipes = await RecipeModel.find({
      _id: { $in: user.savedRecipes },
    });
    res.json({ savedRecipes });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching saved recipes", error: err });
  }
});

// ==========================
// Routes for User Login & Registration
// ==========================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  UserModel.findOne({ email: email }).then((user) => {
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign(
            { userId: user._id, email: user.email },
            "your_jwt_secret",
            { expiresIn: "2h" }
          );

          // Set the token in the cookie
          res.cookie("token", token, {
            httpOnly: true, // Makes the cookie accessible only through HTTP(S), not JavaScript
            secure: process.env.NODE_ENV === "production", // Set this to true in production for secure cookies (HTTPS)
            maxAge: 2 * 60 * 60 * 1000, // Set cookie expiration (2 hours)
          });

          res.json({
            success: true,
            message: "Login successful",
            user: {
              userId: user._id,
            },
          });
        } else {
          res.json({ success: false, message: "Incorrect password" });
        }
      });
    } else {
      res.json({ success: false, message: "User not registered" });
    }
  });
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  UserModel.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser = new UserModel({
      name,
      email,
      password, // Password will be hashed automatically in pre-save hook
    });

    newUser
      .save()
      .then((user) => {
        res.status(201).json({
          success: true,
          message: "User registered successfully",
          user,
        });
      })
      .catch((err) => {
        console.error("Error registering user:", err);
        res
          .status(500)
          .json({ message: "Error registering user", error: err.message });
      });
  });
});

// ==========================
// Logout Route to Clear Cookie
// ==========================
app.post("/login", (req, res) => {
  res.clearCookie("token"); // Clear the JWT token cookie
  res.json({ message: "Logged out successfully" });
});

// ==========================
// Start the server
// ==========================
app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
