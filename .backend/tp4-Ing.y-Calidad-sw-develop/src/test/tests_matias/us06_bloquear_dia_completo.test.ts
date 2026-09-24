import { describe, expect, it } from "vitest";
import { DiaDisponibilidad } from "../../domain/disponibilidad/DiaDisponibilidad";
import { DiaEstado } from "../../domain/disponibilidad/DiaEstado";

describe("US06 - Bloquear día completo", () => {

  it("retorna BLOQUEADO cuando el día fue bloqueado", () => {

    /// -arrange
    const usuarioId = "admin-test-001";
    const fecha = new Date("2026-06-01");
    const dia = new DiaDisponibilidad("dia-test-001",usuarioId,fecha);

    /// -act
    dia.bloquear();
    const estado = dia.obtenerEstado();

    /// -assert
    expect(estado).toBe(DiaEstado.BLOQUEADO);
  });

});
