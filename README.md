
# 🎯 Auction-Platform-Using-MERN-Stack

A full-stack **Online Auction Platform** built using the **MERN stack** (MongoDB, Express.js, React, Node.js). This application allows users to register, log in, create and manage auction listings, and place bids in real time.

---

## 🔧 Tech Stack

- **Frontend**: React
- **Backend**: Node.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Other Tools**: CORS, Bcrypt.js, dotenv

---

## ✨ Features

- 🧑‍💼 **User Authentication** (Register/Login with secure JWT tokens)
- 📤 **Create Auctions** (Add title, description, base price, deadline)
- 💸 **Bid System** (Place real-time bids)
- ⏳ **Auction Timer** (Bids close when the timer ends)
- 📈 **Live Bid Updates**
- 📚 **Bid History**
- 🔐 **Protected Routes** for logged-in users
- 🛠️ **RESTful APIs** for frontend-backend interaction

---

## 🚀 Getting Started

### 🔁 Clone the Repository

```bash
git clone https://github.com/Shrutik1008/Auction-Platform-Using-MERN-Stack.git
cd Auction-Platform-Using-MERN-Stack
```

---

### 🔙 Backend Setup

```bash
cd backend
npm install
npm start
```

### 🖥️ Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

---

## 📁 Project Structure

```
Final Project/
├── backend/
|   ├── db.js
|   ├── model.js
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public
    |   ├── index.html
    |   ├── logo192.png
    |   ├── logo512.png
    |   ├── manifest.json
    |   ├── robots.txt
    └── src/
        ├── components/
        ├── App.js
        ├── App.css
        ├── App.test.js
        ├── auction.jpeg
        ├── index.js
        ├── index.css
        ├── reportWebVitals.js
        └── setupTests.js

```

---

## 📸 Screenshots

_Add some screenshots of login, auction page, bidding page, etc._

---

## 📜 License

This project is licensed under the MIT License.
