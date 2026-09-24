import { describe, expect, it } from "vitest";
import { Intervalo } from "../../domain/intervalo/Intervalo";

describe("US_ADM_007 - Crear intervalo", () => {
  it("mantiene activo un intervalo correctamente configurado", () => {
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
      "LABORAL"
    );

    // assert
    expect(intervalo.intervaloActivo()).toBe(true);
  });
});