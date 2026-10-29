const { calcularMulta } = require("../src/penalizacion");

describe("calcularMulta", () => {

  test("calcula multa estándar de $10 para no socio con 5 días de retraso", () => {
    const multa = calcularMulta(5, false); 
    expect(multa).toBe(10); 
  });

  test("devuelve 0 si la entrega es el mismo día (0 días de retraso)", () => {
    expect(calcularMulta(0, false)).toBe(0);
  });

  test("devuelve 0 para un socio que usa su único día de gracia (1 día de retraso)", () => {
    expect(calcularMulta(1, true)).toBe(0);
  });

  test("cobra desde el primer día a un socio si se excede del día de gracia (2 días = $2)", () => {
    expect(calcularMulta(2, true)).toBe(2);
  });

 
  test("lanza error si los días de retraso no son numéricos", () => {
    expect(() => calcularMulta("cinco", true)).toThrow("Los días de retraso deben ser un número");
  });

  test("lanza error si se envían días negativos", () => {
    expect(() => calcularMulta(-2, false)).toThrow("Los días no pueden ser negativos");
  });
});