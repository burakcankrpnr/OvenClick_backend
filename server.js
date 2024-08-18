const express = require("express");
const app = express();
const userRoutes = require("./routes/userRoutes");
const machineRoutes = require("./routes/machineRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const port = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Routes
app.get("/", (req, res) => {
  res.send("Server running");
});
app.use("/user", userRoutes);
app.use("/machines", machineRoutes);
app.use("/auth", authRoutes);

app.use((req, res, next) => {
  res.status(404).send("404: Route not found");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
