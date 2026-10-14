function calcularMulta(diasRetraso, esSocio) {
  if (typeof diasRetraso !== "number") throw new Error("Los días de retraso deben ser un número");
  if (diasRetraso < 0) throw new Error("Los días no pueden ser negativos");
  
  if (diasRetraso === 0) return 0;


  if (esSocio && diasRetraso <= 1) return 0;
  
  const tarifaDiaria = esSocio ? 1 : 2;
  return diasRetraso * tarifaDiaria;
}

module.exports = { calcularMulta };