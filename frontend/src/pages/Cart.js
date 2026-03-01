import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Cart() {

  const [cart, setCart] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const updateQty = (index, newQty) => {
    if (newQty < 1) return;

    const updated = [...cart];
    updated[index].qty = newQty;

    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const removeItem = (index) => {
    const updated = cart.filter((_, i) => i !== index);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h5>Your cart is empty</h5>
        <Link to="/" className="btn btn-outline-primary mt-3">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">

      <h4 className="mb-4 fw-semibold">Shopping Cart</h4>

      <div className="row">

        {/* LEFT : ITEMS */}
        <div className="col-md-8">

          {cart.map((item, index) => (

            <div
              key={index}
              className="card mb-3 border-0 shadow-sm"
            >
              <div className="card-body">

                <div className="row align-items-center">

                  <div className="col-3 col-md-2">
                    <img
                      src={item.image || "https://via.placeholder.com/120"}
                      className="img-fluid rounded"
                      alt=""
                    />
                  </div>

                  <div className="col-9 col-md-6">

                    <h6 className="mb-1">{item.name}</h6>

                    {item.size && item.color && (
                      <div className="text-muted small mb-2">
                        Size: {item.size} &nbsp;|&nbsp; Color: {item.color}
                      </div>
                    )}

                    <button
                      className="btn btn-link text-danger p-0 small"
                      onClick={() => removeItem(index)}
                    >
                      Remove
                    </button>

                  </div>

                  <div className="col-md-2 text-md-center mt-3 mt-md-0">

                    <div className="btn-group btn-group-sm">

                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => updateQty(index, item.qty - 1)}
                      >
                        −
                      </button>

                      <button className="btn btn-outline-secondary" disabled>
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

        {/* RIGHT : SUMMARY */}
        <div className="col-md-4">

          <div className="card border-0 shadow-sm">
            <div className="card-body">

              <h6 className="mb-3">Order Summary</h6>

              <div className="d-flex justify-content-between mb-2">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>

              <div className="d-flex justify-content-between mb-3">
                <strong>Total</strong>
                <strong>₹{total}</strong>
              </div>

              <Link
                to="/checkout"
                className="btn btn-warning w-100 fw-semibold"
              >
                Proceed to checkout
              </Link>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}