import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function EditAuction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState({
    itemName: "",
    description: "",
    currentBid: 0,
    closingTime: ""
  });

  // 🔹 Fetch auction details
  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/auctions/${id}`
        );

        setItem({
          itemName: res.data.itemName,
          description: res.data.description,
          currentBid: res.data.currentBid,
          closingTime: new Date(res.data.closingTime)
            .toISOString()
            .slice(0, 16)
        });
      } catch (error) {
        console.error("Error fetching auction item:", error);
        alert("Unable to fetch auction details");
      }
    };

    fetchItem();
  }, [id]);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${process.env.REACT_APP_API_URL}/auction/${id}`,
        {
          itemName: item.itemName,
          description: item.description,
          closingTime: item.closingTime
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Auction updated successfully!");
      navigate(`/auction/${id}`);
    } catch (error) {
      console.error(
        "Error updating auction:",
        error.response?.data || error
      );
      alert("You are not authorized to edit this auction");
    }
  };

  return (
    <div>
      <h2>Edit Auction</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="itemName"
          value={item.itemName}
          onChange={handleChange}
          placeholder="Item Name"
          required
        />

        <textarea
          name="description"
          value={item.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        {/* 🔒 Read-only current bid */}
        <input
          type="number"
          value={item.currentBid}
          readOnly
        />

        <input
          type="datetime-local"
          name="closingTime"
          value={item.closingTime}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Auction</button>
      </form>
    </div>
  );
}

export default EditAuction;
