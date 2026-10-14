const { MongoDBContainer } = require("@testcontainers/mongodb");
const { crearRepositorio } = require("../../src/repositorio");

describe("Pruebas de integración CRUD", () => {
  let contenedor, repo;

  beforeAll(async () => {
    contenedor = await new MongoDBContainer("mongo:6").start();
    repo = await crearRepositorio(contenedor.getConnectionString() + "?directConnection=true");
  }, 120000);

  afterAll(async () => {
    if (repo) await repo.cerrar();
    if (contenedor) await contenedor.stop();
  });

  // Aislamiento: Limpia la colección antes de CADA prueba
  beforeEach(async () => {
    await repo.limpiar();
  });

  test("guarda y recupera un documento", async () => {
    await repo.guardar({ titulo: "Tarea A", completada: false });
    const encontrada = await repo.buscarPorTitulo("Tarea A");
    expect(encontrada.titulo).toBe("Tarea A");
  });

  test("devuelve null cuando el documento no existe", async () => {
    const encontrada = await repo.buscarPorTitulo("No existo");
    expect(encontrada).toBeNull();
  });

  test("actualiza el estado de una tarea existente", async () => {
    await repo.guardar({ titulo: "Tarea B", completada: false });
    await repo.actualizar("Tarea B", true);
    
    const encontrada = await repo.buscarPorTitulo("Tarea B");
    expect(encontrada.completada).toBe(true);
  });

  test("elimina un documento existente", async () => {
    await repo.guardar({ titulo: "Tarea C", completada: false });
    await repo.eliminar("Tarea C");
    
    const encontrada = await repo.buscarPorTitulo("Tarea C");
    expect(encontrada).toBeNull();
  });
});