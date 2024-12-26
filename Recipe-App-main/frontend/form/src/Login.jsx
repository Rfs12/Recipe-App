import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // For displaying error messages
  const [loading, setLoading] = useState(false); // For loading state
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Basic validation for password length
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    // Make sure to send email and password to the backend
    axios
      .post("http://localhost:3001/login", { email, password })
      .then((result) => {
        setLoading(false); // Stop loading
        console.log(result.data); // Log the result from backend

        if (result.data.success) {
          // Store the JWT token in localStorage
          localStorage.setItem("userId", result.data.user.userId);
          // Redirect to the home page
          navigate("/Home");
        } else {
          setErrorMessage(result.data.message); // Show error message
        }
      })
      .catch((err) => {
        setLoading(false); // Stop loading
        console.error(err);
        setErrorMessage("An error occurred during login. Please try again.");
      });
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="row w-100">
        <div className="col-md-6 col-lg-4 mx-auto">
          <div className="card shadow-lg p-4">
            <h2 className="text-center mb-4">Sign In</h2>
            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="form-group mb-3">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="form-group mb-3">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="alert alert-danger">{errorMessage}</div>
              )}

              {/* Loading Spinner */}
              {loading && <div className="text-center">Loading...</div>}

              {/* Signin Button */}
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              {/* Sign Up Link */}
              <div className="text-center mt-3">
                <p>
                  Dont have an account?{" "}
                  <Link className="text-success" to="/rejister">
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
