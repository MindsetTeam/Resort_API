const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// dotenv.config({ path: "./config/config.development.env" });
dotenv.config({ path: "./config/config.env" });
connectDB();

const auth = require("./routes/auth");
// const users = require("./routes/users");
// const branches = require("./routes/branches");
const reservations = require("./routes/reservations");
// const rooms = require("./routes/rooms");
// const customers = require("./routes/customers");

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Router
app.use("/api/v1/auth", auth);
// app.use("/api/v1/users", users);
// app.use("/api/v1/rooms", rooms);
// app.use("/api/v1/branches", branches);
// app.use("/api/v1/reservations", reservations);
// app.use("/api/v1/customers", customers);

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server =app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

process.once("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
