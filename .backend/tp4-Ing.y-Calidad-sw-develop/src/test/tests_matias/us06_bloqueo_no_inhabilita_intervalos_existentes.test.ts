import { describe, expect, it } from "vitest";
import { DiaDisponibilidad } from "../../domain/disponibilidad/DiaDisponibilidad";
import { Intervalo } from "../../domain/intervalo/Intervalo";

describe("US_ADM_006 - Bloqueo de días", () => {

  it("mantiene activos los intervalos configurados al bloquear el día", () => {

    /// -arrange
    const usuarioId = "admin-test-001";
    const fecha = new Date("2026-06-01");

    const dia = new DiaDisponibilidad(
      "dia-test-001",
      usuarioId,
      fecha
    );

    const intervalo1 = new Intervalo(
      "intervalo-test-001",
      null,
      null,
      null
    );

    const intervalo2 = new Intervalo(
      "intervalo-test-002",
      null,
      null,
      null
    );

    dia.agregarIntervalo(intervalo1);
    dia.agregarIntervalo(intervalo2);

    /// -act
    dia.bloquear();

    /// -assert
    expect(intervalo1.intervaloActivo()).toBe(true);
    expect(intervalo2.intervaloActivo()).toBe(true);
  });

});