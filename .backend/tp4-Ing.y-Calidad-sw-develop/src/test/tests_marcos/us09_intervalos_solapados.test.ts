import { describe, expect, it } from "vitest";
import { Intervalo } from "../../domain/intervalo/Intervalo";

describe("US_ADM_009 - Editar intervalos", () => {
  it("detecta el solapamiento entre dos intervalos", () => {
    // arrange
    const intervalo1 = new Intervalo(
      "intervalo-test-001",
      new Date("2026-06-01T13:00:00"),
      new Date("2026-06-01T14:00:00"),
      "LABORAL"
    );

    const intervalo2 = new Intervalo(
      "intervalo-test-002",
      new Date("2026-06-01T13:30:00"),
      new Date("2026-06-01T15:00:00"),
      "LABORAL"
    );

    // act
    const seSolapan =
      intervalo1.horaInicio! < intervalo2.horaFin! &&
      intervalo1.horaFin! > intervalo2.horaInicio!;

    // assert
    expect(seSolapan).toBe(true);
  });
});