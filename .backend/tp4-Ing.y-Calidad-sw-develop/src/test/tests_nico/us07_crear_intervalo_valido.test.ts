import { describe, expect, it } from "vitest";
import { DiaDisponibilidad } from "../../domain/disponibilidad/DiaDisponibilidad";
import { Intervalo } from "../../domain/intervalo/Intervalo";

describe("US07 - Crear intervalo laboral válido", () => {

  it("configura correctamente un intervalo cuando fecha_inicio < fecha_fin", () => {

    /// -arrange
    const usuarioId = "admin-test-001";
    const fecha = new Date("2026-06-01");
    const dia = new DiaDisponibilidad("dia-test-001",usuarioId,fecha);

    const fechaH_inicio = new Date("2026-06-01T09:00:00");

    const fechaH_fin = new Date("2026-06-01T12:00:00");

    const intervalo = new Intervalo(
      "intervalo-test-001",
      null,
      null,
      null
    );

    dia.agregarIntervalo(intervalo);

    /// -act
    dia.configurarIntervalo(
      intervalo.id,
      fechaH_inicio,
      fechaH_fin,
      "LABORAL"
    );

    /// -assert
    expect(intervalo.horaInicio).toEqual(fechaH_inicio);

    expect(intervalo.horaFin).toEqual(fechaH_fin);

    expect(intervalo.tipo).toBe("LABORAL");

    expect(dia.obtenerIntervalos()).toHaveLength(1);
  });

});