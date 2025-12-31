require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, AuctionItem } = require("./model");
const { connectDB } = require("./db");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

const PORT = process.env.PORT || 5001;
const SECRET_KEY = process.env.JWT_SECRET;

connectDB();

/* =========================
   AUTH MIDDLEWARE
========================= */
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid Token" });
    req.user = decoded;
    next();
  });
};

/* =========================
   AUTH ROUTES
========================= */
app.post("/Signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "All fields required" });

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({ username, password: hashedPassword }).save();

    res.status(201).json({ message: "User registered successfully" });
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/Signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({ message: "Signin successful", token });
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* =========================
   AUCTIONS
========================= */
app.post("/AuctionItem", authenticate, async (req, res) => {
  try {
    const { itemName, description, startingBid, closingTime } = req.body;
    if (!itemName || !description || !startingBid || !closingTime)
      return res.status(400).json({ message: "All fields are required" });

    const auction = new AuctionItem({
      itemName,
      description,
      currentBid: startingBid,
      highestBidder: "",
      closingTime,
      owner: req.user.userId
    });

    await auction.save();
    res.status(201).json({ message: "Auction created", item: auction });
  } catch {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/auctions", async (req, res) => {
  const auctions = await AuctionItem.find().populate("owner", "_id");
  res.json(auctions);
});

app.get("/auctions/:id", async (req, res) => {
  const auction = await AuctionItem.findById(req.params.id).populate("owner", "_id");
  if (!auction) return res.status(404).json({ message: "Auction not found" });
  res.json(auction);
});

app.put("/auction/:id", authenticate, async (req, res) => {
  const auction = await AuctionItem.findById(req.params.id);
  if (!auction) return res.status(404).json({ message: "Auction not found" });
  if (auction.owner.toString() !== req.user.userId)
    return res.status(403).json({ message: "Not authorized" });

  Object.assign(auction, req.body);
  await auction.save();
  res.json({ message: "Auction updated", auction });
});

app.delete("/auction/:id", authenticate, async (req, res) => {
  const auction = await AuctionItem.findById(req.params.id);
  if (!auction) return res.status(404).json({ message: "Auction not found" });
  if (auction.owner.toString() !== req.user.userId)
    return res.status(403).json({ message: "Not authorized" });

  await auction.deleteOne();
  res.json({ message: "Auction deleted" });
});

app.post("/bid/:id", authenticate, async (req, res) => {
  const { bid, bidderName } = req.body;
  if (!bidderName)
    return res.status(400).json({ message: "Bidder name required" });

  const item = await AuctionItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Auction not found" });
  if (item.isClosed)
    return res.status(400).json({ message: "Auction is closed" });

  if (bid <= item.currentBid)
    return res.status(400).json({ message: "Bid too low" });

  item.currentBid = bid;
  item.highestBidder = bidderName;
  await item.save();

  res.json({ message: "Bid successful", item });
});

/* =========================
   SERVER
========================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
