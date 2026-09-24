import { describe, expect, it } from "vitest";
import { DiaDisponibilidad } from "../../domain/disponibilidad/DiaDisponibilidad";

describe("US_ADM_010 - Eliminar intervalos", () => {
  it("rechaza eliminar un intervalo inexistente", () => {
    // arrange
    const dia = new DiaDisponibilidad(
      "dia-test-001",
      "admin-test-001",
      new Date("2026-06-01")
    );

    // act
    const accion = () =>
      dia.eliminarIntervalo("intervalo-inexistente");

    // assert
    expect(accion).toThrow("Intervalo inexistente");
  });
});