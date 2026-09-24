import { describe, expect, it } from "vitest";
import { DiaDisponibilidad } from "../../domain/disponibilidad/DiaDisponibilidad";

describe("US_ADM_009 - Editar intervalos", () => {
  it("rechaza configurar un intervalo inexistente", () => {
    // arrange
    const dia = new DiaDisponibilidad(
      "dia-test-001",
      "admin-test-001",
      new Date("2026-06-01")
    );

    // act
    const accion = () =>
      dia.configurarIntervalo(
        "intervalo-inexistente",
        new Date("2026-06-01T09:00:00"),
        new Date("2026-06-01T12:00:00"),
        "LABORAL"
      );

    // assert
    expect(accion).toThrow("Intervalo inexistente");
  });
});