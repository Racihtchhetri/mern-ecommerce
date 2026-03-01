import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {

    const { user, token, logout } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [search, setSearch] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const s = params.get("search") || "";
        setSearch(s);
    }, [location.search]);

    const submitHandler = (e) => {
        e.preventDefault();

        const params = new URLSearchParams(location.search);
        if (search) params.set("search", search);
        else params.delete("search");

        navigate(`/?${params.toString()}`);
    };

    const logoutHandler = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">

                <Link className="navbar-brand fw-bold" to="/">
                    MERN-Shop
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNavbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="mainNavbar">

                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>

                        {token && (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/orders">My Orders</Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/cart">Cart</Link>
                                </li>
                            </>
                        )}
                    </ul>

                    { /* Search */}
                    <form className="d-flex me-3" onSubmit={submitHandler}>
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search Products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-outline-light" type="submit">
                            Search
                        </button>
                    </form>

                    <ul className="navbar-nav mb-2 mb-lg-0">
                        {!token ? (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/login">Login</Link>
                                </li>

                                <li className="nav-item">
                                    <Link className="nav-link" to="/register">Register</Link>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    href="/#"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                >
                                    {user?.name || "User"}
                                </a>

                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li>
                                        <Link className="dropdown-item" to="/orders">
                                            My Orders
                                        </Link>
                                    </li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button
                                            className="dropdown-item text-danger"
                                            onClick={logoutHandler}
                                        >
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        )}
                    </ul>


                </div>
            </div>
        </nav>
    );
}