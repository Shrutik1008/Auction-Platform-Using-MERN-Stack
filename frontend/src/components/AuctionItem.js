import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function AuctionItem() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState({});
  const [bid, setBid] = useState("");
  const [message, setMessage] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState(null);
  const [timeLeft, setTimeLeft] = useState("Loading...");

  const timerRef = useRef(null); // ✅ important

  // 🔐 Decode userId from JWT
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.userId;
    } catch {
      return null;
    }
  };

  // 📦 Fetch auction
  useEffect(() => {
    const fetchItem = async () => {
      try {
        setLoggedInUserId(getUserIdFromToken());
        const res = await axios.get(`${API_URL}/auctions/${id}`);
        setItem(res.data);
      } catch {
        setMessage("Error fetching auction item");
      }
    };

    fetchItem();
  }, [id]);

  // ⏳ STABLE COUNTDOWN TIMER (FIXED)
  useEffect(() => {
    if (!item.closingTime) return;

    const closingTimestamp = new Date(item.closingTime).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const diff = closingTimestamp - now;

      if (diff <= 0) {
        setTimeLeft("Auction Closed");
        clearInterval(timerRef.current);
        return;
      }

      const hrs = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hrs}h ${mins}m ${secs}s`);
    };

    updateTimer(); // ⏱️ run immediately
    timerRef.current = setInterval(updateTimer, 1000);

    return () => clearInterval(timerRef.current);
  }, [item.closingTime]);

  // 💰 Place bid
  const handleBid = async () => {
    if (Number(bid) <= item.currentBid) {
      setMessage("Bid must be higher than current bid");
      return;
    }

    const bidderName = prompt("Enter your name");
    if (!bidderName) return;

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}/bid/${id}`,
        { bid: Number(bid), bidderName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setItem(res.data.item);
      setMessage(res.data.message);
      setBid("");
    } catch {
      setMessage("Error placing bid");
    }
  };

  // ✏️ Edit
  const handleEdit = () => {
    navigate(`/edit-auction/${id}`);
  };

  // 🗑️ Delete
  const handleDelete = async () => {
    if (!window.confirm("Delete this auction?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API_URL}/auction/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Auction deleted");
      navigate("/dashboard");
    } catch {
      alert("Not authorized");
    }
  };

  // 👤 Owner check
  const isOwner =
    loggedInUserId &&
    item.owner &&
    loggedInUserId === (item.owner._id || item.owner).toString();

  const auctionClosed = timeLeft === "Auction Closed";

  return (
    <div style={{ textAlign: "center" }}>
      <h2>{item.itemName}</h2>
      <p>{item.description}</p>

      <p><strong>Current Bid:</strong> ₹{item.currentBid}</p>
      <p><strong>Highest Bidder:</strong> {item.highestBidder || "No bids yet"}</p>

      <p style={{ color: auctionClosed ? "red" : "green", fontWeight: "bold" }}>
        Time Left: {timeLeft}
      </p>

      {!auctionClosed && (
        <>
          <input
            type="number"
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            placeholder="Enter bid"
          />
          <br /><br />
          <button onClick={handleBid}>Place Bid</button>
        </>
      )}

      {isOwner && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleEdit}>Edit</button>
          <button
            onClick={handleDelete}
            style={{ marginLeft: "10px", background: "red", color: "white" }}
          >
            Delete
          </button>
        </div>
      )}

      {message && <p style={{ marginTop: "10px" }}>{message}</p>}
    </div>
  );
}

export default AuctionItem;
