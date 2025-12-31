const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
// create table user (username varchar(10) not null unique)
const User = mongoose.model('User', userSchema);

// Auction Item Schema
const AuctionSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  currentBid: Number,
  highestBidder: String,
  closingTime: Date,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isClosed: { type: Boolean, default: false }
});



const AuctionItem = mongoose.model('AuctionItem', AuctionSchema);

module.exports = { User, AuctionItem };
