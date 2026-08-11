const express = require("express");
const app = express();
const port = 2999;

app.get("/", (req, res) => {
  res.send("Hola estoy en express");
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
