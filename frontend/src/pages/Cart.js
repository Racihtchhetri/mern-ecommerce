import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Cart() {

  const [cart, setCart] = useState([]);

  // Load cart
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Update quantity
  const updateQty = (index, newQty) => {

    if (newQty < 1) return;

    const updatedCart = [...cart];
    updatedCart[index].qty = newQty;

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Remove item
  const removeItem = (index) => {

    const updatedCart = cart.filter((_, i) => i !== index);

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Total price
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  // Total quantity
  const totalItems = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h5>Your cart is empty</h5>

        <Link to="/" className="btn btn-outline-primary mt-3">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">

      <h4 className="mb-4 fw-semibold">Shopping Cart</h4>

      <div className="row">

        {/* LEFT ITEMS */}
        <div className="col-md-8">

          {cart.map((item, index) => (

            <div key={index} className="card mb-3 border-0 shadow-sm">

              <div className="card-body">

                <div className="row align-items-center">

                  {/* IMAGE */}
                  <div className="col-3 col-md-2">

                    <img
                      src={item.image || "https://via.placeholder.com/120"}
                      className="img-fluid rounded"
                      alt={item.name}
                    />

                  </div>

                  {/* PRODUCT INFO */}
                  <div className="col-9 col-md-6">

                    <h6 className="mb-1">{item.name}</h6>

                    {(item.size || item.color) && (
                      <div className="text-muted small mb-2">
                        {item.size && `Size: ${item.size}`} 
                        {item.size && item.color && " | "}
                        {item.color && `Color: ${item.color}`}
                      </div>
                    )}

                    <button
                      className="btn btn-link text-danger p-0 small"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>

                  </div>

                  {/* QTY */}
                  <div className="col-md-2 text-md-center mt-3 mt-md-0">

                    <div className="btn-group btn-group-sm">

                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateQty(index, item.qty - 1)}
                      >
                        -
                      </button>

                      <button
                        className="btn btn-outline-secondary"
                        disabled
                      >
                        {item.qty}
                      </button>

                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateQty(index, item.qty + 1)}
                      >
                        +
                      </button>

                    </div>

                  </div>

                  {/* PRICE */}
                  <div className="col-md-2 text-end mt-3 mt-md-0">

                    <div className="fw-semibold">
                      ₹{item.price * item.qty}
                    </div>

                    <div className="text-muted small">
                      ₹{item.price} each
                    </div>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* RIGHT SUMMARY */}
        <div className="col-md-4">

          <div className="card border-0 shadow-sm">

            <div className="card-body">

              <h6 className="mb-3">Order Summary</h6>

              <div className="d-flex justify-content-between mb-2">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong>₹{totalPrice}</strong>
              </div>

              <Link
                to="/checkout"
                className="btn btn-warning w-100 fw-semibold"
              >
                Proceed to Checkout
              </Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}