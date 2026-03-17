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

  // Read search from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const s = params.get("search") || "";
    setSearch(s);
  }, [location.search]);

  // Fetch products
  useEffect(() => {

    API.get("/products")
      .then((res) => {

        const activeProducts = res.data.filter(
          (p) => p.isActive !== false
        );

        setProducts(activeProducts);

      })
      .catch((err) => console.error(err));

  }, []);

  // Variant matching helper
  const matchVariant = (product, key, value) => {

    if (!value) return true;

    if (!product.variants || product.variants.length === 0)
      return false;

    return product.variants.some(
      (v) =>
        String(v[key]).toLowerCase() ===
        String(value).toLowerCase()
    );
  };

  // Filtering logic
  const filteredProducts = products.filter((p) => {

    const matchSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      !filters.category || p.category === filters.category;

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

  return (

    <div className="container py-4">

      {/* Cart button */}
      <div className="d-flex justify-content-end mb-4">

        <Link
          to="/cart"
          className="btn btn-outline-dark"
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

                {[...new Set(products.map(p => p.category))]
                  .filter(Boolean)
                  .map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}

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

                {[...new Set(
                  products.flatMap(p =>
                    p.variants?.map(v => v.color)
                  )
                )]
                  .filter(Boolean)
                  .map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}

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

                {[...new Set(
                  products.flatMap(p =>
                    p.variants?.map(v => v.size)
                  )
                )]
                  .filter(Boolean)
                  .map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}

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

            {filteredProducts.map((p) => {

              const image =
                p.variants?.[0]?.image
                ? `http://localhost:5000/uploads/${p.variants[0].image}`
                : p.images?.gallery?.[0]
                ? `http://localhost:5000/uploads/${p.images.gallery[0]}`
                : `https://via.placeholder.com/300x200.png?text=No+Image`;

              return (

                <div
                  key={p._id}
                  className="col-sm-6 col-md-4 col-lg-3 mb-4"
                >

                  <div className="card h-100">

                    <Link to={`/product/${p._id}`}>

                      <img
                        src={image}
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

              );

            })}

          </div>

        </div>

      </div>

    </div>
  );
}