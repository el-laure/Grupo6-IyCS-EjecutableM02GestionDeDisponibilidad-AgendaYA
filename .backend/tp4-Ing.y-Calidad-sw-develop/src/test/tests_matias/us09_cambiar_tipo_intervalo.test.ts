import { describe, expect, it } from "vitest";
import { Intervalo } from "../../domain/intervalo/Intervalo";

describe("US_ADM_009 - Editar intervalo", () => {

  it("cambia el tipo de un intervalo laboral a BLOQUEADO", () => {

    /// -arrange
    const intervalo = new Intervalo(
      "intervalo-test-002",
      new Date("2026-06-01T09:00:00"),
      new Date("2026-06-01T12:00:00"),
      "LABORAL"
    );

    /// -act
    intervalo.configurar(
      new Date("2026-06-01T09:00:00"),
      new Date("2026-06-01T12:00:00"),
      "BLOQUEADO"
    );

    /// -assert
    expect(intervalo.tipo).toBe("BLOQUEADO");
  });

});