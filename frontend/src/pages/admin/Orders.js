import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";

export default function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const navigate = useNavigate();

    useEffect(() => {

        const loadOrder = async () => {
            try {
                const res = await API.get("/admin/orders");
                setOrders(res.data);
            } catch (err) {
                alert("Failed to load admin orders");
            } finally {
                setLoading(false);
            }
        };

        loadOrder();
    }, []);

    const deleteOrder = async (id) => {

        if (!window.confirm("Delete this order?")) return;

        try {
            await API.delete(`/admin/orders/${id}`);
            setOrders(orders.filter(o => o._id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    const totalPages = Math.ceil(orders.length / perPage);

    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    const currentOrders = orders.slice(startIndex, endIndex);

    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const handlePerPageChange = (e) => {
        setPerPage(Number(e.target.value));
        setPage(1);
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div style={{ padding: 20 }}>
            <h2>All Orders</h2>

            <div style={{ marginBottom: 10 }}>
                Show&nbsp;
                <select value={perPage} onChange={handlePerPageChange}>
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
                &nbsp;orders
            </div>

            <table className="table table-hover" border="1" cellPadding="8" width="100%">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Order ID</th>
                        <th>Name</th>
                        <th>E-mail</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {currentOrders.length === 0 && (
                        <tr>
                            <td colSpan="7" align="center">
                                No orders found
                            </td>
                        </tr>
                    )}

                    {currentOrders.map((o, i) => (
                        <tr key={o._id}>

                            <td>{startIndex + i + 1}</td>

                            <td>{o._id}</td>

                            <td>{o.user.name}</td>

                            <td>{o.user?.email}</td>

                            <td>₹{o.totalAmount}</td>

                            <td>{o.paymentStatus}</td>

                            <td>{new Date(o.createdAt).toLocaleString()}</td>

                            <td>

                                <button
                                    className="btn btn-info"
                                    onClick={() => navigate(`/admin/orders/${o._id}`)}
                                >
                                    View
                                </button>

                                &nbsp;

                                <button
                                    className="btn btn-danger"
                                    style={{ background: "red", color: "white" }}
                                    onClick={() => deleteOrder(o._id)}
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>
                    ))}

                </tbody>
            </table>

            <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 10 }}>
                <button className="btn btn-warning" onClick={handlePrev} disabled={page === 1}>
                    Previous
                </button>

                <span>
                    Page {page} of {totalPages || 1}
                </span>

                <button className="btn btn-primary" onClick={handleNext} disabled={page === totalPages || totalPages === 0}>
                    Next
                </button>
            </div>
        </div>
    );
}