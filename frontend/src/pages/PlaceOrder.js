import { useLocation, useNavigate, Link } from "react-router-dom";

export default function PlaceOrder() {

    const { state } = useLocation();
    const navigate = useNavigate();

    const order = state?.order;
    // const payUrl = state?.payUrl;

    if (!order) {
        return (
            <div className="container py-5 text-center">
                <h4>No order found</h4>
                <Link to="/">Go Home</Link>
            </div>
        );
    }

    return (
        <div className="container py-5">

            <h3 className="mb-4">Order placed successfully</h3>

            <div className="card mb-4">
                <div className="card-body">

                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
                    <p><strong>Order Status:</strong> {order.orderStatus}</p>
                    <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>

                    {/* <p>
                        <strong>Payment Link:</strong>{" "}
                        <a href={payUrl} target="_blank" rel="noreferrer">
                            Open payment page
                        </a>
                    </p> */}

                </div>
            </div>

            <h5 className="mb-3">Items</h5>

            <div className="card">
                <div className="card-body">

                    {order.items.map((item, i) => (
                        <div key={i} className="d-flex justify-content-between mb-2">
                            <div>
                                {item.product}
                                <div className="text-muted small">
                                    {item.size} / {item.color} × {item.qty}
                                </div>
                            </div>
                            <div>₹{item.price * item.qty}</div>
                        </div>
                    ))}

                </div>
            </div>

            <div className="mt-4 d-flex gap-2">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate("/orders")}
                >
                    Go to My Orders
                </button>

                <Link to="/" className="btn btn-outline-secondary">
                    Continue shopping
                </Link>
            </div>

        </div>
    );
}