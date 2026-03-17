import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";

export default function ProductDetails() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => setProduct(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!product) return <p className="p-4">Loading...</p>;

  const variants = product.variants || [];

  const sizes = [...new Set(variants.map(v => v.size))];
  const colors = [...new Set(variants.map(v => v.color))];

  // Selected Variant
  const selectedVariant = variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  );

  // Check stock availability
  const isVariantAvailable = (size, color) => {
    return variants.some(v =>
      (!size || v.size === size) &&
      (!color || v.color === color) &&
      v.stock > 0
    );
  };

  // Variant price
  const price = selectedVariant?.price || product.basePrice;

  // Variant image
  const image =
    selectedVariant?.image
      ? `http://localhost:5000/uploads/${selectedVariant.image}`
      : product.images?.gallery?.length
        ? `http://localhost:5000/uploads/${product.images.gallery[0]}`
        : "https://via.placeholder.com/400x300";

  const addToCart = () => {

    if (!selectedSize || !selectedColor) {
      alert("Please select size and color");
      return;
    }

    const variant = variants.find(
      v => v.size === selectedSize && v.color === selectedColor
    );

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = {
      productId: product._id,
      name: product.name,
      price: variant?.price || product.basePrice,
      qty,
      size: selectedSize,
      color: selectedColor,
      image: variant?.image
        ? `http://localhost:5000/uploads/${variant.image}`
        : `http://localhost:5000/uploads/${product.images?.gallery?.[0]}`
    };

    const exist = cart.find(
      i =>
        i.productId === product._id &&
        i.size === selectedSize &&
        i.color === selectedColor
    );

    if (exist) exist.qty += qty;
    else cart.push(item);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart");
  };

  return (
    <div className="container py-4">

      <div className="row">

        {/* IMAGE */}
        <div className="col-md-5 text-center">

          <img
            src={image}
            className="img-fluid w-75 rounded shadow-sm"
            alt={product.name}
          />

        </div>

        {/* DETAILS */}
        <div className="col-md-7">

          <h3>{product.name}</h3>

          <p className="text-muted">
            {product.category} / {product.subCategory}
          </p>

          <h5 className="mb-3">₹{price}</h5>

          {/* SIZE */}
          <div className="mb-3">
            <strong>Size</strong>

            <div className="d-flex flex-wrap gap-2 mt-2">

              {sizes.map(s => {

                const disabled = !isVariantAvailable(s, selectedColor);

                return (
                  <button
                    key={s}
                    type="button"
                    disabled={disabled}
                    className={`btn btn-sm ${selectedSize === s
                        ? "btn-dark"
                        : "btn-outline-dark"
                      }`}
                    onClick={() =>
                      setSelectedSize(prev => (prev === s ? "" : s))
                    }
                  >
                    {s}
                  </button>
                );
              })}

            </div>
          </div>

          {/* COLOR */}
          <div className="mb-3">

            <strong>Color</strong>

            <div className="d-flex flex-wrap gap-2 mt-2">

              {colors.map(c => {

                const disabled = !isVariantAvailable(selectedSize, c);

                return (
                  <button
                    key={c}
                    type="button"
                    disabled={disabled}
                    className={`btn btn-sm ${selectedColor === c
                        ? "btn-primary"
                        : "btn-outline-primary"
                      }`}
                    onClick={() =>
                      setSelectedColor(prev => (prev === c ? "" : c))
                    }
                  >
                    {c}
                  </button>
                );
              })}

            </div>
          </div>

          {/* QUANTITY */}
          <div className="mb-4">

            <strong>Quantity</strong>

            <div className="d-flex align-items-center gap-2 mt-2">

              <button
                className="btn btn-outline-secondary"
                onClick={() => setQty(q => Math.max(1, q - 1))}
              >
                −
              </button>

              <span style={{ minWidth: 30, textAlign: "center" }}>
                {qty}
              </span>

              <button
                className="btn btn-outline-secondary"
                onClick={() => setQty(q => q + 1)}
              >
                +
              </button>

            </div>

          </div>

          { /* Description */}

          <div className="mb-4">

            <strong>Description</strong>

            <div className="d-flex align-items-center gap-2 mt-2">

              <p> {product.description} </p>

            </div>

          </div>

          <button
            className="btn btn-warning"
            onClick={addToCart}
          >
            Add to Cart
          </button>

        </div>

      </div>

    </div>
  );
}