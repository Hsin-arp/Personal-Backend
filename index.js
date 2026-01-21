// index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();

// --------------------
// Middleware
// --------------------
app.use(cors({ origin: "http://localhost:5173" })); // allow React dev server
app.use(express.json());

// --------------------
// MongoDB connection
// --------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

console.log("Mongo:", !!process.env.MONGODB_URI);
console.log("Email:", !!process.env.EMAIL_USER);

// --------------------
// MongoDB Schema
// --------------------
const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

// --------------------
// Routes
// --------------------

// Test route
app.get("/", (req, res) => {
  res.send("Backend running");
});

// Contact form route
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Save to MongoDB
    const newContact = await Contact.create({ name, email, message });

    // Send email (example with Gmail SMTP)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASS, // your email app password
      },
    });

    await transporter.sendMail({
      from: `"Website Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // receive emails yourself
      subject: `New Contact Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    });

    return res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("Contact error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// --------------------
// Start server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
