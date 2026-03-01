import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      await API.post("/auth/register", {
        name,
        email,
        password,
      });

      // ✅ Do NOT store token / user here
      // ✅ Login will handle that

      navigate("/login");

    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">

          <div className="card shadow">
            <div className="card-body p-4">

              <h4 className="text-center mb-4 fw-bold">
                Create Account
              </h4>

              {error && (
                <div className="alert alert-danger py-2">
                  {error}
                </div>
              )}

              <form onSubmit={submitHandler}>

                <div className="mb-3">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100"
                  disabled={loading}
                >
                  {loading ? "Please wait..." : "Register"}
                </button>
              </form>

              <div className="text-center mt-3">
                <small>
                  Already have an account?{" "}
                  <Link to="/login">Login</Link>
                </small>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}