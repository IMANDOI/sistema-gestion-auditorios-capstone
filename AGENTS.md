# REGLAS MAESTRAS DEL WORKSPACE — PROYECTO CAPSTONE DUOC UC

> Archivo cargado automáticamente en el contexto del proyecto para eliminar errores repetitivos y evitar consumo innecesario de tokens re-explorando reglas básicas.

## 1. Identificación e Invariantes Obligatorias
- **Nombre Oficial del Proyecto:** `Sistema de Gestión y Control Operativo de Auditorios (SIGOA)` (**NO** usar el antiguo nombre largo con "Ciberseguridad" en el título).
- **Estudiante:** `Benjamin Navarrete` (**NUNCA** escribir tilde en `Benjamin`).
- **Privacidad Estricta:** **CERO** correos electrónicos personales o institucionales (`benjamin54144752123@gmail.com`, `@gmail.com`, `@duocuc.cl`) en informes, presentaciones, logs exportados o anexos visuales.
- **Asignatura:** `ASIGNATURA CAPSTONE (PTY4614 - 002D)` (siempre textual).
- **Profesor Guía:** `Diego Garcés M.`.
- **Fechas Oficiales:**
  - Presentación Evaluación Final Fase 2 (30%, ante Profesor Guía `Diego Garcés M.`): `Martes 1 de Diciembre de 2026`
  - Defensa Final ante Comisión Evaluadora (instancia posterior): `Jueves 10 de Diciembre de 2026`
- **Idioma de Entregables:** **100% español** (salvo identificadores técnicos de código). Prohibido agregar secciones en inglés.

## 2. Reglas de Entregables y Plantillas
- **Plantilla Oficial `2.6`:** Jamás modificar ni sobrescribir la plantilla original proporcionada por el usuario; trabajar siempre sobre copias generando `Fase 2/2.6_GuiaEstudiante_Fase_2_Informe_Final_Proyecto_APT_Benjamin_Navarrete.docx`.
- **Cero pérdida de contenido:** Cualquier actualización del informe debe conservar el 100% de los capítulos, las 5 dificultades originales, los 6 ajustes v2.0 (fórmula de 4 partes), la tabla de 8 columnas `T01–T12`, la rúbrica `IE 1–10` y el Anexo B (`Figuras 14–18`).
- **Presentación PPTX:** Minimalista, formal, 100% español, **paleta pastel mate de alto contraste sobre lienzo `#F8F7F4` con texto `#1E293B`** para proyección en telón blanco, 12 láminas y notas del orador para 20 minutos.

## 3. Reglas de Ejecución y Ahorro de Tokens
- **Primer paso obligatorio:** Consultar `PROJECT_STATE.md` antes de explorar carpetas o código.
- **Batching Paralelo:** Agrupar lecturas, búsquedas y ediciones independientes en un solo turno. Usar `read_file` con rangos (`StartLine`/`EndLine`) o `rg -n` en vez de leer archivos enteros largos.
- **Shell en Windows PowerShell:** Encadenar comandos dependientes con `; if ($?) { ... }` (PowerShell 5.1 no soporta `&&`) y usar `npm.cmd` / `npx.cmd` para evitar bloqueo de `ExecutionPolicy`.
- **Subagentes:** Usar propiedad exclusiva de archivos cuando trabajen en paralelo y elegir `flash` o `flash_lite` para tareas mecánicas o auditorías repetitivas, reservando `inherit`/`pro` para arquitectura e ingeniería compleja.
