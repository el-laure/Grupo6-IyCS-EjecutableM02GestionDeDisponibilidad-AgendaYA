import { describe, expect, it } from "vitest";

import { Intervalo } from "../../domain/intervalo/Intervalo";

describe("US_ADM_008 - Crear intervalo bloqueado", () => {

  it("configura el tipo del intervalo como BLOQUEADO", () => {

    /// -arrange
    const intervalo = new Intervalo(
      "intervalo-test-002",
      null,
      null,
      null
    );

    const horaInicio = new Date("2026-06-01T09:00:00");
    const horaFin = new Date("2026-06-01T12:00:00");

    /// -act
    intervalo.configurar(
      horaInicio,
      horaFin,
      "BLOQUEADO"
    );

    /// -assert
    expect(intervalo.tipo).toBe("BLOQUEADO");
  });

});