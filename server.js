const express = require("express");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const machineRoutes = require("./routes/machineRoutes");
const port = 3001;

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", userRoutes);
app.use("/machines", machineRoutes);

app.listen(port, () => {
  console.log("Sunucu şu portta dinliyor: " + port);
});
