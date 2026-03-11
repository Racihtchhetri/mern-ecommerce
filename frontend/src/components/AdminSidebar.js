import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminSidebar({ open }) {

    const { logout } = useAuth();

    return (
        <div style={{
            width: open ? "220px" : "0px",
            height: "100vh",
            background: "#111",
            color: "#fff",
            overflow: "hidden",
            transition: "0.3s",
            position: "fixed",
            top: 60,
            left: 0,
            paddingTop: 20
        }}>

            <Link to="/admin" style={linkStyle}>Dashboard</Link>

            <Link to="/admin/orders" style={linkStyle}>Orders</Link>

            <Link to="/admin/products/add" style={linkStyle}>Add Products</Link>

            <Link to="/admin/products" style={linkStyle}>Products</Link>

            <button
            onClick={logout}
            style={{
                ...linkStyle,
                background: "none",
                border: "none",
                textAlign: "left",
                width: "100%",
                cursor: "pointer"
            }}
            >
                Logout
            </button>
        </div>
   );
}

const linkStyle = {
    display: "block",
    padding: "12px 20px",
    color: "#fff",
    textDecoration: "none"
};