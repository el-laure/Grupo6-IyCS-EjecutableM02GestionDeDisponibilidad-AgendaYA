import { describe, expect, it } from "vitest";

import { DiaDisponibilidad } from "../../domain/disponibilidad/DiaDisponibilidad";
import { DiaEstado } from "../../domain/disponibilidad/DiaEstado";
import { Intervalo } from "../../domain/intervalo/Intervalo";

describe("US_ADM_006 - Bloqueo de días", () => {
  it("retorna HORARIO_ASIGNADO al desbloquear un día con un intervalo configurado", () => {
    // arrange
    const dia = new DiaDisponibilidad(
      "dia-test-001",
      "admin-test-001",
      new Date("2026-06-01")
    );

    const intervalo = new Intervalo(
      "intervalo-test-001",
      new Date("2026-06-01T09:00:00"),
      new Date("2026-06-01T12:00:00"),
      "LABORAL"
    );

    dia.agregarIntervalo(intervalo);
    dia.bloquear();

    // act
    dia.desbloquear();

    // assert
    expect(dia.obtenerEstado()).toBe(DiaEstado.HORARIO_ASIGNADO);
  });
});