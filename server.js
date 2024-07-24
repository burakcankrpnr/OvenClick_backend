const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const machineRoutes = require("./routes/machineRoutes");
const authRoutes = require("./routes/authRoutes");

const port = 3001;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/user", userRoutes);
app.use("/machines", machineRoutes);
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log("Sunucu şu portta dinliyor: " + port);
});
