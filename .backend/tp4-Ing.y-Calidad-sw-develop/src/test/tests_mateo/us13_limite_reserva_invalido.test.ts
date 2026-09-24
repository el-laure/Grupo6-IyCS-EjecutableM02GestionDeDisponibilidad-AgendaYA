import { describe, expect, it } from "vitest";

import { PreferenciasReuniones } from "../../domain/preferencias/PreferenciaReuniones";
import { LimiteReservasDiarias } from "../../domain/preferencias/LimiteReservasDiarias";

describe("US_ADM_013 - Límite de reservas por día", () => {

  it("no guarda un límite diario inválido", () => {

    /// -arrange
    const usuarioId = "admin-test-001";
    const preferencias = new PreferenciasReuniones(usuarioId);

    /// -act
    try {
      const limite = new LimiteReservasDiarias(0);
      preferencias.guardarLimiteReservasDiarias(limite);
    } catch {
      // se espera que el límite inválido sea rechazado.
    }

    const resultado = preferencias.obtenerLimiteReservasDiarias();

    /// -assert
    expect(resultado).toBeNull();
  });

});