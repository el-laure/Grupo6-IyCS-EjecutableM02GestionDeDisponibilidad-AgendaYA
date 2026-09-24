import { describe, expect, it } from "vitest";
import { DiaDisponibilidad } from "../../domain/disponibilidad/DiaDisponibilidad";
import { DiaEstado } from "../../domain/disponibilidad/DiaEstado";

describe("US_ADM_004 - Estado visual de disponibilidad", () => {
  it("crea un día sin intervalos y queda en estado SIN_ASIGNAR", () => {
    const dia = new DiaDisponibilidad(
      "dia-test-001",
      "admin-test-001",
      new Date("2026-06-01")
    );

    expect(dia.obtenerEstado()).toBe(DiaEstado.SIN_ASIGNAR);
  });
});