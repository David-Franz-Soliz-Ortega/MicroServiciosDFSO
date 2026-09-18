const {Router} = require("express");

const router=Router();

const trabajadores = [
{ id: 1, nombre: "Maria Flores", correo: "maria@usfx.bo", edad: 24 },
{ id: 2, nombre: "Juan Perez", correo: "juan@usfx.bo", edad: 31 },
];


router.get("/trabajador",(req,res)=>{
    res.json(trabajadores)
});

app.post("/trabajador", async (req, res) => {
  try {

    const errores = validarTrabajador(req.body);
    if (errores.length) {
      return fallo(res, 400, "VALIDACION", "La solicitud tiene campos inválidos", errores);
    }

    const { nombre, correo, cargo } = req.body;

    const existente = await porCorreo(correo);
    if (existente) {
      return fallo(res, 409, "CONFLICTO", "El correo ya está registrado");
    }
    const nuevoTrabajador = { nombre, correo, cargo };
    const resultado = await crear(nuevoTrabajador);

    res.status(201)
       .location(`/trabajador/${resultado.insertedId}`)
       .json({ _id: resultado.insertedId, ...nuevoTrabajador });
  } catch (err) {
    console.error(err);
    fallo(res, 500, "ERROR_INTERNO", "Error al crear el trabajador");
  }
});

router.put("/:id", (req, res) => {
const id = Number(req.params.id);
const i = usuarios.findIndex(u => u.id === id);
if (i === -1) return res.status(404).json({ mensaje: "No encontrado" });
usuarios[i] = { id, ...req.body };
res.json(usuarios[i]);
});

router.delete("/:id", (req, res) => {
const id = Number(req.params.id);
const i = usuarios.findIndex(u => u.id === id);
if (i === -1) return res.status(404).json({ mensaje: "No encontrado" });
usuarios.splice(i, 1);
res.status(204).end();
});

module.exports = {router,trabajadores};