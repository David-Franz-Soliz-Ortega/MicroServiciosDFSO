const { validarReserva}= require("../src/horario");

describe("pruebas de funcionamiento de reservacion",()=>{
    test("mas de 4 horas",()=>{
        expect(()=>validarReserva(8,14).toThrow("horario invalido"));
    });
    
     test("reserva valida",()=>{
        expect(()=>validarReserva(8,10).toThrow(!"horario invalido"));
    });

     test("fin menor que inicio",()=>{
        expect(()=>validarReserva(12,11).toThrow("horario invalido"));
    });

     test("contiguo",()=>{
        expect(()=>validarReserva(9,11).toThrow("horario invalido"));
    });

     test("fuera de horario",()=>{
        expect(()=>validarReserva(20,24).toThrow("horario invalido"));
    });

     test("la misma hora",()=>{
        expect(()=>validarReserva(13,13).toThrow("horario invalido"));
    });
});
