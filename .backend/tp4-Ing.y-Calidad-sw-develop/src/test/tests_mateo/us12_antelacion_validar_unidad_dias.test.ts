import { describe, expect, it } from "vitest";
import { AntelacionMinima } from "../../domain/preferencias/AntelacionMinima";
import { UnidadAntelacion } from "../../domain/preferencias/UnidadAntelacion";
import { PreferenciasReuniones } from "../../domain/preferencias/PreferenciaReuniones";

describe("US_ADM_012 - Tiempo mínimo de antelación para reservas", () => {

  it("configura la antelación en días y conserva la unidad DIAS", () => {

    /// -arrange
    const usuarioId = "admin-test-001";
    const preferencias = new PreferenciasReuniones(usuarioId);
    const antelacion = new AntelacionMinima(
      2,
      UnidadAntelacion.DIAS
    );

    /// -act
    preferencias.guardarAntelacionMinima(antelacion);
    const resultado = preferencias.obtenerAntelacionMinima();

    /// -assert
    expect(resultado?.unidad).toBe(UnidadAntelacion.DIAS);

  });
});