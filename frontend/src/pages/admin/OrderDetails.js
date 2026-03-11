import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api";

export default function OrderDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);

    useEffect(() => {
        const loadOrder = async () => {
            const res = await API.get(`/admin/orders/${id}`);
            setOrder(res.data);
        };
        loadOrder();
    }, [id]);

    const updateStatus = async (status) => {
        await API.put(`/admin/orders/${id}`, { status });
        setOrder({ ...order, paymentStatus: status });
        alert("Status Updated");
    };

    const deleteOrder = async () => {
        if (!window.confirm("Delete this order?")) return;

        await API.delete(`/admin/orders/${id}`);

        alert("Order Deleted");
        navigate("/admin/orders");
    };

    if (!order) return <p>Loading...</p>;

    const orderStatusColor = {
        placed: "#f39c12",
        packed: "#3498db",
        shipped: "#9b59b6",
        delivered: "#2ecc71",
        cancelled: "#cc2e2e"
    };

    const paymentStatusColor = {
        failed: "#cc2e2e",
        pending: "#f39c12",
        paid: "#2ecc71"
    }

    return (
        <div style={{ padding: 30, background: "#f5f6fa", minHeight: "100vh" }}>

            <h2 style={{ marginBottom: 20 }}>📦 Order Details</h2>

            {/* Order Info Card */}

            <div style={{
                background: "white",
                padding: 20,
                borderRadius: 8,
                marginBottom: 20,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}>

                <p><b>Order ID:</b> {order._id}</p>
                <p><b>Customer:</b> {order.user?.name}</p>
                <p><b>Email:</b> {order.user?.email}</p>
                <p><b>Total Amount:</b> ₹{order.totalAmount}</p>

                <p>
                    <b>Payment Status:</b>
                    <span style={{
                        marginLeft: 10,
                        padding: "4px 10px",
                        borderRadius: 20,
                        background: paymentStatusColor[order.paymentStatus],
                        color: "white",
                        fontSize: 12
                    }}>
                        {order.paymentStatus}
                    </span>
                </p>
                <p><b>Order Status:</b>
                <span style={{
                        marginLeft: 10,
                        padding: "4px 10px",
                        borderRadius: 20,
                        background: orderStatusColor[order.orderStatus],
                        color: "white",
                        fontSize: 12
                    }}>
                        {order.orderStatus}
                    </span></p>

                <p><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>

            </div>


            {/* Products */}

            <div style={{
                background: "white",
                padding: 20,
                borderRadius: 8,
                marginBottom: 20,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}>

                <h3>🛒 Products</h3>

                <table
                    width="100%"
                    style={{
                        borderCollapse: "collapse",
                        marginTop: 10
                    }}
                >
                    <thead style={{ background: "#2f3640", color: "white" }}>
                        <tr>
                            <th style={{ padding: 10 }}>Product</th>
                            <th style={{ padding: 10 }}>Price</th>
                            <th style={{ padding: 10 }}>Qty</th>
                        </tr>
                    </thead>

                    <tbody>
                        {order.items.map((item, i) => (
                            <tr key={i} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: 10 }}>{item.name}</td>
                                <td style={{ padding: 10 }}>₹{item.price}</td>
                                <td style={{ padding: 10 }}>{item.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>


            {/* Status Update */}

            <div style={{
                background: "white",
                padding: 20,
                borderRadius: 8,
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
            }}>

                <h3>⚙ Update Order Status</h3>

                <select
                    value={order.paymentStatus}
                    onChange={(e) => updateStatus(e.target.value)}
                    style={{
                        padding: 10,
                        marginTop: 10,
                        borderRadius: 5,
                        border: "1px solid #ccc"
                    }}
                >
                    <option>Placed</option>
                    <option>Packed</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                </select>

                <br /><br />

                <button
                    onClick={deleteOrder}
                    style={{
                        background: "#e74c3c",
                        color: "white",
                        padding: "10px 18px",
                        border: "none",
                        borderRadius: 5,
                        cursor: "pointer"
                    }}
                >
                    🗑 Delete Order
                </button>

            </div>

        </div>
    );
}