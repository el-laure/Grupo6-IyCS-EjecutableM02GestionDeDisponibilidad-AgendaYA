import { describe, expect, it } from "vitest";
import { Intervalo } from "../../domain/intervalo/Intervalo";

describe("US_ADM_008 - Crear intervalo bloqueado", () => {
  it("configura el intervalo con tipo BLOQUEADO", () => {
    // arrange
    const intervalo = new Intervalo(
      "intervalo-test-001",
      null,
      null,
      null
    );

    // act
    intervalo.configurar(
      new Date("2026-06-01T09:00:00"),
      new Date("2026-06-01T12:00:00"),
      "BLOQUEADO"
    );

    // assert
    expect(intervalo.tipo).toBe("BLOQUEADO");
  });
});