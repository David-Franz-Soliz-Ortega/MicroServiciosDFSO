const express=require('express');
const bodyparser=require('body-parser');
require("reflect-metadata")
const {AppDataSource,Candidatostabla}=require('./db/basededatos.js')

const app= express();
const port=3000;

app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.set('views', './views');
// Middleware para parsear datos de formularios


AppDataSource.initialize()
    .then(() => console.log("¡Conexión a la base de datos exitosa!"))
    .catch(error => console.log("Error al conectar BD:", error));

// Repositorios (Para interactuar con la BD)
const candidatoRepo = AppDataSource.getRepository("Candidato");
const cargoRepo = AppDataSource.getRepository("Cargo");
const lugarRepo = AppDataSource.getRepository("Lugar");


app.get('/', async (req, res) => {
    // find() trae todos los registros. "relations" hace el JOIN automático
    const candidatos = await candidatoRepo.find({ relations: { cargo: true, lugar: true } });
    res.render('candidatos', { candidatos });
});

app.get('/crearcandidato', async (req, res) => {
    const cargos = await cargoRepo.find();
    const lugares = await lugarRepo.find();
    res.render('formulario', { candidato: null, cargos, lugares });
});

app.post('/crearcandidato', async (req, res) => {
    const { ci, nombres, apellido1, apellido2, cargo_id, lugar_id } = req.body;
    
    const nuevoCandidato = candidatoRepo.create({
        ci, nombres, apellido1, apellido2,
        cargo: { id: parseInt(cargo_id) },
        lugar: { id: parseInt(lugar_id) }
    });
    
    await candidatoRepo.save(nuevoCandidato);
    res.redirect('/');
});


 app.get('/editarcandidato/:ci', async (req, res) => {
    const candidato = await candidatoRepo.findOne({
        where: { ci: req.params.ci },
        relations: { cargo: true, lugar: true }
    });
    const cargos = await cargoRepo.find();
    const lugares = await lugarRepo.find();
    res.render('editcandidatos', { candidato, cargos, lugares }); // <--- Cambia 'formcandidatos' por 'editarcandidato'
});

app.post('/editarcandidato/:ci', async (req, res) => {
    const { nombres, apellido1, apellido2, cargo_id, lugar_id } = req.body;
    await candidatoRepo.update(req.params.ci, {
        nombres: nombres,
        apellido1: apellido1,
        apellido2: apellido2,
        cargo: { id: parseInt(cargo_id) }, 
        lugar: { id: parseInt(lugar_id) }
    });

    res.redirect('/');
});

app.post('/eliminarcandidato/:ci', async (req, res) => {
    await candidatoRepo.delete(req.params.ci);
    res.redirect('/');
});


//lugares

app.get('/lugares',async(req,res)=>{
    const lugares= await lugarRepo.find();
    res.render('lugares', { lugares });
})

app.get('/crearlugar', async (req, res) => {
    const lugares = await lugarRepo.find();
    res.render('formlugares',{lugares:null});
});

app.post('/crearlugar', async (req, res) => {
    const { idlugar, nombrelugar } = req.body;
    const nuevoLugar = lugarRepo.create({
        id: parseInt(idlugar),
        nombre: nombrelugar    
    });
    
    await lugarRepo.save(nuevoLugar);
    res.redirect('/lugares');
});


app.get('/editarlugar/:id', async (req, res) => {
    const lugarAEditar = await lugarRepo.findOne({ where: { id: parseInt(req.params.id) } });
    res.render('editlugares', { lugar: lugarAEditar });
});


app.post('/editarlugar/:id', async (req, res) => {
    const { nombre } = req.body;
    await lugarRepo.update(req.params.id, { nombre: nombre });
    res.redirect('/lugares');
});


app.post('/eliminarlugar/:id', async (req, res) => {
    try {
        await lugarRepo.delete(req.params.id);
        res.redirect('/lugares'); // Si se borra con éxito, volvemos a la lista de lugares
    } catch (error) {
        // Mismo control de seguridad para lugares
        res.send(`
            <div>
                <h3>Error: No puedes eliminar este lugar porque hay candidatos que están registrados en él.</h3>
                <p>Para eliminarlo, primero debes cambiar de lugar a los candidatos afectados.</p>
                <a href="/lugares">Volver a Lugares</a>
            </div>
        `);
    }
});

//cargos

app.get('/cargos',async(req,res)=>{
    const cargos= await cargoRepo.find();
    res.render('cargos', { cargos });
})

app.get('/crearcargo', async (req, res) => {
    const cargos = await cargoRepo.find();
    res.render('formcargos',{cargos:null});
});

app.post('/crearcargo', async (req, res) => {
    const { idcargo, nombrecargo } = req.body;
    const nuevoCargo = cargoRepo.create({
        id: parseInt(idcargo),
        nombre: nombrecargo 
    });
    
    await cargoRepo.save(nuevoCargo);
    res.redirect('/cargos');
});


app.get('/editarcargo/:id', async (req, res) => {
    const cargo = await cargoRepo.findOne({ where: { id: parseInt(req.params.id) } });
    res.render('editcargos', { cargo }); // <--- Cambia 'formcargos' por 'editarcargo'
});

app.post('/editarcargo/:id', async (req, res) => {
    const { nombre } = req.body;
    await cargoRepo.update(req.params.id, { nombre: nombre });
    res.redirect('/cargos');
});



app.post('/eliminarcargo/:id', async (req, res) => {
    try {
        await cargoRepo.delete(req.params.id);
        res.redirect('/cargos');
    } catch (error) {
        res.send(`
            <div>
                <h3>Error: No puedes eliminar este cargo porque hay candidatos que están registrados en él.</h3>
                <p>Para eliminarlo, primero debes cambiar de cargo a los candidatos afectados.</p>
                <a href="/cargos">Volver a cargos</a>
            </div>
        `);
    }
});

//puerto
app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
        
    });
