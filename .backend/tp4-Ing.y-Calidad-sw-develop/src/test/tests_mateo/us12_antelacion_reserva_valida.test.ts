import { describe, expect, it } from "vitest";
import { AntelacionMinima } from "../../domain/preferencias/AntelacionMinima";
import { UnidadAntelacion } from "../../domain/preferencias/UnidadAntelacion";
import { PreferenciasReuniones } from "../../domain/preferencias/PreferenciaReuniones";

describe("US12 - Antelación de reserva válida", () => {

  it("Si se coloca un numero de antelación positivo, debe aceptarse", () => {

    /// -arrange
    const usuarioId = "admin-test-001";
    const preferencias = new PreferenciasReuniones(usuarioId);
    const antelacion = new AntelacionMinima(4, UnidadAntelacion.HORAS);

    /// -act
    preferencias.guardarAntelacionMinima(antelacion);
    const resultado = preferencias.obtenerAntelacionMinima();

    /// -assert
    expect(resultado?.valor).toBe(4);
    expect(resultado?.unidad).toBe(UnidadAntelacion.HORAS);

  });

});