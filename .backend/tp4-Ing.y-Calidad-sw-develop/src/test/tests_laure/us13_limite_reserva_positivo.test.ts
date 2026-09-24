import { describe, expect, it } from "vitest";
import { LimiteReservasDiarias } from "../../domain/preferencias/LimiteReservasDiarias";

describe('US_ADM_013 - Límite de reservas por día', () => {
  it('debería aceptar la acción cuando se introduce un número entero positivo', () => {
    const limite = new LimiteReservasDiarias(5);
    expect(limite.cantidad).toBe(5);
  });
});