# IyCS---Grupo-6-Ejecutable-del-M-dulo-2---Gesti-n-de-Disponibilidad---AgendaYA

This is a [Next.js](https://nextjs.org) project bootstrapped with [v0](https://v0.app).

## Built with v0

This repository is linked to a [v0](https://v0.app) project. You can continue developing by visiting the link below -- start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_xoy8IlIeeZ9c6qo54UOF41JL8Ose)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Tests E2E con Cypress

La suite de pruebas de punta a punta del módulo M02 (Gestión de Disponibilidad) está en [`cypress/e2e/disponibilidad.cy.ts`](cypress/e2e/disponibilidad.cy.ts). Todos los tests siguen el patrón **Arrange / Act / Assert**.

### 1. Instalar dependencias (solo la primera vez)

```bash
pnpm install
```

Esto instala Cypress y descarga su binario. Para verificar que quedó bien instalado:

```bash
npx cypress verify
```

### 2. Levantar la aplicación

En una terminal, dejá corriendo el servidor de desarrollo (los tests apuntan a `http://localhost:3000`):

```bash
pnpm dev
```

### 3. Ejecutar los tests

En **otra** terminal, elegí uno de los dos modos:

**Modo interactivo (con interfaz visual)** — ideal para ver los tests paso a paso y sacar capturas:

```bash
npx cypress open
```

Elegí **E2E Testing** → un navegador → **Start E2E Testing** → hacé clic en `disponibilidad.cy.ts`.

**Modo consola (headless)** — corre todo y muestra un resumen al final:

```bash
npx cypress run
```

También están disponibles como scripts: `pnpm cypress:open` y `pnpm cypress:run`.

### Tests incluidos

| Test | Flujo |
|---|---|
| T01 | Crear un intervalo laboral válido (09:00–12:00) el día 2 de abril |
| T02 | Error al guardar un intervalo con hora de fin anterior a la de inicio |
| T03 | Bloquear un día sin reservas (día 9) y verificar el estado "Bloqueado" |
| T04 | Advertencia al intentar bloquear el día 15, que tiene reservas en las próximas 24 hs |
| T05 | Error al guardar preferencias con una antelación no numérica |
| T06 | Guardar preferencias con valores válidos |

### Notas

- Si Cypress no puede conectarse a `localhost:3000`, verificá que `pnpm dev` esté corriendo.
- Cuando un test falla, Cypress guarda una captura en `cypress/screenshots/`. Para grabar video, poné `video: true` en [`cypress.config.ts`](cypress.config.ts); los videos quedan en `cypress/videos/`. Ambas carpetas están en el `.gitignore`.
- El `beforeEach` espera a que React termine de hidratar la página antes de interactuar. Sin esa espera, en modo dev los primeros clics se pierden y los tests fallan de forma intermitente.

## Learn More

To learn more, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
- [v0 Documentation](https://v0.app/docs) - learn about v0 and how to use it.
