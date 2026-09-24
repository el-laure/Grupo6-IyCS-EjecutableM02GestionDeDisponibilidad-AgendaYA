import { describe, expect, it } from "vitest";
import { Sesion } from "../../domain/sesion/Sesion"; // Ajustá la ruta según tu proyecto

describe("US1 - Escenario 1: Acceso exitoso al módulo", () => {

  it("Redirecciona al módulo de disponibilidad en menos de 3 segundos con la URL correcta", () => {
    /// -arrange
    const adminId = "admin-123";
    const ahora = new Date();
    const sesionAdmin = new Sesion(adminId, ahora, "/dashboard");
    
    const tiempoClick = ahora.getTime(); 
    const tiempoCargaInterfazCompleta = tiempoClick + 1500; // 1.5 segundos después

    /// -act
    const resultado = sesionAdmin.navegarA(
      "Disponibilidad", 
      tiempoClick, 
      tiempoCargaInterfazCompleta
    );

    /// -assert
    expect(resultado.tiempoMs).toBeLessThanOrEqual(3000);
    expect(resultado.url).toBe(`/admin/${adminId}/disponibilidad`);
    expect(resultado.error).toBeUndefined();
    expect(sesionAdmin.urlActual).toBe(`/admin/${adminId}/disponibilidad`);
  });

});