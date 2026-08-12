const {DataSource}=require('typeorm');
const { Cargo, Lugar, Candidato } = require("./entidades");

const AppDataSource= new DataSource({
    type:"mysql",
    host:"localhost",
    port:3306,
    username:"root",
    database: "microservicios1",
    entities: [Cargo,Lugar,Candidato],
    synchronize: true
});

module.exports = { AppDataSource };