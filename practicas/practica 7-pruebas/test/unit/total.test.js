const { calcularTotal } = require("../../src/total");

test("el total no puede ser negativo cuando el descuento supera el 100%", () => {
  const items = [{ precio: 100, cantidad: 1 }];
  const descuento = 150;
  
  const total = calcularTotal(items, descuento);
  
  expect(total).toBe(0); 
});