function calcularTotal(items, descuentoPorcentaje) {
  const bruto = items.reduce((a, i) => a + i.precio * i.cantidad, 0);
  // Corrección: El límite máximo de descuento es 100
  const descuentoAplicable = descuentoPorcentaje > 100 ? 100 : descuentoPorcentaje;
  
  return bruto - (bruto * descuentoAplicable / 100);
}

module.exports = { calcularTotal };