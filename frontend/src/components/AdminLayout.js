import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout() {

    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div>

            <AdminNavbar toggleSidebar={toggleSidebar} />

            <AdminSidebar open={sidebarOpen} />

            <div style={{
                marginLeft: sidebarOpen ? "220px" : "0",
                marginTop: "60px",
                padding: 20,
                transition: "0.3s"
            }}
            >
                <Outlet />

            </div>
        </div>
    );
}