import { describe, expect, it } from "vitest";
import { AntelacionMinima } from "../../domain/preferencias/AntelacionMinima";
import { UnidadAntelacion } from "../../domain/preferencias/UnidadAntelacion";

describe("US12 - Antelación de reserva inválida", () => {

  it("Si se coloca un numero de antelación negativo, debe rechazarse", () => {

    /// -arrange
    const valor = -4;

    /// -act
    const accion = () =>
    new AntelacionMinima(
      valor,
      UnidadAntelacion.HORAS
    );

    /// -assert
    expect(accion).toThrow(
    "Ingrese un valor numérico entero mayor a cero."
    );
  });

});