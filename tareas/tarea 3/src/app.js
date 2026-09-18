const express = require("express");
const app = express();
app.use(express.json());
app.get("/salud", (_req, res) => res.json({ estado: "arriba" }));
module.exports = app;