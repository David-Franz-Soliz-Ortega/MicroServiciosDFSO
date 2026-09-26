const express=require("express");
const db = require('./db');
const app=express();
const port=3001;

app.use(express.json());
app.use(express.urlencoded({extended:true}));


app.get("/api/v1/pacientes/:id",(req,res)=>{
   const id=req.params.id;
    const [rows] =  db.query('SELECT * FROM pacientes WHERE id = ?', id);
    try{
        if(rows.length ===0){
        res.send("paciente no encontrado");
    };
   res.json(rows[0]);
    }catch(error){
        res.send("error en la db");
    }

});

app.post("/api/v1/pacientes/", async (req, res) => {
    const { ci, nombre, apellido, fecha_nacimiento, telefono, seguro } = req.body;

    if (!ci || !nombre || !apellido) {
        return res.status(400).json({ error: "Faltan campos obligatorios (ci, nombre, apellido)" });
    }

    try {
        const query = 'INSERT INTO pacientes (ci, nombre, apellido, fecha_nacimiento, telefono, seguro) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [ci, nombre, apellido, fecha_nacimiento, telefono, seguro]);

        res.status(201).json({
            message: "Paciente creado exitosamente",
            id: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en la base de datos al crear el paciente" });
    }
});


app.put("/api/v1/pacientes/:id", async (req, res) => {
    const { id } = req.params;
    const { ci, nombre, apellido, fecha_nacimiento, telefono, seguro } = req.body;

    try {
        const query = `
            UPDATE pacientes 
            SET ci = ?, nombre = ?, apellido = ?, fecha_nacimiento = ?, telefono = ?, seguro = ? 
            WHERE id = ?
        `;
        
        const [result] = await db.query(query, [ci, nombre, apellido, fecha_nacimiento, telefono, seguro, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }

        res.json({ message: "Paciente actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error en la base de datos al actualizar el paciente" });
    }
});


app.delete("/api/v1/pacientes/:id",(req,res)=>{
const { id } = req.params;
  const query = 'DELETE FROM usuarios WHERE id = ?';

  db.query(query, [id], (err, result) => {
    if (err) return requireRes.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return requireRes.status(404).json({ message: 'Paciente no encontrado' });
    requireRes.json({ message: `Paciente eliminado` });
  });
})

app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
});