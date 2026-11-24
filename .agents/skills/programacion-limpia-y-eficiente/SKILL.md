---
name: programacion-limpia-y-eficiente
description: >-
  Estándar de ingeniería de software para desarrollo veloz, limpio y ordenado en Next.js,
  TypeScript y Prisma. Impone edición quirúrgica de código (ahorro extremo de tokens y latencia),
  desacoplamiento modular, validación estricta de tipos con Zod y verificación de compilación sin errores.
---

# Skill: Programación Limpia, Rápida y Eficiente (Clean Code & High Performance)

Esta habilidad rige cada modificación, creación o refactorización de código fuente en el proyecto. Su objetivo es maximizar la velocidad de respuesta, garantizar cero errores de compilación y evitar el desperdicio de tokens.

---

## 1. Regla de Edición Quirúrgica (Velocidad y Ahorro de Tokens)
* **Prohibición de reescritura masiva:** Si un archivo tiene más de 100 líneas (como `admin/page.tsx` o `MaintenanceDashboard.tsx`), **está estrictamente prohibido sobreescribir el archivo completo** para realizar ajustes locales.
* **Técnica exigida:** Utilizar ediciones quirúrgicas dirigidas exclusivamente a las líneas o funciones modificadas (`edit_file`).
* **Beneficio:** Reduce el tiempo de respuesta de 60 segundos a menos de 5 segundos y ahorra hasta un 95% de tokens por operación.

---

## 2. Arquitectura Modular y Desacoplada (Principio de Responsabilidad Única)
* **Límite de tamaño sugerido:** Ningún componente visual debe sobrepasar las 200 líneas de código.
* **Estructura limpia del proyecto:**
  * `src/components/`: Componentes visuales puros (UI reactiva, inputs, modales, gráficos).
  * `src/lib/actions.ts`: Server Actions seguras en backend (transacciones Prisma, queries, lógica de negocio).
  * `src/lib/validations/`: Esquemas de validación **Zod** para blindar la entrada de datos.
  * `src/types/`: Interfaces y tipos de TypeScript compartidos.

---

## 3. Contrato Estricto de Server Actions (Cero Sorpresas)
Toda Server Action debe retornar siempre un objeto tipado predecible:

```typescript
// Contrato estándar de respuesta segura
type ActionResponse<T> = 
  | { success: true; data: T; message?: string }
  | { success: false; error: string; code?: string };
```

* **Validación en la puerta:** Validar siempre los argumentos de entrada con `schema.safeParse(data)` antes de invocar a Prisma.
* **Try/Catch Defensivo:** Todo acceso a la base de datos debe capturar excepciones y registrar un mensaje amigable al usuario sin exponer trazas de servidor sensibles.

---

## 4. Tipado Estricto de TypeScript (Eliminación de Type Drift)
* **Prohibido el uso de `any`:** Usar interfaces explícitas o inferir tipos directamente desde Prisma (`Prisma.ReservaGetPayload<...>`).
* Si TypeScript arroja un error de tipos, corregir la interfaz de inmediato; jamás usar `// @ts-ignore` o `as any` como atajo parche.

---

## 5. Protocolo de Verificación Inmediata (Cero Regresiones)
Tras modificar archivos `.ts` o `.tsx`, la IA debe verificar que el código sigue siendo 100% válido ejecutando:
`npx tsc --noEmit` o la comprobación de build correspondiente.
Si surge un error, se repara inmediatamente en el mismo turno antes de entregar la respuesta al usuario.

