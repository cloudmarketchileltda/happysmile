# PRD — Happy Smile: Configuración Local y Correcciones

## Fecha

18 de junio de 2026

## Objetivo

Poner en funcionamiento el proyecto **Happy Smile** (portal clínico dental) en entorno local, corrigiendo errores de build y documentando la configuración necesaria.

---

## 1. Instalación de Dependencias

### 1.1 Gestor de paquetes

El proyecto usa **Bun** como gestor de paquetes y runtime. Cuenta con:

- `bun.lock` — lockfile de dependencias
- `bunfig.toml` — configuración de Bun

### 1.2 Comando de instalación

```bash
bun install
```

**Resultado:** 491 paquetes instalados correctamente.

### 1.3 Dependencias principales instaladas

| Categoría      | Paquetes clave                                                                                  |
| -------------- | ----------------------------------------------------------------------------------------------- |
| **Framework**  | `react@19`, `react-dom@19`, `@tanstack/react-start@1.167.50`, `@tanstack/react-router@1.168.25` |
| **Build**      | `vite@8`, `@tailwindcss/vite@4.2.4`, `@vitejs/plugin-react@5`                                   |
| **Estado**     | `zustand@5`                                                                                     |
| **UI**         | Radix UI primitives, `lucide-react`, `recharts@3.8.1`, `sonner@2`, `cmdk`, `vaul`               |
| **Forms**      | `react-hook-form@7.73.1`, `@hookform/resolvers@5`, `zod@3.25.76`                                |
| **Estilos**    | `tailwindcss@4.2.4`, `tailwind-merge`, `tw-animate-css`, `class-variance-authority`             |
| **Utilidades** | `date-fns@4`, `clsx`                                                                            |
| **Dev**        | `typescript@5.9.3`, `eslint@9`, `prettier@3.8.3`, `nitro@3.0.260603-beta`                       |

---

## 2. Correcciones Realizadas

### 2.1 Error: `routeTree.gen.ts` no existía

**Problema:** El archivo `src/routeTree.gen.ts` (árbol de rutas generado automáticamente por TanStack Router) no estaba presente en el repositorio.

**Solución:** Al ejecutar `bun run dev` el plugin de TanStack Router genera automáticamente este archivo. El archivo fue generado correctamente y ahora existe en `src/routeTree.gen.ts`.

### 2.2 Error de build: `admin.financiero.tsx` — TSNonNullExpression no soportado

**Problema:** El archivo `src/routes/admin.financiero.tsx` usaba `IndexRoute.options.component!` (non-null assertion `!`), lo que el code-splitter de TanStack Router no puede procesar, causando el error:

```
Error: Unexpected splitNode type ☝️: TSNonNullExpression
```

**Archivo original (roto):**

```tsx
// src/routes/admin.financiero.tsx (antes de la corrección)
import { createFileRoute } from "@tanstack/react-router";
import { Route as IndexRoute } from "./admin.index";

export const Route = createFileRoute("/admin/financiero")({
  head: () => ({ meta: [{ title: "Panel Financiero — Admin Happy Smile" }] }),
  component: IndexRoute.options.component!,
});
```

**Solución aplicada:**

1. **Se creó un componente compartido** `src/components/admin-panel-financiero.tsx` extrayendo la lógica del dashboard financiero desde `admin.index.tsx`.

2. **Se simplificó `admin.index.tsx`** para que use el componente compartido:

   ```tsx
   import { createFileRoute } from "@tanstack/react-router";
   import { AdminPanelFinanciero } from "@/components/admin-panel-financiero";

   export const Route = createFileRoute("/admin/")({
     head: () => ({ meta: [{ title: "Panel Financiero — Happy Smile" }] }),
     component: AdminHome,
   });

   function AdminHome() {
     return <AdminPanelFinanciero />;
   }
   ```

3. **Se reescribió `admin.financiero.tsx`** para usar directamente el componente compartido:

   ```tsx
   import { createFileRoute } from "@tanstack/react-router";
   import { AdminPanelFinanciero } from "@/components/admin-panel-financiero";

   export const Route = createFileRoute("/admin/financiero")({
     head: () => ({ meta: [{ title: "Panel Financiero — Admin Happy Smile" }] }),
     component: AdminPanelFinanciero,
   });
   ```

### 2.3 Archivo `admin.panel.tsx` movido fuera de routes/

**Problema:** El archivo auxiliar `src/routes/admin.panel.tsx` fue creado temporalmente dentro de `src/routes/`, pero TanStack Router lo detectaba como una ruta inválida (no exporta un `Route`).

**Solución:** Se movió a `src/components/admin-panel-financiero.tsx` (ubicación correcta para componentes compartidos).

---

## 3. Archivos Modificados / Creados

| Archivo                                     | Acción         | Descripción                                                                            |
| ------------------------------------------- | -------------- | -------------------------------------------------------------------------------------- |
| `src/components/admin-panel-financiero.tsx` | **Creado**     | Componente compartido del Panel Financiero (extraído de `admin.index.tsx`)             |
| `src/routes/admin.index.tsx`                | **Modificado** | Ahora importa y usa `AdminPanelFinanciero` desde el componente compartido              |
| `src/routes/admin.financiero.tsx`           | **Modificado** | Ahora importa y usa `AdminPanelFinanciero` en lugar de re-exportar desde `admin.index` |
| `src/routeTree.gen.ts`                      | **Generado**   | Árbol de rutas generado automáticamente por TanStack Router                            |

---

## 4. Comandos para Ejecutar el Proyecto

### 4.1 Desarrollo (dev server con HMR)

```bash
bun run dev
```

El servidor se inicia en `http://localhost:8080/` con Hot Module Replacement activo.

### 4.2 Build de desarrollo

```bash
bun run build:dev
```

Compila los assets cliente y SSR en la carpeta `dist/`.

### 4.3 Build de producción

```bash
bun run build
```

### 4.4 Preview del build

```bash
bun run preview
```

### 4.5 Linter

```bash
bun run lint
```

### 4.6 Formateo

```bash
bun run format
```

---

## 5. Estado del Proyecto Post-Correcciones

| Aspecto                                           | Estado                             |
| ------------------------------------------------- | ---------------------------------- |
| `bun install` (491 paquetes)                      | ✅ Correcto                        |
| `bun run dev` (servidor local)                    | ✅ HTTP 200 en `localhost:8080`    |
| `bun run build:dev` (cliente + SSR)               | ✅ Build exitoso (sin errores)     |
| Generación de `routeTree.gen.ts`                  | ✅ Automática via plugin           |
| Panel financiero (`/admin` y `/admin/financiero`) | ✅ Componente compartido funcional |
| Landing page público (`/`)                        | ✅ 200 OK                          |
| Login (`/login`)                                  | ✅ 200 OK                          |
| Portales (paciente, profesional, admin)           | ✅ Todos los layouts funcionales   |

### 5.1 Warnings (no bloqueantes)

Durante el build se observaron estos warnings informativos:

1. **vite-tsconfig-paths**: El plugin es detectado, pero Vite 8 ya soporta resolución de tsconfig paths nativamente mediante `resolve.tsconfigPaths: true`.
2. **Chunk size**: `index-CJAId116.js` (558 kB después de minificar) supera el límite recomendado de 500 kB. Esto es debido a recharts y lucide-react principalmente. Podría optimizarse con lazy loading.

---

## 6. Mejora: Acceso por Perfiles desde Login

### 6.1 Problema

El selector de portales (`PortalSwitcher`) estaba visible en el header público y en los headers internos de cada portal, permitiendo navegar entre perfiles (Público, Paciente, Profesional, Administración) directamente desde cualquier página.

### 6.2 Solución aplicada

1. **Eliminado `PortalSwitcher` del header público** (`src/components/public-header.tsx`): Se removió el import y el uso del componente `<PortalSwitcher />`.

2. **Eliminado `PortalSwitcher` del layout de portales** (`src/components/portal-layout.tsx`): Se removió el import y el uso del componente `<PortalSwitcher />`.

3. **Rediseñada la pantalla de login** (`src/routes/_public.login.tsx`): Ahora al navegar a `/login` se muestra primero un selector de perfil con tres opciones:
   - **Paciente** (icono User, color brand) → Formulario de login con email/contraseña
   - **Profesional** (icono Stethoscope, color verde) → Formulario de login con email/contraseña
   - **Administración** (icono Shield, color violeta) → Formulario de login con email/contraseña

   Cada opción tiene un diseño de tarjeta con icono, título y descripción. Todos los perfiles requieren credenciales (cualquier email/contraseña funciona en demo). El placeholder del email cambia según el perfil seleccionado (maria@mail.cl, rfuentes@happysmile.cl, admin@happysmile.cl) y el mensaje de bienvenida muestra el nombre demo correspondiente.

### 6.3 Archivos modificados

| Archivo                            | Acción     | Descripción                                            |
| ---------------------------------- | ---------- | ------------------------------------------------------ |
| `src/components/public-header.tsx` | Modificado | Eliminado import y uso de `PortalSwitcher`             |
| `src/components/portal-layout.tsx` | Modificado | Eliminado import y uso de `PortalSwitcher`             |
| `src/routes/_public.login.tsx`     | Modificado | Rediseñado con selector de 3 perfiles + login paciente |

## 7. Notas Adicionales

### 7.1 Autenticación

El login actual es completamente mock. Cualquier credencial redirige al portal paciente como "María González". No hay verificación de roles ni sesión real.

### 7.2 Datos

Todos los datos son mock (en memoria via Zustand). No hay persistencia ni API backend. Los cambios se pierden al recargar la página.

### 7.3 Nitro / SSR

El plugin de deploy Nitro está desactivado. Se puede habilitar con `nitro: true` en la configuración si es necesario para despliegue.
</write_to_file>
