export class LimiteReservasDiarias {

  constructor(
    public readonly cantidad: number
  ) {

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      throw new Error(
        "Ingrese un valor numérico entero mayor a cero."
      );
    }
  }
}