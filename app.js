const express = require("express");
const cors = require("cors");
const tracesRoutes = require("./routes/traces.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/traces", tracesRoutes);

module.exports = app;
