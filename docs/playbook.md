# Playbook: JEV en 30X · Segmento vivo (Comercial)

> Reto 30X · JEV. Prototipo: `/segmentation` en este repositorio. Todos los datos son simulados.
>
> **Pitch:** "Cada inscripción recibe un segmento y un semáforo en milisegundos, y los dos cambian cuando cambia la persona."

## 1. El problema

Hoy, quien se inscribe a un evento de 30X en Luma cae en un segmento estático o en ninguno. Si después asiste a más eventos, cambia de cargo o su empresa levanta capital, nadie lo nota, y el equipo comercial pierde horas con prospectos que no deciden o no tienen prisa.

Pasar cada inscripción y cada cambio por un LLM es lento y caro, y la respuesta es texto que alguien tiene que interpretar. Son decisiones pequeñas, repetitivas y de alto volumen: justo para lo que sirve JEV. Decide en 70–500 ms, cuesta 0,042 USD por millón de tokens de entrada y devuelve respuestas tipadas con su probabilidad calibrada.

## 2. Qué decide JEV

En **una sola llamada** por inscripción, y otra vez cada vez que la persona cambia:

1. **Segmento:** founder, team lead, individual contributor, student, investor u **other**.
2. **Etapa de la empresa:** idea, early stage, scale-up, corporate u **other**.
3. **Madurez en IA:** baja, media o alta.
4. **Urgencia:** baja, media o alta.
5. **¿Está listo para comprar?**
6. **¿Puede decidir una compra?**
7. **¿Encaja con lo que 30X ofrece?** (eventos, programas y contenido de IA)
8. **¿Busca aprender** más que hacer networking?

El código convierte esas ocho respuestas en un **semáforo** y en el **siguiente paso**, con reglas que el equipo puede leer y cambiar.

**Cuándo se vuelve a decidir (segmento vivo):**

- Cuando llega una inscripción nueva desde el webhook de Luma.
- Cuando la persona asiste a otro evento.
- Cuando cambia de cargo.
- Cuando su empresa levanta una ronda.
- Cuando alguien edita el perfil.

Cada decisión queda en el historial y se ve en "Recent activity", por ejemplo: "Attendee #007 attended another event and moved from Yellow to Green".

## 3. Esquema de preguntas

| id              | Tipo   | Opciones / escala                                                             |
| --------------- | ------ | ----------------------------------------------------------------------------- |
| `segment`       | choice | founder · team_lead · individual_contributor · student · investor · **other** |
| `companyStage`  | choice | idea · early_stage · scale_up · corporate · **other**                         |
| `aiMaturity`    | score  | baja → media → alta                                                           |
| `urgency`       | score  | baja → media → alta                                                           |
| `salesReady`    | noul   | sí/no + probabilidad                                                          |
| `decisionPower` | noul   | sí/no + probabilidad                                                          |
| `fitsOffer`     | noul   | sí/no + probabilidad                                                          |
| `wantsLearning` | noul   | sí/no + probabilidad                                                          |

- Preguntas simples y separadas, combinadas en código. Así lo recomienda TypeSafe.
- Siempre hay una opción `other` para que JEV no fuerce una respuesta.
- **JEV no cuenta ni compara fechas.** El código convierte los contadores (eventos, clics, visitas) en categorías ("attended several events", "keeps visiting the program page") antes de mandar el estado.
- **Sin datos personales:** el webhook descarta el nombre y el correo, y JEV solo ve cargo, empresa, industria, tamaño, país, evento, la respuesta de la inscripción y la actividad resumida.
- Fuentes: [`questions.ts`](../src/features/segmentation/config/questions.ts) y [`profile-state.ts`](../src/features/segmentation/services/profile-state.ts).

## 4. Semáforo y umbrales

| Color        | Condición                                                                                                    | Qué pasa                                                                                                        |
| ------------ | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Verde**    | Listo para comprar, puede decidir y encaja (cada uno ≥ 0,70), urgencia media o alta, y segmento con p ≥ 0,80 | **Va a un vendedor hoy**, con un resumen que arma el código: segmento, etapa, madurez, urgencia y por qué ahora |
| **Amarillo** | Encaja, pero le falta algo de lo anterior                                                                    | **Secuencia educativa:** programa o contenido según su madurez en IA, o invitación a eventos si es inversor     |
| **Rojo**     | Segmento `other`, segmento con p < 0,55, o encaje < 0,40                                                     | **Lo revisa una persona**, sin contacto automático                                                              |

- **Cola de revisión:** todos los rojos y los casos con segmento en p < 0,80. La persona aprueba o corrige el segmento, y las correcciones alimentan la métrica de acierto.
- Fuentes: [`traffic-light.ts`](../src/features/segmentation/config/traffic-light.ts), [`thresholds.ts`](../src/features/segmentation/config/thresholds.ts) y [`recommendations.ts`](../src/features/segmentation/config/recommendations.ts).

## 5. Quién lo opera

- **Equipo comercial:** atiende los verdes del día con el resumen listo y trabaja la cola de revisión (aprobar o corregir).
- **Equipo de media/contenido:** mantiene las secuencias educativas por nivel de madurez.
- **Tech:**
  - Conecta el webhook real de Luma a `POST /api/luma/webhook`.
  - Conecta los cambios del CRM (cargo, ronda) a `POST /api/segment` con su `trigger`.
  - Ajusta los umbrales y vigila el costo y la latencia.

## 6. Cómo se mide

**Acierto medido sobre 60 perfiles simulados** (12 arquetipos × 5), con las 8 respuestas y el color anotados en un archivo aparte que nunca se envía a JEV. Se corre con `pnpm jev:eval` o con "Measure accuracy" en el prototipo. El detalle está en [`docs/evaluation/README.md`](./evaluation/README.md).

| Métrica (60 perfiles)           | `mock`, una llamada | `mock`, consenso ×3 | JEV real, una llamada | JEV real, consenso ×3 |
| ------------------------------- | ------------------- | ------------------- | --------------------- | --------------------- |
| Acierto de segmento             | 80,0 %              | 85,0 %              | **96,7 %**            | 93,3 %                |
| Acierto del semáforo            | 83,3 %              | 38,3 %              | 85,0 %                | **93,3 %**            |
| % que decide solo (sin persona) | 70,0 %              | 35,0 %              | 71,7 %                | 80,0 %                |
| Acierto cuando decide solo      | 88,1 %              | 23,8 %              | 95,3 %                | 95,8 %                |
| Latencia media / p95            | 0 / 1 ms            | 1 / 2 ms            | 188 / 357 ms          | 221 / 367 ms          |
| Costo por 1.000 perfiles        | $0,04               | $0,08               | $0,05                 | $0,13                 |

JEV real (`jev-1.13.0`, 17-10-2026): primera llamada en 343 ms con probabilidades calibradas (`CUT-OFF CHECK: PASS`). La respuesta cruda, sin claves, está en `docs/evaluation/2026-10-17-16-30-raw-typesafe.json`.

- **Las preguntas más débiles con JEV real son urgencia (73 %), etapa de la empresa (75 %) y madurez en IA (77 %).** Dependen de datos numéricos o implícitos (tamaño, ronda, herramientas). Siguiente paso: categorizarlos en código, igual que la actividad.
- **Consenso:** con JEV real mejora el semáforo (85 % → 93 %) y no apaga los verdes como en el mock, pero cuesta casi el triple. Se puede reservar para los casos en revisión.
- **Segmento vivo en 30 días** (`pnpm jev:simulate`, JEV real): 180 decisiones para 60 perfiles, 10 cambian de color y aparecen 2 verdes nuevos que un segmento estático no habría visto, por $0,009 en total.
- **Sesgo por contexto:** con el evento "AI for Founders Meetup", la palabra "Founders" arrastraba el segmento hacia "Founder". Por eso el set de evaluación usa nombres de eventos variados, y hay que vigilarlo con datos reales.

Los números del `mock` prueban el pipeline, no a JEV. Las respuestas correctas son una anotación sintética: antes de presentar, que otra persona revise al menos 10 casos al azar.

| Métrica en producción                                  | Meta inicial                                     |
| ------------------------------------------------------ | ------------------------------------------------ |
| Acuerdo con la revisión humana (aprobadas / revisadas) | ≥ 85 %; si baja, se suben los umbrales           |
| % de verdes que terminan en conversación comercial     | comparar contra el proceso actual                |
| Tiempo de inscripción o cambio a primer contacto       | de días a minutos                                |
| Conversión por color (verde, amarillo)                 | comparar contra los segmentos estáticos actuales |
| Costo por 1.000 decisiones y latencia p95              | < 0,05 USD y < 500 ms                            |

En el prototipo se ven en vivo: el conteo por color, la latencia media, el costo por 1.000 inscripciones y el acierto medido.

## 7. Riesgos y cómo se mitigan

- **JEV puede equivocarse con confianza:** cola de revisión, muestreo aleatorio de verdes y recalibración de umbrales con las correcciones.
- **Sesgo por contexto o por grupo** (nombre del evento, país, cargo): se audita el acuerdo por grupo y se ajustan las descripciones de las opciones.
- **Datos personales:** JEV nunca recibe el nombre ni el correo, y el prototipo funciona solo con datos simulados.
- **Dependencia del proveedor:** el cliente es intercambiable (`JEV_PROVIDER=mock|typesafe|openrouter`).

## 8. Siguientes pasos

1. Conectar el webhook real de Luma y escribir el segmento y el color en el CRM.
2. Calibrar los umbrales con 2–4 semanas de revisiones reales.
3. Reutilizar el mismo patrón (preguntas tipadas, umbrales y una persona en el ciclo) para calificar contenido o detectar alumnos en riesgo de abandono.
