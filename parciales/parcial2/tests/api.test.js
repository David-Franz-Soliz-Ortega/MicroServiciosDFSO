const request=require("supertest");
const {crearApp}=require("../src/app");

test("POST /publicar falso", async()=>{
    const publicar =jest.fn().mockResolvedValue(true);
    const res= await request(crearApp({publicar}))
    .post("/reservas").send({laboratorio:23,docente:"juan",correo:"123gmail.com",inicio:10,fin:12});
    expect(res.status).toBe(405);
    expect(publicar).toHaveBeenCalledWith("reserva.creada",expect.objectContaining({id:res.body.id}));
});


test("POST /publicar", async()=>{
    const publicar =jest.fn().mockResolvedValue(true);
    const res= await request(crearApp({publicar}))
    .post("/reservas").send({laboratorio:"Lab1",docente:"juan",correo:"123gmail.com",inicio:10,fin:12});
    expect(res.status).toBe(201);
    expect(publicar).toHaveBeenCalledWith("reserva.creada",expect.objectContaining({id:res.body.id}));
});