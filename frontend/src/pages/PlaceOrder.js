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

                        <div
                            key={i}
                            className="d-flex align-items-center mb-3"
                        >

                            {/* Product Image */}
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{
                                    width: "60px",
                                    height: "60px",
                                    objectFit: "cover",
                                    marginRight: "10px",
                                    borderRadius: "6px"
                                }}
                            />

                            {/* Product Details */}
                            <div className="flex-grow-1">

                                <div className="fw-semibold">
                                    {item.name || item.product}
                                </div>

                                <div className="text-muted small">
                                    Size: {item.size} | Color: {item.color}
                                </div>

                                <div className="text-muted small">
                                    ₹{item.price} × {item.qty}
                                </div>

                            </div>

                            {/* Item Total */}
                            <div className="fw-semibold">
                                ₹{item.price * item.qty}
                            </div>

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