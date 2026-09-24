import { describe, expect, it } from "vitest";
import { DiaDisponibilidad } from "../../domain/disponibilidad/DiaDisponibilidad";
import { Intervalo } from "../../domain/intervalo/Intervalo";

describe("US10 - Eliminar intervalo existente", () => {

  it("elimina lógicamente un intervalo previamente configurado", () => {

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

    dia.configurarIntervalo(
      intervalo.id,
      new Date("2026-06-01T09:00:00"),
      new Date("2026-06-01T12:00:00"),
      "LABORAL"
    );

    /// -act
    dia.eliminarIntervalo(intervalo.id);

    /// -assert
    expect(intervalo.fechaBaja).not.toBeNull();
    expect(dia.obtenerIntervalos()).toHaveLength(0);

  });

});