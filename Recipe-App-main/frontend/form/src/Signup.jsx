import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to store error message
  const [loading, setLoading] = useState(false); // State to handle loading state
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple client-side validation
    if (!email || !password || !name) {
      setError("Please fill in all fields.");
      return;
    }

    // Password length validation (Example: minimum length 6)
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    // Clear previous errors before making the request
    setError("");
    setLoading(true);

    // Handle signup logic here (e.g., send to backend)
    axios
      .post("http://localhost:3001/register", { name, email, password })
      .then((result) => {
        console.log(result);
        navigate("/login"); // Navigate to login page on success
      })
      .catch((err) => {
        console.log(err);
        // Handle server errors and show relevant messages
        setError(
          err.response?.data?.message || "An error occurred. Please try again."
        );
      })
      .finally(() => {
        setLoading(false); // Stop loading indicator once request is complete
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
            <h2 className="text-center mb-4">Signup</h2>

            {/* Error Message */}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="form-group">
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
              <div className="form-group">
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

              {/* Signup Button */}
              <button
                type="submit"
                className="btn btn-success w-100 mt-3"
                disabled={loading}
              >
                {loading ? "Signing up..." : "Signup"}
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-3">
              <p>
                Already have an account?{" "}
                <Link className="text-success" to="/login">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
