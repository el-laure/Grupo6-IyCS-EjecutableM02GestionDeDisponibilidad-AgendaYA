import { describe, expect, it } from "vitest";
import { LimiteReservasDiarias } from "../../domain/preferencias/LimiteReservasDiarias";

describe('US_ADM_013 - Límite de reservas por día', () => {
  it('debería rechazar la acción cuando se introduce el número cero', () => {
    expect(() => {
      new LimiteReservasDiarias(0);
    }).toThrow("Ingrese un valor numérico entero mayor a cero.");
  });
});