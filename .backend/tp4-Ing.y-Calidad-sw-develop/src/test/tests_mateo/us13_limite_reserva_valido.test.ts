import { describe, expect, it } from "vitest";
import { PreferenciasReuniones } from "../../domain/preferencias/PreferenciaReuniones";
import { LimiteReservasDiarias } from "../../domain/preferencias/LimiteReservasDiarias";

describe("US13 - Limite de reservas diarias válido", () => {

  it("Guarda un límite diario válido", () => {

    /// -arrange
    const usuarioId = "admin-test-001";
    const preferencias = new PreferenciasReuniones(usuarioId);
    const limite = new LimiteReservasDiarias(5);

    /// -act
    preferencias.guardarLimiteReservasDiarias(limite);
    const resultado = preferencias.obtenerLimiteReservasDiarias();

    /// -assert
    expect(resultado).not.toBeNull();
    expect(resultado?.cantidad).toBe(5);
  });

});