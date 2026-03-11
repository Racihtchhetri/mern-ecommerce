import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api";

export default function Products() {

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    category: "",
    status: ""
  });

  const [page, setPage] = useState(1);

  const limit = 10;

  const fetchProducts = async () => {

    try {

      const res = await API.get("/products");

      setProducts(res.data);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    fetchProducts();

  }, []);

  const deleteProduct = async (id) => {

    if (!window.confirm("Delete this product?")) return;

    try {

      await API.delete(`/admin/products/${id}`);

      fetchProducts();

    } catch (err) {

      alert("Delete failed");

    }

  };

  // Filtering
  const filtered = products.filter((p) => {

    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      filters.category === "" || p.category === filters.category;

    const matchStatus =
      filters.status === "" ||
      (filters.status === "active" && p.isActive) ||
      (filters.status === "inactive" && !p.isActive);

    return matchSearch && matchCategory && matchStatus;

  });

  const totalPages = Math.ceil(filtered.length / limit);

  const start = (page - 1) * limit;

  const paginated = filtered.slice(start, start + limit);

  return (

    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-3">

        <h3>Products</h3>

        <Link to="/admin/products/add" className="btn btn-primary">
          + Add Product
        </Link>

      </div>

      {/* Filters */}

      <div className="card mb-3">

        <div className="card-body">

          <div className="row">

            <div className="col-md-4">

              <input
                className="form-control"
                placeholder="Search product"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            <div className="col-md-3">

              <select
                className="form-select"
                value={filters.category}
                onChange={(e) =>
                  setFilters({ ...filters, category: e.target.value })
                }
              >

                <option value="">All Categories</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>

              </select>

            </div>

            <div className="col-md-3">

              <select
                className="form-select"
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
              >

                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>

              </select>

            </div>

          </div>

        </div>

      </div>

      {/* Table */}

      <div className="card">

        <div className="table-responsive">

          <table className="table table-striped align-middle">

            <thead className="table-dark">

              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {paginated.map((p) => {

                const stock = p.variants.reduce(
                  (sum, v) => sum + (v.stock || 0),
                  0
                );

                return (

                  <tr key={p._id}>

                    <td>

                      {p.images?.gallery?.length > 0 && (

                        <img
                          src={`http://localhost:5000/uploads/${p.images.gallery[0]}`}
                          alt=""
                          width="50"
                        />

                      )}

                    </td>

                    <td>{p.name}</td>

                    <td>{p.category}</td>

                    <td>₹{p.basePrice}</td>

                    <td>{stock}</td>

                    <td>

                      {p.isActive ? (

                        <span className="badge bg-success">
                          Active
                        </span>

                      ) : (

                        <span className="badge bg-secondary">
                          Inactive
                        </span>

                      )}

                    </td>

                    <td>

                      <Link
                        to={`/admin/products/${p._id}`}
                        className="btn btn-sm btn-info me-1"
                      >
                        View
                      </Link>

                      <Link
                        to={`/admin/products/edit/${p._id}`}
                        className="btn btn-sm btn-warning me-1"
                      >
                        Edit
                      </Link>

                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteProduct(p._id)}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                );

              })}

            </tbody>

          </table>

        </div>

      </div>

      {/* Pagination */}

      <div className="d-flex justify-content-center mt-3">

        <nav>

          <ul className="pagination">

            {[...Array(totalPages)].map((_, i) => (

              <li
                key={i}
                className={`page-item ${page === i + 1 ? "active" : ""}`}
              >

                <button
                  className="page-link"
                  onClick={() => setPage(i + 1)}
                >

                  {i + 1}

                </button>

              </li>

            ))}

          </ul>

        </nav>

      </div>

      <div className="text-center">

        Page {page} of {totalPages}

      </div>

    </div>

  );

}