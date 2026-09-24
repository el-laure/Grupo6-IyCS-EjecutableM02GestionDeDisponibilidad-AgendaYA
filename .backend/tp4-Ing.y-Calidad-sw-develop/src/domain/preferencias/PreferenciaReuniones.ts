import { AntelacionMinima } from "./AntelacionMinima";
import { LimiteReservasDiarias } from "./LimiteReservasDiarias";

export class PreferenciasReuniones {
  private antelacionMinima: AntelacionMinima | null = null;
  private limiteReservasDiarias: LimiteReservasDiarias | null = null;

  constructor(public readonly usuarioId: string) {}

  guardarAntelacionMinima(antelacion: AntelacionMinima): void {
    this.antelacionMinima = antelacion;
  }

  obtenerAntelacionMinima(): AntelacionMinima | null {
    return this.antelacionMinima;
  }

  guardarLimiteReservasDiarias(
    limite: LimiteReservasDiarias
  ): void {
    this.limiteReservasDiarias = limite;
  }

  obtenerLimiteReservasDiarias(): LimiteReservasDiarias | null {
    return this.limiteReservasDiarias;
  }
}