import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import API from "../api";

export default function Home() {

  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    category: "",
    color: "",
    size: "",
    maxPrice: 5000,
  });

  // read search from navbar (URL)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("search") || "";
    setSearch(s);
  }, [location.search]);

  useEffect(() => {
    API.get("/products")
      .then((res) => {
        const active = res.data.filter((p) => p.isActive !== false);
        setProducts(active);
      })
      .catch((err) => console.error(err));
  }, []);

  const matchVariant = (product, key, value) => {
    if (!value) return true;
    if (!product.variants || product.variants.length === 0) return false;

    return product.variants.some(
      (v) =>
        String(v[key]).toLowerCase() === String(value).toLowerCase()
    );
  };

  const filteredProducts = products.filter((p) => {

    const matchSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase());

    const matchCategory = filters.category
      ? p.category === filters.category
      : true;

    const matchColor = matchVariant(p, "color", filters.color);
    const matchSize = matchVariant(p, "size", filters.size);

    const matchPrice =
      Number(p.basePrice) <= Number(filters.maxPrice);

    return (
      matchSearch &&
      matchCategory &&
      matchColor &&
      matchSize &&
      matchPrice
    );
  });

  const addToCart = (product) => {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = {
      productId: product._id,
      name: product.name,
      price: product.basePrice,
      qty: 1,
      image: product.images?.[0] || null,
    };

    const exist = cart.find(
      (i) => i.productId === product._id
    );

    if (exist) exist.qty += 1;
    else cart.push(item);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart");
  };

  return (
    <div className="container py-4">

      {/* Only Cart button here (search is in navbar) */}
      <div className="d-flex justify-content-end align-items-center mb-4">
        <Link
          to="/cart"
          className="btn btn-outline-dark position-relative"
          style={{ borderRadius: "50px" }}
        >
          <FaShoppingCart size={18} />
          <span className="ms-2">Cart</span>
        </Link>
      </div>

      <div className="row">

        {/* Filters */}
        <div className="col-md-3 mb-4">
          <div className="card p-3">
            <h5 className="mb-3">Filters</h5>

            {/* Category */}
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={filters.category}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    category: e.target.value,
                  })
                }
              >
                <option value="">All</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </div>

            {/* Color */}
            <div className="mb-3">
              <label className="form-label">Color</label>
              <select
                className="form-select"
                value={filters.color}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    color: e.target.value,
                  })
                }
              >
                <option value="">All</option>
                <option value="Red">Red</option>
                <option value="Blue">Blue</option>
                <option value="Black">Black</option>
                <option value="Green">Green</option>
              </select>
            </div>

            {/* Size */}
            <div className="mb-3">
              <label className="form-label">Size</label>
              <select
                className="form-select"
                value={filters.size}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    size: e.target.value,
                  })
                }
              >
                <option value="">All</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="form-label">
                Max Price: ₹{filters.maxPrice}
              </label>
              <input
                type="range"
                className="form-range"
                min="0"
                max="5000"
                step="100"
                value={filters.maxPrice}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    maxPrice: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="col-md-9">
          <div className="row">

            {filteredProducts.length === 0 && (
              <p>No products found</p>
            )}

            {filteredProducts.map((p) => (
              <div
                key={p._id}
                className="col-sm-6 col-md-4 col-lg-3 mb-4"
              >
                <div className="card h-100">

                  <Link to={`/product/${p._id}`}>
                    <img
                      src={
                        p.images?.[0] ||
                        "https://via.placeholder.com/300x200.png?text=No+Image"
                      }
                      className="card-img-top"
                      alt={p.name}
                      style={{
                        height: 200,
                        objectFit: "cover",
                      }}
                    />
                  </Link>

                  <div className="card-body text-center">
                    <h6>{p.name}</h6>
                    <p className="mb-1">₹{p.basePrice}</p>
                    <small className="text-muted">
                      {p.category}
                    </small>

                    <div className="mt-2">
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => addToCart(p)}
                      >
                        Add to cart
                      </button>

                      <Link
                        to={`/product/${p._id}`}
                        className="btn btn-sm btn-outline-secondary"
                      >
                        View
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}