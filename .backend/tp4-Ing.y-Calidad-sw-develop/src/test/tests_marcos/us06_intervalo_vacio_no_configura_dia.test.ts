import { describe, expect, it } from "vitest";
import { DiaDisponibilidad } from "../../domain/disponibilidad/DiaDisponibilidad";
import { DiaEstado } from "../../domain/disponibilidad/DiaEstado";
import { Intervalo } from "../../domain/intervalo/Intervalo";

describe("US03 - Estado del Día", () => {

  it("permanece SIN_ASIGNAR cuando solo existen intervalos sin configurar", () => {

    /// -arrange
    const usuarioId = "admin-test-001";
    const fecha = new Date("2026-06-01");
    const dia = new DiaDisponibilidad("dia-test-001",usuarioId,fecha);

  const intervalo = new Intervalo(
    "intervalo-test-001",
    null,
    null,
    null
  );

  dia.agregarIntervalo(intervalo);

    /// -act
    const estado = dia.obtenerEstado();

    /// -assert
    expect(estado).toBe(DiaEstado.SIN_ASIGNAR);

  });

});