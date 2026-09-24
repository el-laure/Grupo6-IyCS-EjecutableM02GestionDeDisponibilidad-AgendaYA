import { describe, expect, it } from "vitest";
import { Sesion } from "../../domain/sesion/Sesion"; // Ajustá la ruta según tu proyecto

describe("US1 - Escenario 2: Intento de acceso sin sesión activa", () => {

  it("Rechaza el acceso inmediato, redirecciona al login en menos de 2 segundos y muestra mensaje de error", () => {
    /// -arrange
    const sesionInvalida = new Sesion("", new Date(), "/");
    
    const tiempoIntento = 2000000; 
    const tiempoRedireccionCompleta = 2000500; // 0.5 segundos después

    /// -act
    const resultado = sesionInvalida.navegarA(
      "Disponibilidad", 
      tiempoIntento, 
      tiempoRedireccionCompleta
    );

    /// -assert
    expect(resultado.tiempoMs).toBeLessThanOrEqual(2000);
    expect(resultado.url).toBe("/login");
    expect(resultado.error).toBe("Debe iniciar sesión para acceder a esta sección.");
    expect(sesionInvalida.urlActual).toBe("/login");
  });

});