---
name: auditoria-visual-office-pdf
description: >-
  Auditoría visual y estructural real de archivos PDF, Word (.docx) y PowerPoint
  (.pptx) mediante PyMuPDF, LibreOffice Headless y vistas PNG inspeccionables con read_file.
---

# Auditoría Visual de PDF, Word (`.docx`) y PowerPoint (`.pptx`)

Usa esta skill siempre que el usuario pida revisar cómo se ve realmente un PDF, un informe Word o una presentación PowerPoint (saltos de página, tablas desbordadas, texto superpuesto, contraste en proyector o numeración real).

## 1. Herramientas Disponibles en el Entorno
- **PyMuPDF (`import pymupdf`):** Extracción rápida de texto por página, conteo de páginas, dimensiones (`rect.width x rect.height`), detección de páginas vacías y renderizado directo a PNG.
- **LibreOffice Headless (`soffice.exe`):** Convierte `.docx` y `.pptx` a PDF real respetando saltos de página, secciones horizontales (`Landscape`) y anchos fijos XML.
- **Extensión de Editor (`cweijan.vscode-office`):** Permite al usuario abrir `.docx`, `.pptx`, `.xlsx` y `.pdf` directamente dentro de Antigravity IDE / VS Code sin salir del editor.

## 2. Flujo de Auditoría Visual en 2 Pasos
1. **Generar reporte métrico y miniaturas PNG** ejecutando:
   ```powershell
   python scratch/visual_audit_office.py "Fase 2\Presentacion_Final_Proyecto_APT_20min_Benjamin_Navarrete.pptx"
   ```
   O sobre el informe Word `2.6`:
   ```powershell
   python scratch/visual_audit_office.py "Fase 2\2.6_GuiaEstudiante_Fase_2_Informe_Final_Proyecto_APT_Benjamin_Navarrete.docx"
   ```
2. **Inspeccionar visualmente los PNGs críticos** con `read_file` sobre `scratch/visual_previews/<nombre>/page_001.png` (portada), páginas horizontales de tablas y últimas páginas para detectar visualmente:
   - Texto cortado o montado encima de otro elemento.
   - Tablas con columnas colapsadas o desbordadas fuera del margen.
   - Páginas completamente en blanco por saltos redundantes (`doc.add_page_break()` antes de `add_section(NEW_PAGE)`).
