import { describe, expect, it } from "vitest";

import { DiaDisponibilidad } from "../../domain/disponibilidad/DiaDisponibilidad";
import { DiaEstado } from "../../domain/disponibilidad/DiaEstado";

describe("US_ADM_006 - Bloqueo de días", () => {
  it("retorna SIN_ASIGNAR al desbloquear un día sin intervalos", () => {
    // arrange
    const dia = new DiaDisponibilidad(
      "dia-test-001",
      "admin-test-001",
      new Date("2026-06-01")
    );

    dia.bloquear();

    // act
    dia.desbloquear();

    // assert
    expect(dia.obtenerEstado()).toBe(DiaEstado.SIN_ASIGNAR);
  });
});