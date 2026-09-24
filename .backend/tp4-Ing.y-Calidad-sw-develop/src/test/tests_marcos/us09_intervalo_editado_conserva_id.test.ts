import { describe, expect, it } from "vitest";

import { Intervalo } from "../../domain/intervalo/Intervalo";

describe("US_ADM_009 - Editar intervalos", () => {
  it("mantiene el identificador del intervalo al editarlo", () => {
    // arrange
    const intervalo = new Intervalo(
      "intervalo-test-001",
      new Date("2026-06-01T09:00:00"),
      new Date("2026-06-01T12:00:00"),
      "LABORAL"
    );

    // act
    intervalo.configurar(
      new Date("2026-06-01T10:00:00"),
      new Date("2026-06-01T14:00:00"),
      "LABORAL"
    );

    // assert
    expect(intervalo.id).toBe("intervalo-test-001");
  });
});