import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Dashboard() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchItems = async () => {
      try {
        const res = await axios.get(`${API_URL}/auctions`);

        const now = Date.now();
        const updated = res.data.map((item) => ({
          ...item,
          isClosed: new Date(item.closingTime).getTime() <= now
        }));

        setItems(updated);
      } catch (err) {
        console.error("Error fetching auctions", err);
      }
    };

    fetchItems();

    // auto refresh every 30 seconds
    const interval = setInterval(fetchItems, 30000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Auction Dashboard</h2>

      <Link to="/post-auction">
        <button style={{ marginBottom: "15px" }}>Post New Auction</button>
      </Link>

      <ul>
        {items.map((item) => (
          <li key={item._id} style={{ marginBottom: "12px" }}>
            <Link to={`/auction/${item._id}`}>
              <strong>{item.itemName}</strong> — ₹{item.currentBid}
            </Link>

            <span
              style={{
                marginLeft: "10px",
                padding: "3px 8px",
                borderRadius: "6px",
                fontSize: "12px",
                color: "white",
                backgroundColor: item.isClosed ? "red" : "green"
              }}
            >
              {item.isClosed ? "Closed" : "Open"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
