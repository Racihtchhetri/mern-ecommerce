import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
    FaTachometerAlt,
    FaBoxOpen,
    FaShoppingCart,
    FaPlusCircle,
    FaSignOutAlt
} from "react-icons/fa";

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

            <Link to="/admin" style={linkStyle}>
                <FaTachometerAlt style={iconStyle} />
                Dashboard
            </Link>

            <Link to="/admin/orders" style={linkStyle}>
                <FaShoppingCart style={iconStyle} />
                Orders
            </Link>

            <Link to="/admin/products/add" style={linkStyle}>
                <FaPlusCircle style={iconStyle} />
                Add Products
            </Link>

            <Link to="/admin/products" style={linkStyle}>
                <FaBoxOpen style={iconStyle} />
                Products
            </Link>

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
                <FaSignOutAlt style={iconStyle} />
                Logout
            </button>
        </div>
    );
}

const linkStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 20px",
    color: "#fff",
    textDecoration: "none",
    transition: "0.2s"
};

const iconStyle = {
    fontSize: "16px"
};