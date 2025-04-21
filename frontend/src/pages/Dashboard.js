import React, { useEffect, useState } from "react";
import api from "../api";
import PaymentForm from "../components/PaymentForm";

const Dashboard = () => {
  const [history, setHistory] = useState([]);
  const [reload, setReload] = useState(false);
  const user = JSON.parse(localStorage.getItem("user")); // Assuming you store user info
  const userId = user?.id;
  const userEmail = user?.email;

  useEffect(() => {
    if (userId) {
      api
        .get(`/payments/history/${userId}`)
        .then((res) => setHistory(res.data));
    }
  }, [userId, reload]);

  return (
    <div className="container mt-5">
      <h2>Welcome to the Dashboard</h2>
      <p>You are logged in ✅</p>
      <PaymentForm
        userEmail={userEmail}
        onPaymentSuccess={() => setReload((r) => !r)}
      />
      <h4 className="mt-5">Payment History</h4>
      <div className="table-responsive mt-3">
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((p) => (
              <tr key={p._id}>
                <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                <td>${(p.amount / 100).toFixed(2)}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
