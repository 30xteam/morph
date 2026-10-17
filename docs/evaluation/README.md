# Evaluación de JEV · Segmento vivo

Mide si JEV decide como lo haría 30X, usando la muestra anonimizada que 30X compartió (`perfiles-30x-anonimo.xlsx`).

## Archivos

| Archivo                                                                       | Qué contiene                                                                                                | ¿Llega a JEV?                                                     |
| ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [`profiles-30x.json`](../../src/features/segmentation/data/profiles-30x.json) | 697 perfiles: relación (lead/deal), rol, país, dolor, objetivo, temas, nivel de información y datos del CRM | Sí, pero sin el programa del deal ni el estado o la etapa del CRM |
| [`labels-30x.json`](../../src/features/segmentation/data/labels-30x.json)     | Lo que dijo 30X por `id`: programa sugerido, afinidad 0-10 y su banda, rol y nivel de info                  | **Nunca.** Solo se lee en el servidor para comparar               |
| [`crm-sample.json`](../../src/features/segmentation/data/crm-sample.json)     | 24 deals de la muestra con los que arranca el dashboard                                                     | Sí                                                                |

Los JSON salen de la hoja "Perfiles" del Excel de 30X. Si 30X manda una versión nueva, se reemplazan esos tres archivos con el mismo formato.

## Cómo correrlo

Con el servidor levantado (`pnpm dev`):

```bash
pnpm jev:smoke                       # 1 llamada + chequeo del corte de las 12:00
pnpm jev:eval [--limit 100]          # 697 perfiles (o los primeros N) contra las etiquetas de 30X
pnpm jev:eval --consensus            # lo mismo, preguntando de 3 formas
pnpm jev:simulate --days 30          # 140 perfiles con actividad simulada durante 30 días
```

Cada comando imprime el resultado y guarda un `.md` y un `.json` en esta carpeta, sin claves.

## Resultados

> Las capturas `2026-10-17-16-*typesafe*` conservadas desde main corresponden al experimento anterior de 60 perfiles sintéticos y ocho preguntas. No miden el programa ni la afinidad de estos 697 perfiles y no son comparables con esta evaluación. Tras integrar los estados de decisión, los porcentajes históricos de automatización requieren una nueva corrida.

> ⚠️ Estos números son del proveedor **`mock`** (una heurística de palabras clave), porque la clave de TypeSafe todavía no está en `.env.local`. Prueban que el sistema funciona, no la calidad de JEV.

| Métrica (697 perfiles)                        | `mock`, una llamada | `mock`, consenso ×3 | JEV real  |
| --------------------------------------------- | ------------------- | ------------------- | --------- |
| Mismo programa que 30X                        | 47,9 %              | 49,9 %              | pendiente |
| Afinidad exacta / a ±1 banda                  | 31,7 % / 77,2 %     | 31,7 % / 77,2 %     | pendiente |
| Decide sin persona                            | 71,6 %              | 38,7 %              | pendiente |
| Mismo programa cuando decide solo             | 52,5 %              | 66,3 %              | pendiente |
| Mezcla del semáforo (verde / amarillo / rojo) | 4 % / 69 % / 27 %   | 0 % / 69 % / 31 %   | pendiente |
| Costo por 1.000 perfiles                      | $0,04               | $0,07               | pendiente |

- **Rol:** en los 188 perfiles que lo tienen, se toma del CRM y no se le pregunta a JEV. JEV solo lo infiere cuando falta, y para esos casos no hay etiqueta con qué comparar.
- **Por nivel de información (mock):** Alta 44,8 %, Media 54,0 %, Baja 46,0 %.
- **Confusión principal:** "ninguno" contra AI Sales, es decir, personas que solo declaran interés en IA y a las que 30X no les sugirió programa.
- **Ojo:** las etiquetas de 30X también son aproximadas (según sus notas, rol, dolor y objetivo coinciden 81 % / 55 % / 55 % con una clasificación manual).

## Simulación de 30 días (mock, semilla 30)

Cada día, cada perfil puede hacer check-in en un evento (5 %), cambiar de cargo (0,6 %) o ver a su empresa levantar una ronda (0,4 %). Si pasa más de 30 días sin actividad, se vuelve a decidir.

Resultado: 428 decisiones para 140 perfiles, 4 perfiles cambian de color y aparecen **4 verdes nuevos**, por ejemplo P-141, un director que vuelve a un evento y pasa de amarillo a verde. El costo total fue de $0,02.

## Regla de corte de las 12:00

A las 12:00 se corre `pnpm jev:smoke`.

| Resultado                                                        | Qué se hace                                                                                                       |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `CUT-OFF CHECK: PASS` (`typesafe` con probabilidades calibradas) | Se sigue con JEV real y se reemplazan los números del mock.                                                       |
| `FAIL`, o error                                                  | Se sigue con `openrouter` o `mock`, y en el pitch se dice explícitamente que los números no son de JEV calibrado. |
