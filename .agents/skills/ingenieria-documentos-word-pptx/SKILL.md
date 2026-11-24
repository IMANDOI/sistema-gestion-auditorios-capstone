---
name: ingenieria-documentos-word-pptx
description: >-
  Estándares de construcción y auditoría para el Informe Final Oficial 2.6 (.docx)
  y la Presentación Ejecutiva (.pptx) de la ASIGNATURA CAPSTONE (PTY4614 - 002D).
---

# Ingeniería de Documentos Word (`2.6`) y Presentaciones (`PPTX`)

Aplica esta skill cuando modifiques o regeneres entregables formales en `Fase 2/`.

## 1. Informe Final Word (`2.6_GuiaEstudiante_Fase_2_Informe_Final_Proyecto_APT_Benjamin_Navarrete.docx`)
- **Generador oficial:** `scratch/generate_new_official_guia26_report.py`.
- **Plantilla intocable:** Carga siempre una copia en memoria de `.user_uploaded/media_1794259064342_468ff1e8.docx`, preservando su header con logo Duoc UC y rellenando sus 3 tablas oficiales sin alterarla.
- **Formato oficial rúbrica (`2.7_APT122` pág. 4):** Cuerpo en `Calibri 11 pt`, interlineado `1.5`, tablas en `8.0–9.0 pt` con cabecera repetida (`w:tblHeader`) y filas indivisibles (`w:cantSplit`).
- **Idioma y privacidad:** `100%` español, `Benjamin Navarrete` sin tilde, `0` correos electrónicos, asignatura `ASIGNATURA CAPSTONE (PTY4614 - 002D)`.
- **Completitud obligatoria:** Mantener las `5` dificultades originales + `6` ajustes Arquitectura v2.0 (fórmula de 4 partes), tabla `T01–T12` de 8 columnas, `10` indicadores `IL 2.4`, matriz rúbrica `IE 1–10` y Anexos A y B (`Figuras 1–18`).

## 2. Presentación Ejecutiva PPTX (`Presentacion_Final_Proyecto_APT_20min_Benjamin_Navarrete.pptx`)
- **Generador oficial:** `scratch/generate_final_presentation_pptx.py` (`16:9`, `12` láminas, `100%` español).
- **Regla visual para telón blanco:** Fondo marfil mate `#F8F7F4` (nunca blanco puro ni fondo oscuro general), texto grafito `#1E293B` (contraste `> 11:1`) y tarjetas pasteles mate (Verde Salvia `#DCECE4`, Azul Polvo `#DCE6F2`, Arena `#F4E7DA`, Lavanda `#E8E3F2`).
- **Notas del orador:** Toda lámina debe incluir su bloque `[Min X:XX–Y:YY]` sumando exactamente `20` minutos (incluidos `4` minutos de demo en vivo en la lámina 10).

## 3. Verificación Obligatoria Post-Edición
Ejecutar siempre tras cualquier cambio:
```powershell
python scratch/generate_new_official_guia26_report.py; if ($?) { python scratch/verify_fase2_quality_privacy.py }
```
