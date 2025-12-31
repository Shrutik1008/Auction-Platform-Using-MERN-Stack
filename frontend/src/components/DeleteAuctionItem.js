import React from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function DeleteAuction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${process.env.REACT_APP_API_URL}/auction/${id}`, // ✅ ENV BASED URL
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Auction deleted successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error deleting auction:", error.response?.data || error);
      alert("You are not authorized to delete this auction.");
    }
  };

  return (
    <div>
      <h2>Are you sure you want to delete this auction?</h2>

      <button
        onClick={handleDelete}
        style={{ backgroundColor: "red", color: "white", marginRight: "10px" }}
      >
        Delete
      </button>

      <button onClick={() => navigate(`/auction/${id}`)}>
        Cancel
      </button>
    </div>
  );
}

export default DeleteAuction;
