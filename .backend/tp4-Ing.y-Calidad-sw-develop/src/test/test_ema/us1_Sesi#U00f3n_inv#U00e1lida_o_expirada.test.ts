import { describe, expect, it } from "vitest";
import { Sesion } from "../../domain/sesion/Sesion"; // Ajustá la ruta según tu proyecto

describe("US1 - Escenario 3: Sesión inválida o expirada", () => {

  it("Bloquea el acceso por expiración, redirecciona al login y muestra mensaje de advertencia", () => {
    /// -arrange
    const adminId = "admin-123";
    // Último acceso hace 40 minutos (supera el límite de 30 minutos)
    const ultimoAcceso = new Date(Date.now() - 40 * 60 * 1000); 
    const sesionExpirada = new Sesion(adminId, ultimoAcceso, "/dashboard");

    const tiempoIntento = Date.now();
    const tiempoRedireccionCompleta = tiempoIntento + 600; // 0.6 segundos después

    /// -act
    const resultado = sesionExpirada.navegarA(
      "Disponibilidad", 
      tiempoIntento, 
      tiempoRedireccionCompleta
    );

    /// -assert
    expect(resultado.url).toBe("/login");
    expect(resultado.error).toBe("Su sesión ha expirado. Inicie sesión nuevamente.");
    expect(sesionExpirada.urlActual).toBe("/login");
  });

});