// cypress/e2e/disponibilidad.cy.ts
// Suite E2E - M02 Gestion de Disponibilidad - AgendaYA
// Patron obligatorio: Arrange / Act / Assert en cada test

describe('M02 - Gestion de Disponibilidad | AgendaYA', () => {
  beforeEach(() => {
    // Cada test arranca desde la pagina principal (abril 2026 por defecto)
    cy.visit('/')
    // Esperamos que el calendario este visible antes de ejecutar cada test
    cy.get('[data-cy="calendar-day-1"]').should('be.visible')
    // Esperamos que React termine de hidratar la pagina (Next.js en modo dev).
    // Sin esto, los clics que ocurren antes de la hidratacion se pierden.
    cy.get('[data-cy="calendar-day-1"]').should(($el) => {
      expect(Object.keys($el[0]).some((key) => key.startsWith('__reactFiber'))).to.eq(true)
    })
  })

  // ====================================================================
  // TEST 1 - Flujo Principal (Happy Path): Crear horario laboral
  // Responsable: Integrante 1
  // Criterio cubierto: US_ADM_007 - Escenario 1 (creacion exitosa)
  // ====================================================================
  it('T01 - Permite agregar un nuevo intervalo laboral exitosamente', () => {
    // -- Arrange ------------------------------------------------------
    // Seleccionamos el dia 2 de abril (disponible, sin intervalos previos)
    cy.get('[data-cy="calendar-day-2"]').click()
    // Verificamos que el panel de detalle refleja estado Disponible
    cy.get('[data-cy="day-status-pill"]').should('contain.text', 'Disponible')
    // Abrimos el modal de nuevo intervalo
    cy.get('[data-cy="add-interval-button"]').click()
    // Verificamos que el modal se abrio correctamente
    cy.get('[data-cy="interval-start-input"]').should('be.visible')

    // -- Act ----------------------------------------------------------
    // Ingresamos hora de inicio valida
    cy.get('[data-cy="interval-start-input"]').type('09:00')
    // Ingresamos hora de fin valida (posterior a la de inicio)
    cy.get('[data-cy="interval-end-input"]').type('12:00')
    // Confirmamos que el radio Laboral viene seleccionado por defecto
    cy.get('[data-cy="laboral-type-radio"]').should('be.checked')
    // Guardamos el intervalo
    cy.get('[data-cy="save-interval-button"]').click()

    // -- Assert -------------------------------------------------------
    // Verificamos que el modal se cerro
    cy.get('[data-cy="save-interval-button"]').should('not.exist')
    // Verificamos que aparece el toast de confirmacion de exito
    cy.get('[data-cy="notification"]').should('be.visible')
    cy.get('[data-cy="notification"]').should('contain.text', 'El intervalo se creó correctamente')
    // Verificamos que el badge del dia cambio a "Configurado"
    cy.get('[data-cy="day-status-pill"]').should('contain.text', 'Configurado')
  })

  // ====================================================================
  // TEST 2 - Flujo de Error: Validacion de datos invalidos
  // Responsable: Integrante 2
  // Criterio cubierto: US_ADM_007 - Validacion hora fin > hora inicio
  // ====================================================================
  it('T02 - Muestra error cuando la hora de fin es anterior a la hora de inicio', () => {
    // -- Arrange ------------------------------------------------------
    // Seleccionamos el dia 4 (disponible para agregar intervalos)
    cy.get('[data-cy="calendar-day-4"]').click()
    // Abrimos el modal de nuevo intervalo
    cy.get('[data-cy="add-interval-button"]').click()
    // Verificamos que el modal esta abierto
    cy.get('[data-cy="interval-start-input"]').should('be.visible')

    // -- Act ----------------------------------------------------------
    // Ingresamos hora de inicio: 15:00
    cy.get('[data-cy="interval-start-input"]').type('15:00')
    // Ingresamos hora de fin ANTERIOR a la de inicio: 10:00 (invalido)
    cy.get('[data-cy="interval-end-input"]').type('10:00')
    // Intentamos guardar el intervalo con datos invalidos
    cy.get('[data-cy="save-interval-button"]').click()

    // -- Assert -------------------------------------------------------
    // El sistema debe rechazar y mostrar un mensaje de error
    cy.get('[data-cy="notification"]').should('be.visible')
    cy.get('[data-cy="notification"]').should('contain.text', 'La hora de fin debe ser posterior a la hora de inicio')
    // El modal debe permanecer abierto (la accion fue rechazada)
    cy.get('[data-cy="save-interval-button"]').should('be.visible')
    // El boton de cancelar tambien sigue disponible
    cy.get('[data-cy="cancel-interval-button"]').should('be.visible')
  })

  // ====================================================================
  // TEST 3 - Flujo de Bloqueo de Dia
  // Responsable: Integrante 3
  // Criterio cubierto: US_ADM_008 - CA-4 (bloquear dia sin reservas proximas)
  // ====================================================================
  it('T03 - Permite bloquear un dia sin reservas activas y muestra estado Bloqueado', () => {
    // -- Arrange ------------------------------------------------------
    // Seleccionamos el dia 9 de abril (tiene intervalo laboral, sin reservas proximas)
    cy.get('[data-cy="calendar-day-9"]').click()
    // Verificamos que el dia NO esta bloqueado inicialmente
    cy.get('[data-cy="day-status-pill"]').should('not.contain.text', 'Bloqueado')
    // Verificamos que el boton de bloquear esta habilitado
    cy.get('[data-cy="block-day-button"]').should('not.be.disabled')

    // -- Act ----------------------------------------------------------
    // Bloqueamos el dia seleccionado
    cy.get('[data-cy="block-day-button"]').click()

    // -- Assert -------------------------------------------------------
    // El badge del estado debe indicar "Bloqueado"
    cy.get('[data-cy="day-status-pill"]').should('contain.text', 'Bloqueado')
    // El boton de bloquear debe desaparecer y aparecer el de desbloquear
    cy.get('[data-cy="unblock-day-button"]').should('be.visible')
    cy.get('[data-cy="block-day-button"]').should('not.exist')
    // Verificamos el toast de confirmacion de bloqueo exitoso
    cy.get('[data-cy="notification"]').should('be.visible')
    cy.get('[data-cy="notification"]').should('contain.text', 'El día quedó bloqueado')
  })

  // ====================================================================
  // TEST 4 - Flujo de Error por Estado del Sistema: Reservas en 24hs
  // Responsable: Integrante 4
  // Criterio cubierto: US_ADM_008 - CA-3 (rechazar bloqueo con reservas en <24hs)
  // ====================================================================
  it('T04 - Muestra advertencia y rechaza el bloqueo del dia 15 con reservas en las proximas 24hs', () => {
    // -- Arrange ------------------------------------------------------
    // El dia 15 de abril esta pre-configurado con una reserva activa en <24hs
    // La app carga directamente en abril 2026, verificamos que el dia 15 es accesible
    cy.get('[data-cy="calendar-day-15"]').click()
    // Verificamos la fecha seleccionada en el panel de detalle
    cy.get('[data-cy="selected-date-text"]').should('contain.text', '15')
    // Verificamos que el dia 15 no esta bloqueado antes de la accion
    cy.get('[data-cy="day-status-pill"]').should('not.contain.text', 'Bloqueado')

    // -- Act ----------------------------------------------------------
    // Intentamos bloquear el dia 15 (tiene reservas en las proximas 24hs)
    cy.get('[data-cy="block-day-button"]').click()

    // -- Assert -------------------------------------------------------
    // El sistema debe mostrar la advertencia de reservas activas en el toast
    cy.get('[data-cy="notification"]').should('be.visible')
    cy.get('[data-cy="notification"]').should('contain.text', 'reservas activas dentro de las próximas 24')
    // El dia NO debe quedar bloqueado (badge sin cambios)
    cy.get('[data-cy="day-status-pill"]').should('not.contain.text', 'Bloqueado')
    // El boton de bloquear sigue presente (la accion fue rechazada)
    cy.get('[data-cy="block-day-button"]').should('be.visible')
  })

  // ====================================================================
  // TEST 5 - Flujo de Error: Preferencias de reuniones invalidas
  // Responsable: Integrante 5
  // Criterio cubierto: US_ADM_010 - Validacion de antelacion minima
  // ====================================================================
  it('T05 - Rechaza guardar preferencias con una antelacion no numerica', () => {
    // -- Arrange ------------------------------------------------------
    // Hacemos scroll hasta la seccion de preferencias para asegurarnos que sea visible
    cy.get('[data-cy="lead-time-input"]').scrollIntoView()
    cy.get('[data-cy="lead-time-input"]').should('be.visible')
    cy.get('[data-cy="save-preferences-button"]').should('be.visible')

    // -- Act ----------------------------------------------------------
    // Borramos el valor actual, ingresamos texto no numerico e intentamos guardar
    cy.get('[data-cy="lead-time-input"]').clear().type('abc')
    cy.get('[data-cy="save-preferences-button"]').click()

    // -- Assert -------------------------------------------------------
    // El sistema debe rechazar el guardado con un mensaje de error claro
    cy.get('[data-cy="notification"]').should('be.visible')
    cy.get('[data-cy="notification"]').should('contain.text', 'Ingrese un valor numérico entero mayor a cero')
  })

  // ====================================================================
  // TEST 6 - Flujo Principal: Guardar preferencias de reuniones validas
  // Responsable: Integrante 6 (opcional)
  // Criterio cubierto: US_ADM_010 - Guardado exitoso de preferencias
  // ====================================================================
  it('T06 - Guarda correctamente preferencias con valores numericos validos', () => {
    // -- Arrange ------------------------------------------------------
    // Hacemos scroll hasta la seccion de preferencias
    cy.get('[data-cy="lead-time-input"]').scrollIntoView()
    cy.get('[data-cy="lead-time-input"]').should('be.visible')

    // -- Act ----------------------------------------------------------
    // Ingresamos valores enteros positivos en ambos campos y guardamos
    cy.get('[data-cy="lead-time-input"]').clear().type('2')
    cy.get('[data-cy="daily-limit-input"]').clear().type('3')
    cy.get('[data-cy="save-preferences-button"]').click()

    // -- Assert -------------------------------------------------------
    // El sistema debe confirmar que las preferencias fueron guardadas
    cy.get('[data-cy="notification"]').should('be.visible')
    cy.get('[data-cy="notification"]').should('contain.text', 'Preferencias guardadas correctamente')
  })
})
