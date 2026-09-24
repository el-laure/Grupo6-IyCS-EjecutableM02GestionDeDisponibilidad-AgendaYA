export class Sesion {
  constructor(
    public usuarioId: string,
    public ultimoAcceso: Date,
    public urlActual: string = "/dashboard"
  ) {}

  navegarA(
    modulo: string, 
    timestampClick: number, 
    timestampDestino: number
  ): { url: string; tiempoMs: number; error?: string } {
    
    const tiempoTranscurridoMs = timestampDestino - timestampClick;

    // Escenario 2: Sin sesión activa (usuarioId vacío)
    if (!this.usuarioId || this.usuarioId === "") {
      this.urlActual = "/login";
      return {
        url: this.urlActual,
        tiempoMs: tiempoTranscurridoMs,
        error: "Debe iniciar sesión para acceder a esta sección."
      };
    }

    // Escenario 3: Sesión expirada (Ej: más de 30 minutos de inactividad)
    const LIMITE_EXPIRACION_MS = 30 * 60 * 1000;
    const tiempoInactivo = timestampClick - this.ultimoAcceso.getTime();
    
    if (tiempoInactivo > LIMITE_EXPIRACION_MS) {
      this.urlActual = "/login";
      return {
        url: this.urlActual,
        tiempoMs: tiempoTranscurridoMs,
        error: "Su sesión ha expirado. Inicie sesión nuevamente."
      };
    }

    // Escenario 1: Acceso exitoso
    if (modulo === "Disponibilidad") {
      this.urlActual = `/admin/${this.usuarioId}/disponibilidad`;
    }

    return {
      url: this.urlActual,
      tiempoMs: tiempoTranscurridoMs
    };
  }
}