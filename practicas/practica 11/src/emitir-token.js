require("dotenv").config();
const jwt = require("jsonwebtoken");

const SECRETO = process.env.JWT_SECRET;
const carga = { sub: "u-100", nombre: "Ana Quispe", rol: "usuario" };
const token = jwt.sign(carga, SECRETO, {
  expiresIn: "15m",
  issuer: "practica11",
});
console.log(token);
