import { UnidadAntelacion } from "./UnidadAntelacion";

export class AntelacionMinima {

  constructor(
    public readonly valor: number,
    public readonly unidad: UnidadAntelacion
  ) {

    if (!Number.isInteger(valor) || valor <= 0) {
      throw new Error(
        "Ingrese un valor numérico entero mayor a cero."
      );
    }
  }

  obtenerHoras(): number {

    if (this.unidad === UnidadAntelacion.HORAS) {
      return this.valor;
    }

    return this.valor * 24;
  }
}