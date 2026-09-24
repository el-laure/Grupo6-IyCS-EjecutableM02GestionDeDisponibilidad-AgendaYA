import { describe, expect, it } from "vitest";
import { AntelacionMinima } from "../../domain/preferencias/AntelacionMinima";
import { UnidadAntelacion } from "../../domain/preferencias/UnidadAntelacion";

describe("US_ADM_012 - Tiempo mínimo de antelación para reservas", () => {
  it("convierte una antelación expresada en días a horas", () => {
    // arrange
    const antelacion = new AntelacionMinima(
      2,
      UnidadAntelacion.DIAS
    );

    // act
    const horas = antelacion.obtenerHoras();

    // assert
    expect(horas).toBe(48);
  });
});