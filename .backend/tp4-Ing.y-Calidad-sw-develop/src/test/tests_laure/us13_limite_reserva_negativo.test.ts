import { describe, expect, it } from "vitest";
import { LimiteReservasDiarias } from "../../domain/preferencias/LimiteReservasDiarias";

describe('US_ADM_013 - Límite de reservas por día', () => {
  it('debería rechazar la acción cuando se introduce un número entero negativo', () => {
     expect(() => {
      new LimiteReservasDiarias(-5);
    }).toThrow("Ingrese un valor numérico entero mayor a cero.");
  });
});