import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

export default function Checkout() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [address, setAddress] = useState({
        name: "",
        phone: "",
        addressLine1: "",
        city: "",
        state: "",
        pincode: ""
    });

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const totalAmount = cart.reduce(
        (sum, item) => sum + Number(item.price) * Number(item.qty),
        0
    );

    const placeOrderHandler = async (e) => {
        e.preventDefault();

        if (cart.length === 0) {
            setError("Your cart is empty");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // Format items for backend
            const formattedItems = cart.map(item => ({
                product: item.productId,
                size: item.size,
                color: item.color,
                qty: item.qty,
                price: Number(item.price)
            }));

            const res = await API.post("/payment/checkout", {
                items: formattedItems,
                address,
                totalAmount
            });

            const { payUrl, sessionId } = res.data;

            const paymentRes = await API.get(`/payment/pay/${sessionId}`);

            localStorage.removeItem("cart");

            navigate("/place-order", {
                state: {
                    order: paymentRes.data.order,
                    payUrl
                }
            });

        } catch (err) {
            setError(err.response?.data?.message || err.message || "Checkout failed");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setAddress({
            ...address,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="container py-4">

            <h3 className="mb-4">Checkout</h3>

            <div className="row">

                {/* Left – Address */}
                <div className="col-md-7 mb-4">
                    <div className="card">
                        <div className="card-body">

                            <h5 className="mb-3">Shipping Address</h5>

                            {error && (
                                <div className="alert alert-danger py-2">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={placeOrderHandler}>

                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        required
                                        value={address.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Phone</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phone"
                                        required
                                        value={address.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Address</label>
                                    <textarea
                                        className="form-control"
                                        name="addressLine1"
                                        rows="2"
                                        required
                                        value={address.addressLine1}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">City</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="city"
                                            required
                                            value={address.city}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">State</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="state"
                                            required
                                            value={address.state}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Pincode</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="pincode"
                                        required
                                        value={address.pincode}
                                        onChange={handleChange}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-success w-100"
                                    disabled={loading}
                                >
                                    {loading ? "Processing..." : "Proceed to Payment"}
                                </button>

                            </form>

                        </div>
                    </div>
                </div>

                {/* Right – Order summary */}
                <div className="col-md-5">
                    <div className="card">
                        <div className="card-body">

                            <h5 className="mb-3">Order Summary</h5>

                            {cart.length === 0 && (
                                <p className="text-muted">Your cart is empty</p>
                            )}

                            {cart.map((item) => (
                                <div
                                    key={item.productId}
                                    className="d-flex justify-content-between mb-2"
                                >
                                    <div>
                                        <div className="fw-semibold">{item.name}</div>
                                        <small className="text-muted">Qty: {item.qty}</small>
                                    </div>

                                    <div>₹{item.price * item.qty}</div>
                                </div>
                            ))}

                            <hr />

                            <div className="d-flex justify-content-between fw-bold">
                                <span>Total</span>
                                <span>₹{totalAmount}</span>
                            </div>

                            <div className="mt-3">
                                <Link to="/cart" className="btn btn-outline-secondary w-100">
                                    Back to Cart
                                </Link>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}