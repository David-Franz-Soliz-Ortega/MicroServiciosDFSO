const { EntitySchema } = require("typeorm");

const Cargo = new EntitySchema({
    name: "Cargo",
    tableName: "cargo",
    columns: {
        id: { primary: true, type: "int", generated: true },
        nombre: { type: "varchar" }
    }
});

const Lugar = new EntitySchema({
    name: "Lugar",
    tableName: "lugar",
    columns: {
        id: { primary: true, type: "int", generated: true },
        nombre: { type: "varchar" }
    }
});

const Candidato = new EntitySchema({
    name: "Candidato",
    tableName: "candidatos",
    columns: {
        ci: { primary: true, type: "varchar", length: 12 },
        nombres: { type: "varchar", length: 60 },
        apellido1: { type: "varchar", length: 30 },
        apellido2: { type: "varchar", length: 40 }
    },
    relations: {
        cargo: {
            target: "Cargo",
            type: "many-to-one",
            joinColumn: { name: "cargo_id" },
            cascade: true // Opcional: útil para guardar relaciones rápidamente
        },
        lugar: {
            target: "Lugar",
            type: "many-to-one",
            joinColumn: { name: "lugar_id" },
            cascade: true
        }
    }
});

module.exports = { Cargo, Lugar, Candidato };