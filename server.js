const express = require("express");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Evelyn21:)",
  database: "bookstore"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL Database");
  }
});

// ✅ Email Transporter (Use your Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "evelynchristen21@gmail.com",
    pass: "aniq gzbn wtbm plbn"
  }
});

// ✅ API to receive form data
app.post("/order", (req, res) => {
  const { name, email, product, quantity } = req.body;

  // Save to Database
  const sql = "INSERT INTO orders (name, email, product, quantity) VALUES (?, ?, ?, ?)";
  db.query(sql, [name, email, product, quantity], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database error");
    }

    // Send Email
    const mailOptions = {
      from: "evelynchristen21@gmail.com",
      to: "evelynchristen21@gmail.com",
      subject: "New Book Order",
      text: `
        New Order Received:
        Name: ${name}
        Email: ${email}
        Product: ${product}
        Quantity: ${quantity}
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.send("Order placed successfully!");
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});