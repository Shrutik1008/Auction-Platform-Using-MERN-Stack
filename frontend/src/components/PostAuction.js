import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function PostAuction() {
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [startingBid, setStartingBid] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/signin");
  }, [navigate]);

  const handlePostAuction = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return navigate("/signin");

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/AuctionItem`,
        {
          itemName,
          description,
          startingBid: Number(startingBid),
          closingTime
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("Auction item posted successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to post auction");
    }
  };

  return (
    <div className="form-container">
      <h2>Post New Auction</h2>
      <form onSubmit={handlePostAuction}>
        <input value={itemName} onChange={e => setItemName(e.target.value)} required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} required />
        <input type="number" value={startingBid} onChange={e => setStartingBid(e.target.value)} required />
        <input type="datetime-local" value={closingTime} onChange={e => setClosingTime(e.target.value)} required />
        <button type="submit">Post Auction</button>
      </form>
    </div>
  );
}

export default PostAuction;
