import { Link } from "react-router-dom";

export default function Dashboard() {

    return (
        <div style={{ padding: 20 }}>
            <h2>Admin Dashboard</h2>

            <ul>
                <li>
                    <Link to="/admin/orders">Manager Orders</Link>
                </li>
            </ul>
        </div>
    );
}