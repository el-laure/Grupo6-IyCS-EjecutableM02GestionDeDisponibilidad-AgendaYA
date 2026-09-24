import { describe, expect, it } from "vitest";
import { Intervalo } from "../../domain/intervalo/Intervalo";

describe("US_ADM_009 - Editar intervalos", () => {
  it("verifica que existe un gap positivo entre dos intervalos configurados", () => {
    // arrange
    const intervalo1 = new Intervalo(
      "intervalo-test-001",
      new Date("2026-06-01T13:00:00"),
      new Date("2026-06-01T14:00:00"),
      "LABORAL"
    );

    const intervalo2 = new Intervalo(
      "intervalo-test-002",
      new Date("2026-06-01T15:00:00"),
      new Date("2026-06-01T16:00:00"),
      "LABORAL"
    );

    // act
    const gap =
      intervalo2.horaInicio!.getTime() -
      intervalo1.horaFin!.getTime();

    // assert
    expect(gap).toBeGreaterThan(0);
  });
});