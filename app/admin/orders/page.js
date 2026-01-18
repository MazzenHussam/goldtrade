"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/Lib/supabase";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setOrders(data);
      setLoading(false);
    }
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    }
  };

  return (
    <main className="bg-light min-vh-100">
      <Navbar />
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0">Customer <span className="text-gold">Orders</span></h2>
          <Link href="/admin" className="btn btn-sm btn-outline-dark">Back to Products</Link>
        </div>

        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead className="bg-dark text-white">
                <tr>
                  <th className="ps-4">Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="6" className="text-center py-5">Loading orders...</td></tr>
                ) : orders.map((order) => (
                  <tr key={order.id}>
                    <td className="ps-4 fw-bold text-muted">#{order.id}</td>
                    <td>
                      <div className="fw-bold">{order.customer_name}</div>
                      <small className="text-muted">{order.customer_phone}</small>
                      <div className="mt-1 small border-top pt-1 text-secondary" style={{ maxWidth: '200px' }}>
    <i className="bi bi-geo-alt-fill me-1"></i> {order.customer_address || "No address provided"}
  </div>
                    </td>
                    <td>
                      {order.items.map((item, index) => (
                        <div key={index} className="small text-truncate" style={{ maxWidth: "150px" }}>
                          • {item.title} ({item.weight}g)
                        </div>
                      ))}
                    </td>
                    <td className="fw-bold text-gold">{order.total_amount} EGP</td>
                    <td>
                      <span className={`badge ${order.status === 'Completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <select 
                        className="form-select form-select-sm d-inline-block w-auto"
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        value={order.status}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}