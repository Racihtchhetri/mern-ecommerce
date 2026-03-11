import { useAuth } from "../context/AuthContext";

export default function AdminNavbar({ toggleSidebar }) {

    const { user } = useAuth();

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "60px",
                background: "#202020",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                zIndex: 1000,
                boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
            }}
        >

            <div style={{ display: "flex", alignItems: "center", gap: 15 }}>

                <button
                    onClick={toggleSidebar}
                    style={{
                        fontSize: 22,
                        background: "none",
                        border: "none",
                        color: "#fff",
                        cursor: "pointer"
                    }}
                >
                    ☰
                </button>

                <h3 style={{ margin: 0 }}>Admin Panel</h3>

            </div>

            <div>
                Welcome, <b>{user?.name}</b>
            </div>

        </div>
    );
}