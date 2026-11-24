---
name: optimizacion-agentes-y-tokens
description: >-
  Protocolo avanzado de orquestación multi-agente, selección óptima de modelos,
  lectura económica y reducción drástica de consumo de tokens en el proyecto.
---

# Optimización de Agentes y Ahorro de Tokens

Usa esta skill para reducir latencia y gasto de tokens sin sacrificar precisión ni verificación empírica.

## 1. Presupuesto de Contexto (Antes de Leer)
1. Lee primero `PROJECT_STATE.md` (`~115` líneas) y `AGENTS.md` antes de inspeccionar archivos fuente.
2. Nunca leas archivos grandes completos si solo buscas una función: ubica líneas exactas con `python` / `findstr` / `rg -n` y usa `read_file` con `StartLine` y `EndLine` (`<= 150` líneas).
3. En archivos `.pdf` o `.docx`, extrae texto o métricas con scripts breves de Python (`import fitz`, `import docx`, `import pptx`) en lugar de volcar archivos enteros al contexto.

## 2. Paralelismo y Orquestación de Subagentes
- **Regla de Turno Único:** Dispara en paralelo todas las lecturas, búsquedas y ediciones independientes en un mismo turno.
- **Propiedad Exclusiva de Archivos:** Si lanzas `2+` subagentes en paralelo (`invoke_subagent`), asigna archivos distintos a cada uno para evitar conflictos de escritura o sobreescritura.
- **Selección Económica de Modelo por Subagente:**
  - `flash_lite`: Auditorías de texto, conteos, verificación de privacidad, limpieza de formato.
  - `flash`: Generación de scripts Python estándar, renderizado Pillow, edición de documentos Word/PPTX sobre especificaciones ya cerradas.
  - `inherit` / `pro`: Cambios arquitectónicos críticos en Next.js/Prisma, criptografía, transacciones ACID y diseño de sistemas.

## 3. Verificación en una Sola Pasada
- Consolida validaciones independientes en un único comando PowerShell (`; if ($?) { ... }`) tras tu última edición.
- En Windows PowerShell del proyecto, usa siempre `npm.cmd` y `npx.cmd` en lugar de `npm` / `npx`.
