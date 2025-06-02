const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const auth = require("./routes/auth");
const users = require("./routes/users");
const items = require("./routes/items");
const messages = require("./routes/messages");
const reports = require("./routes/reports");
const admin = require("./routes/admin");
const adminReports = require("./routes/reports");

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
// In server.js
app.use(
  cors({
    origin: "http://localhost:3000", // Or your frontend URL
    credentials: true,
  })
);

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Set static folders
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/assets",
  express.static(path.join(__dirname, "../frontend/public/assets"))
);

// Mount routers
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/items", items);
app.use("/api", messages);
app.use("/api/reports", reports);
app.use("/api/admin", admin);
app.use("/api/admin/reports", adminReports);

// Error handler
app.use(errorHandler);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
