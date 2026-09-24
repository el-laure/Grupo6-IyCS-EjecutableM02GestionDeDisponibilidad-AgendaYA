import { describe, expect, it } from "vitest";

import { Intervalo } from "../../domain/intervalo/Intervalo";

describe("US09 - Eliminar intervalo existente", () => {

  it("un intervalo deja de estar activo después de eliminarse", () => {

    /// -arrange
    const intervalo = new Intervalo(
      "intervalo-test-002",
      new Date("2026-06-01T09:00:00"),
      new Date("2026-06-01T12:00:00"),
      "LABORAL"
    );

    /// -act
    intervalo.eliminarIntervalo();

    /// -assert
    expect(intervalo.intervaloActivo()).toBe(false);

  });

});