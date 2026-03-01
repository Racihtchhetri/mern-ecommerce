import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

export default function OrderDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchOrder = async () => {
            try {
                const res = await API.get(`/orders/${id}`);
                setOrder(res.data.order || res.data);
            } catch (err) {
                setError("Unable to load order");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();

    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>;
    if (!order) return null;

    return (
        <div className="container py-4">

            <button
                className="btn btn-sm btn-outline-secondary mb-3"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>

            <h4>Order Details</h4>

            <div className="card p-3 mb-3">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.orderStatus}</p>
                <p><strong>Payment:</strong> {order.paymentStatus}</p>
                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
            </div>

            <h5>Items</h5>

            {order.items?.map((item, index) => (
                <div key={index} className="card p-2 mb-2">
                    <div className="d-flex justify-content-between">
                        <div>
                            <div><strong>{item.name}</strong></div>
                            <div>Color: {item.color}</div>
                            <div>Size: {item.size}</div>
                            <div>Qty: {item.qty}</div>
                        </div>

                        <div>
                            ₹{item.price}
                        </div>
                    </div>
                </div>
            ))}

            <h5 className="mt-4">Shipping Address</h5>

            {order.shippingAddress ? (
                <div className="card p-3">
                    <div>{order.shippingAddress?.name}</div>
                    <div>{order.shippingAddress?.phone}</div>
                    <div>
                        {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city},
                        {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                    </div>
                </div>
            ) : (
                <div className="alert alert-warning">
                    Shipping address not available for this order.
                </div>
            )}
        </div>
    );
};