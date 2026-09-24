import { describe, expect, it } from "vitest";
import { DiaDisponibilidad } from "../../domain/disponibilidad/DiaDisponibilidad";
import { DiaEstado } from "../../domain/disponibilidad/DiaEstado";
import { Intervalo } from "../../domain/intervalo/Intervalo";

describe("US_ADM_006 - Bloqueo de días", () => {

  it("mantiene el estado BLOQUEADO cuando el día tiene intervalos configurados", () => {

    /// -arrange
    const dia = new DiaDisponibilidad(
      "dia-test-001",
      "admin-test-001",
      new Date("2026-06-01")
    );

    const intervalo = new Intervalo(
      "intervalo-test-001",
      null,
      null,
      null
    );

    dia.agregarIntervalo(intervalo);

    /// -act
    dia.bloquear();

    /// -assert
    expect(dia.obtenerEstado()).toBe(DiaEstado.BLOQUEADO);
  });

});