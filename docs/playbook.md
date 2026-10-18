# Playbook: JEV en 30X · Segmento vivo (Comercial)

> Reto 30X · JEV. Prototipo en `/` de este repositorio, sobre la muestra anonimizada de 30X: 697 personas descritas solo con categorías, sin nombres ni correos.
>
> **Pitch:** "Cada persona que llega a 30X recibe en milisegundos el programa que le calza, su afinidad y un semáforo, y los tres cambian cuando cambia la persona."

## 1. El problema

En la base de 30X hay unas 24.800 personas con deal y unas 7.500 leads. En la muestra, el 73 % no tiene rol conocido y el 85 % no declaró ningún dolor. Hoy la segmentación es estática: si alguien vuelve a un evento, cambia de cargo o su empresa levanta capital, nadie lo nota a tiempo, y el equipo comercial pierde horas con quien no está listo.

Pasar cada cambio por un LLM es lento y caro, y su respuesta es texto. Son decisiones pequeñas, repetitivas y de alto volumen, justo para lo que sirve JEV: decide en 70–500 ms, cuesta 0,042 USD por millón de tokens de entrada y devuelve respuestas tipadas con probabilidad calibrada.

## 2. Qué decide JEV

Se hace **una sola llamada** por persona, y se repite cada vez que la persona cambia:

1. **Programa de 30X que le calza:** AI Sales, Inmersión Ejecutiva, Sales Machine, Hardcore AI, Achievers o ninguno todavía.
2. **Afinidad** con ese programa: baja (0-3), media (4-6), alta (7-8) o muy alta (9-10). Es la misma escala que usa 30X.
3. **Rol**, solo si el CRM no lo tiene. Si el CRM lo trae, se usa tal cual, sin preguntarle a JEV.
4. **¿Está listo para comprar?**
5. **¿Puede decidir la compra?**
6. **¿Viene a aprender** más que a comprar?

**Qué recibe JEV:** temas de interés, objetivo, dolor, rol, relación con 30X (lead o deal), país, nivel de información y la actividad resumida. **No recibe** el programa del deal ni el estado o la etapa del CRM, porque eso filtraría la respuesta. Tampoco recibe nombres ni correos.

**Cuándo se vuelve a decidir (segmento vivo):**

- Cuando llega una inscripción por el webhook de Luma.
- Cuando la persona hace check-in en un evento.
- Cuando cambia de cargo.
- Cuando su empresa levanta una ronda.
- Cuando alguien edita el perfil.

Cada decisión queda en el historial y en "Recent activity".

## 3. Esquema de preguntas

| id              | Tipo   | Opciones / escala                                                                                |
| --------------- | ------ | ------------------------------------------------------------------------------------------------ |
| `program`       | choice | ai_sales · inmersion_ejecutiva · sales_machine · hardcore_ai · achievers · **none**              |
| `affinity`      | score  | baja · media · alta · muy alta                                                                   |
| `segment`       | choice | founder · executive · sales_leader · manager · technical · **unknown** (solo si falta en el CRM) |
| `salesReady`    | noul   | sí/no + probabilidad                                                                             |
| `decisionPower` | noul   | sí/no + probabilidad                                                                             |
| `wantsLearning` | noul   | sí/no + probabilidad                                                                             |

- **Descripciones de los programas:** salen de los datos de 30X. AI Sales se asocia a los temas "sales + ai"; Inmersión Ejecutiva, a liderazgo, expansión y capital; Sales Machine, a un proceso comercial sin foco en IA; Hardcore AI, a "ai + product" y perfiles técnicos; Achievers, a dueños con un dolor declarado.
- **JEV no cuenta:** los contadores de actividad se pasan como categorías ("attended several events").
- Fuente: [`questions.ts`](../src/libs/segmentation/config/questions.ts) y [`profile-state.ts`](../src/libs/segmentation/services/profile-state.ts).

## 4. Semáforo y umbrales

| Color        | Condición                                                                                      | Qué pasa                                                                              |
| ------------ | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Verde**    | Afinidad alta o muy alta, listo para comprar y puede decidir (≥ 0,70), y programa con p ≥ 0,80 | **Va a un vendedor hoy** con el programa a ofrecer, el objetivo, el dolor y los temas |
| **Amarillo** | Hay programa, pero falta algo de lo anterior                                                   | **Nurture:** contenido del programa, o una sesión gratuita si viene a aprender        |
| **Rojo**     | Ningún programa calza, afinidad baja, o programa con p < 0,55                                  | **Lo revisa una persona**, sin contacto automático                                    |

- **Cola de revisión:** todos los rojos y los casos con programa en p < 0,80. La persona aprueba o corrige el programa.
- Fuentes: [`traffic-light.ts`](../src/libs/segmentation/config/traffic-light.ts) y [`recommendations.ts`](../src/libs/segmentation/config/recommendations.ts).

## 5. Quién lo opera

- **Equipo comercial:** atiende los verdes del día y trabaja la cola de revisión.
- **Equipo de media/contenido:** mantiene el nurture de cada programa.
- **Tech:**
  - Conecta el webhook real de Luma (Luma Plus → Settings → Developer → Webhooks: "Guest Registered" y "Guest Updated") a `POST /api/luma/webhook`, con el `whsec_…` en `LUMA_WEBHOOK_SECRET`. En el prototipo ese flujo ya funciona simulado de punta a punta: firma HMAC, rechazo de firmas falsas, reenvíos ignorados y check-ins que vuelven a decidir.
  - Conecta los cambios del CRM a `POST /api/segment` y vigila el costo y la latencia.

## 6. Cómo se mide

Los informes TypeSafe anteriores de 60 perfiles sintéticos se conservan como evidencia histórica del motor. No validan las recomendaciones de programas sobre los 697 perfiles de 30X. Los porcentajes de automatización siguientes son anteriores a la integración de estados por confianza y requieren una nueva corrida.

**Contra las etiquetas que el propio 30X puso** en la muestra: programa sugerido y afinidad, en los 697 perfiles. Esas etiquetas están en un archivo aparte que nunca se envía a JEV. Se corre con `pnpm jev:eval` o con "Measure accuracy". El detalle está en [`docs/evaluation/README.md`](./evaluation/README.md).

| Métrica (697 perfiles)            | `mock`, una llamada | `mock`, consenso ×3 | JEV real (`typesafe`) |
| --------------------------------- | ------------------- | ------------------- | --------------------- |
| Mismo programa que 30X            | 47,9 %              | 49,9 %              | **pendiente**         |
| Afinidad a ±1 banda               | 77,2 %              | 77,2 %              | **pendiente**         |
| Decide sin persona                | 71,6 %              | 38,7 %              | **pendiente**         |
| Mismo programa cuando decide solo | 52,5 %              | 66,3 %              | **pendiente**         |
| Costo por 1.000 perfiles          | $0,04               | $0,07               | **pendiente**         |

- **El `mock` es una heurística de palabras clave:** prueba que el sistema funciona, no la calidad de JEV. La comparación que importa es la columna de JEV real.
- **Las etiquetas de 30X también son aproximadas.** Según sus notas, rol, dolor y objetivo coinciden entre 55 % y 81 % con una clasificación manual. Por eso se mira también la afinidad a ±1 banda y no solo el acierto exacto.
- **La confusión principal del mock** es entre "ninguno" y AI Sales: personas que solo declaran interés en IA y a las que 30X no les sugirió programa. Es justo el tipo de caso que debe ir a una persona.
- **Consenso** (tres formas de preguntar): sube el acierto, pero apaga los verdes, porque promediar acerca las probabilidades a 0,5. Hay que recalibrar los umbrales si se usa.
- **Segmento vivo en 30 días** (`pnpm jev:simulate`, 140 perfiles): 428 decisiones, 4 perfiles cambian de color y aparecen 4 verdes nuevos (por ejemplo, un director que vuelve a un evento pasa de amarillo a verde). Un segmento estático no los habría visto. El costo total fue de $0,02.

| Métrica en producción                              | Meta inicial                           |
| -------------------------------------------------- | -------------------------------------- |
| Acuerdo con la revisión humana                     | ≥ 85 %; si baja, se suben los umbrales |
| % de verdes que terminan en conversación comercial | comparar contra el proceso actual      |
| Tiempo de inscripción o cambio a primer contacto   | de días a minutos                      |
| Costo por 1.000 decisiones y latencia p95          | < 0,05 USD y < 500 ms                  |

## 7. Riesgos y cómo se mitigan

- **JEV puede equivocarse con confianza:** cola de revisión, muestreo de verdes y recalibración de umbrales con las correcciones.
- **Etiquetas ruidosas:** se mide contra 30X, pero también contra la revisión humana del día a día.
- **Sesgo por contexto:** el nombre de un evento ("Founders") puede arrastrar el segmento. Se vigila por grupo.
- **Datos personales:** la muestra es anónima, JEV nunca recibe nombres ni correos, y los invitados de Luma son ficticios.
- **Dependencia del proveedor:** el cliente es intercambiable (`JEV_PROVIDER=mock|typesafe|openrouter`).

## 8. Siguientes pasos

1. Correr `pnpm jev:smoke`, `jev:eval` (simple y con consenso) y `jev:simulate` con JEV real, y reemplazar los números del `mock`.
2. Conectar el webhook real de Luma y escribir programa, afinidad y color en el CRM.
3. Calibrar los umbrales con 2–4 semanas de revisiones reales.
4. Reutilizar el mismo patrón para calificar contenido o detectar alumnos en riesgo de abandono.
