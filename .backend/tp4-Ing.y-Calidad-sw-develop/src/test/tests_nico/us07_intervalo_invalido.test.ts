import { describe, expect, it } from "vitest";
import { DiaDisponibilidad } from "../../domain/disponibilidad/DiaDisponibilidad";
import { Intervalo } from "../../domain/intervalo/Intervalo";

describe("US07 - Rechazar intervalo inválido", () => {

  it("lanza error cuando fecha_inicio es mayor que fecha_fin", () => {

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

    const fechaH_inicio = new Date("2026-06-01T10:00:00");

    const fechaH_fin = new Date("2026-06-01T09:00:00");

    /// -act + assert
    expect(() =>
      dia.configurarIntervalo(
        intervalo.id,
        fechaH_inicio,
        fechaH_fin,
        "LABORAL"
      )
    ).toThrow("La hora de inicio debe ser menor que la hora de fin");

  });

});