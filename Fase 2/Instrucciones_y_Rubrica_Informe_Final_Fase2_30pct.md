# INSTRUCCIONES OFICIALES Y RÚBRICA DE EVALUACIÓN
## Asignatura Capstone (PTY4614 / APT122) — Escuela de Informática y Telecomunicaciones, Duoc UC
### Evaluación Parcial Fase 2 (30%) — Informe Final Proyecto APT

---

## 1. Identificación de la Evaluación
* **Nombre de la Evaluación:** Evaluación Parcial Fase 2 - Informe Final / Fase 2 (30%) - Informe final Proyecto APT
* **Sigla / Asignatura:** PTY4614 / Capstone
* **Ponderación:** 30% de la nota final de la asignatura
* **Tiempo Asignado:** Semana 15
* **Tiempo de Exposición:** 20 minutos por grupo ante la comisión evaluadora (simulando gerencia de proyecto).
* **Fecha de Entrega y Presentación:** Martes 24 de Noviembre de 2026, 14:30 hrs (UTC-3).
* **Carácter de la Evaluación:** Trabajo grupal con calificación y defensa de carácter estrictamente individual.

---

## 2. Requisitos de Estructura y Formato Obligatorio

### Apartados Específicos Exigidos
1. **Abstract:** Redactado obligatoriamente en **Español** e **Inglés**.
2. **Conclusiones Individuales:** Redactadas **exclusivamente en Inglés** (*Individual Conclusions*).
3. **Reflexión Individual:** Redactada **exclusivamente en Inglés** (*Individual Reflection*).

### Contenidos Fundamentales del Informe
1. **Metodología implementada** que permita el logro de los objetivos propuestos según estándares de la disciplina.
2. **Evidencias** que dan cuenta del cumplimiento del proyecto en documentación, programación y almacenamiento de datos.
3. **Descripción del aporte del proyecto** en el desarrollo de sus intereses profesionales y proyecciones laborales.
4. **Competencias del perfil de egreso** evidenciadas en el desarrollo de su proyecto.
5. **Indicadores de calidad** requeridos en el diseño e implantación de software.

### Parámetros de Formato y Estilo Formal
* **Estructura:** Portada oficial, Índice general, Abstract (ESP/ENG), Contenidos de ingeniería y desarrollo, Conclusiones individuales (ENG), Reflexiones individuales (ENG), Referencias bibliográficas, Anexo de evidencias.
* **Tipografía:** Arial, Calibri o Verdana, tamaño 11 o 12 pt.
* **Interlineado:** 1,0 o 1,5 según corresponda.
* **Numeración:** Paginación formal en todas las páginas.
* **Ortografía y Redacción:** Rigor gramatical estricto (0 faltas), vocabulario disciplinar preciso.
* **Citas y Fuentes:** Normas APA 7ma Edición / IEEE.
* **Repositorio Git:** Control de versiones exhaustivo en GitHub con commits trazables de avance y documentación sincronizada.

---

## 3. Matriz de Competencias e Indicadores de Calidad del Perfil de Egreso (IL 2.4)

| Competencia del Perfil de Egreso | Indicador de Calidad | Evidencia en el Proyecto APT |
| :--- | :--- | :--- |
| **1. Pruebas de Certificación**<br>Realizar pruebas de certificación tanto de los productos como de los procesos utilizando buenas prácticas definidas por la industria. | **1.1** Diseña pruebas de validación de productos y procesos.<br>**1.2** Aplica pruebas de validación con buenas prácticas.<br>**1.3** Desarrolla mejoras al producto en base al resultado de las pruebas. | • Suite automatizada en Node.js (`iso25010.test.mjs`) cubriendo 4 características ISO 25010.<br>• Pruebas de carga, concurrencia y validación de tipos con Zod.<br>• GitHub Actions CI con ejecución en cada push/PR. |
| **2. Gestión de Proyectos**<br>Gestionar proyectos informáticos, ofreciendo alternativas para la toma de decisiones de acuerdo a los requerimientos de la organización. | **2.1** Planifica proyectos informáticos ofreciendo alternativas.<br>**2.2** Controla proyectos de acuerdo a los requerimientos. | • Carta Gantt con 12 tareas operativas (`T01` a `T12`).<br>• Matriz de gestión de riesgos IRP (SEV-1 a SEV-4).<br>• Justificación formal de 4 partes para cada ajuste técnico. |
| **3. Modelos de Datos**<br>Construir modelos de datos para soportar los requerimientos de la organización de acuerdo a un diseño definido y escalable en el tiempo. | **3.1** Diseña modelos de datos definidos y escalables.<br>**3.2** Implementa modelos de datos soportando requerimientos. | • Modelo relacional 3FN con 10 entidades en Prisma ORM.<br>• Despliegue en PostgreSQL Serverless sobre Neon Cloud.<br>• Índices de optimización, claves foráneas e integridad referencial estricta. |
| **4. Solución de Software**<br>Desarrollar una solución de software utilizando técnicas que permitan sistematizar el proceso de desarrollo y mantenimiento, asegurando el logro de los objetivos. | **4.1** Construye una solución de software sistematizada.<br>**4.2** Integra los distintos componentes de la solución.<br>**4.3** Implanta la solución asegurando el logro de objetivos. | • Frontend responsivo en Next.js 15, React 19 y Tailwind CSS.<br>• Backend modular en Next.js Server Actions y Web Audio API.<br>• Escáner QR de alto rendimiento y 4 bots de automatización RPA.<br>• Despliegue continuo en producción en Vercel con SSL/TLS. |

---

## 4. Tabla de Especificaciones y Rúbrica Oficial (100 Puntos)

| Criterio / Indicador de Evaluación | % Ponderación | Exigencia para Logro Completo (100%) |
| :--- | :---: | :--- |
| **IE 1: Metodología** | 10% | Describe la metodología utilizada de acuerdo a los estándares de la disciplina, alcanzando todos los objetivos propuestos para el proyecto. |
| **IE 2: Evidencias de Cumplimiento** | 20% | Genera evidencias que dan cuenta del cumplimiento del Proyecto CAPSTONE, en relación a documentación, programación y almacenamiento de datos, de acuerdo a lo planificado y cumpliendo con estándares de la industria. |
| **IE 3: Intereses Profesionales** | 5% | Menciona los intereses profesionales y explica con claridad cómo estos se ven reflejados en el proyecto. |
| **IE 4: Competencias del Perfil de Egreso** | 5% | Describe una relación coherente entre el proyecto y el perfil de egreso del plan de estudio, especificando cómo debe utilizar distintas competencias para desarrollar su Proyecto APT. |
| **IE 5: Lenguaje Técnico Disciplinar** | 5% | Utiliza lenguaje técnico de su disciplina en todos los entregables de avance y finales del proyecto. |
| **IE 6: Redacción, Ortografía y Citas** | 5% | El texto cumple con las reglas de ortografía y redacción en todos sus apartados Y utiliza correctamente todas las normas de citación y referencias (0 faltas). |
| **IE 7: Documentación y Control en Git** | 15% | Entrega la documentación y evidencias requeridas por la asignatura de acuerdo a la estructura y nombres solicitados, guardando todas las evidencias de avances en Git. |
| **IE 8: Exposición Oral (Comisión)** | 10% | Expone el tema utilizando un lenguaje técnico disciplinar al presentar la propuesta y responde evidenciando un manejo de la información en todo momento (evaluación individual). |
| **IE 9: Equidad y Aportes en Repositorio** | 15% | Generan evidencias dentro del repositorio del proyecto del aporte de cada uno de los integrantes del equipo que permitan identificar la equidad en el trabajo y la participación de cada estudiante. |
| **IE 10: Colaboración y Trabajo en Equipo** | 10% | El estudiante realiza un excelente trabajo en equipo, fomentando un ambiente positivo, siendo participativo en las sesiones presenciales y participando de manera equitativa en la presentación (evaluación individual). |
| **TOTAL** | **100%** | **Equivale al 30% de la nota final de la asignatura.** |

