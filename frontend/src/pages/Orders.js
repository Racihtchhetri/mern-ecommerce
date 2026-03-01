import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Orders() {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchOrders = async () => {
            try {
                const res = await API.get("/orders/my");
                setOrders(res.data);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to load orders"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();

    }, []);

    const badgeClass = (status) => {
        if (status === "paid") return "bg-success";
        if (status === "pending") return "bg-warning text-dark";
        return "bg-secondary";
    };

    if (loading) {
        return (
            <div className="container py-5 text-center">
                Loading orders...
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5 text-center text-danger">
                {error}
            </div>
        );
    }

    return (
        <div className="container py-5">

            <h3 className="mb-4">My Orders</h3>

            {orders.length === 0 && (
                <p className="text-muted">You have no orders yet.</p>
            )}

            {orders.map(order => (
                <div key={order._id} className="card mb-3 shadow-sm">

                    {/* ---------- Order header ---------- */}
                    <div className="card-body">

                        <div className="row align-items-center">

                            <div className="col-md-4 mb-2 mb-md-0">
                                <div className="small text-muted">Order ID</div>
                                <div className="fw-semibold">
                                    {order._id}
                                </div>
                            </div>

                            <div className="col-md-2 mb-2 mb-md-0">
                                <div className="small text-muted">Placed on</div>
                                <div>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="col-md-2 mb-2 mb-md-0">
                                <div className="small text-muted">Payment</div>
                                <span className={`badge ${badgeClass(order.paymentStatus)}`}>
                                    {order.paymentStatus}
                                </span>
                            </div>

                            <div className="col-md-2 mb-2 mb-md-0">
                                <div className="small text-muted">Order status</div>
                                <span className="badge bg-info text-dark">
                                    {order.orderStatus}
                                </span>
                            </div>

                            <div className="col-md-2 text-md-end">
                                <div className="fw-bold">
                                    ₹{order.totalAmount}
                                </div>
                                <button
                                    className="btn btn-link p-0 mt-1 text-decoration-none"
                                    onClick={() => navigate(`/orders/${order._id}`)}
                                >
                                    View details
                                </button>
                            </div>

                        </div>

                    </div>
                </div>
            ))}

            <div className="mt-4">
                <Link to="/" className="btn btn-outline-secondary">
                    Continue shopping
                </Link>
            </div>

        </div>
    );
}