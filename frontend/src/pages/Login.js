import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import { useAuth } from "../context/AuthContext"; // ✅ import context

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ get login function

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      // ✅ call login from AuthContext to update state & localStorage
      login(res.data.user, res.data.token);

      navigate("/"); // redirect to home

    } catch (err) {
      setError(err.response?.data?.message || "Login Failed");
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
              <h4 className="text-center mb-4 fw-bold">Login</h4>

              {error && (
                <div className="alert alert-danger py-2">{error}</div>
              )}

              <form onSubmit={submitHandler}>
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
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Please wait..." : "Login"}
                </button>
              </form>

              <div className="text-center mt-3">
                <small>
                  Don't have an account? <Link to="/register">Register</Link>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}