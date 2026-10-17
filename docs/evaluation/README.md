# Evaluación de JEV · Segmento vivo

Responsable: Ignacio. Mide si JEV decide bien antes de confiar en él, sin pagar varias IA y sin datos reales.

## Archivos

| Archivo                                                                     | Qué contiene                                                                                               | ¿Llega a JEV?                                       |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| [`profiles.json`](../../src/features/segmentation/evaluation/profiles.json) | 60 perfiles simulados con el mismo formato que `Profile` (`profile.schema.ts`)                             | Sí, como estado (sin nombre ni correo)              |
| [`answers.json`](../../src/features/segmentation/evaluation/answers.json)   | La respuesta correcta de cada perfil por `id`: las 8 preguntas, el color esperado, el arquetipo y una nota | **Nunca.** Solo se lee en el servidor para comparar |

- **Composición:** 12 arquetipos × 5 variantes (cambian el cargo, la empresa, el país, el evento y la redacción de la respuesta). Hay 20 verdes, 30 amarillos y 10 rojos esperados. Los arquetipos son: founder listo (early stage y scale-up), líder corporativo listo, dueño de pyme listo, founder explorando, líder planificando, especialista que quiere aprender, ingeniero avanzado, estudiante, inversor, vendedor que viene a vender y caso sin información.
- **Anotación:** sigue las reglas del semáforo de [`traffic-light.ts`](../../src/features/segmentation/config/traffic-light.ts). Es una anotación sintética: **antes de presentar, que otra persona revise al menos 10 casos al azar.**
- **Cómo agregar casos:** se agrega el perfil en `profiles.json` y su respuesta con el mismo `id` en `answers.json`. Los valores válidos están en `src/features/segmentation/types/evaluation.types.ts`.

## Cómo correrlo

Con el servidor levantado (`pnpm dev`):

```bash
pnpm jev:smoke                  # 1 llamada real + chequeo del corte de las 12:00
pnpm jev:eval                   # 60 perfiles, una llamada por perfil
pnpm jev:eval --consensus       # 60 perfiles × 3 formas de preguntar
pnpm jev:simulate --days 30     # actividad simulada durante 30 días
```

Cada comando imprime el resultado y guarda un `.md` y un `.json` en esta carpeta. **Los reportes nunca incluyen claves.** El proveedor sale de `JEV_PROVIDER` en `.env.local`.

## Resultados

> Los números de `mock` (una heurística de palabras clave) prueban el pipeline. Los de **JEV real** (`jev-1.13.0`, 17-10-2026) son los del pitch. Para repetirlos: `pnpm jev:smoke && pnpm jev:eval && pnpm jev:eval --consensus && pnpm jev:simulate`.

| Métrica (60 perfiles)           | `mock`, una llamada | `mock`, consenso ×3 | JEV real, una llamada | JEV real, consenso ×3 |
| ------------------------------- | ------------------- | ------------------- | --------------------- | --------------------- |
| Acierto de segmento             | 80,0 %              | 85,0 %              | 96,7 %                | 93,3 %                |
| Acierto del semáforo            | 83,3 %              | 38,3 %              | 85,0 %                | 93,3 %                |
| % que decide solo (sin persona) | 70,0 %              | 35,0 %              | 71,7 %                | 80,0 %                |
| Acierto cuando decide solo      | 88,1 %              | 23,8 %              | 95,3 %                | 95,8 %                |
| Latencia media / p95            | 0 / 1 ms            | 1 / 2 ms            | 188 / 357 ms          | 221 / 367 ms          |
| Costo por 1.000 perfiles        | $0,04               | $0,08               | $0,05                 | $0,13                 |

- **Por pregunta (JEV real, una llamada):** segmento 96,7 %, etapa 75 %, madurez 76,7 %, urgencia 73,3 %, listo para comprar 100 %, puede decidir 91,7 %, encaja 85 %, quiere aprender 95 %.
- **Llamada cruda:** `2026-10-17-16-30-raw-typesafe.json` guarda la petición y la respuesta tal cual llegan, sin claves (`pnpm jev:raw`). La forma coincide con el schema de `typesafe-adapter.ts`; los `score` traen además un `legend` y `usage` trae `output_tokens`.
- **Estados por confianza** (`pnpm jev:states`): en modo `mock`, `e-01` actúa solo, `e-13` va a revisión y `e-35` escala a una persona. Los umbrales están en `config/thresholds.ts` y la regla en `config/action.ts`.
- **Por pregunta (mock, una llamada):** segmento 80 %, etapa 53 %, madurez 70 %, urgencia 78 %, listo para comprar 75 %, puede decidir 85 %, encaja 80 %, quiere aprender 78 %. **La etapa de la empresa es la más débil.** Depende del tamaño y de la ronda, que son datos numéricos, así que conviene categorizarlos en código antes de mandarlos (igual que la actividad).
- **Consenso (tres formas de preguntar):** el segmento mejora 5 puntos, pero el semáforo se cae. Promediar tres probabilidades las acerca a 0,5, y los umbrales de verde (≥ 0,70) están calibrados para una sola llamada. Además, la tercera redacción es corta y sin descripciones, y el mock la responde peor. **Conclusión a validar con JEV real:** usar el consenso solo para el segmento, o recalibrar los umbrales cuando se use consenso. Cuesta el triple de llamadas.
- **Costo:** sale de los tokens de entrada que reporta cada llamada × 0,042 USD por millón (`decide.ts`). Si el proveedor devuelve su propio costo, se usa ese.

## Simulación de 30 días (mock, semilla 30)

Cada día, cada perfil puede asistir a otro evento (5 %), cambiar de cargo (0,6 %) o ver a su empresa levantar una ronda (0,4 %). Si pasa más de 30 días sin actividad, también se vuelve a decidir. JEV solo se llama cuando algo cambia.

- **180 decisiones en 30 días** para 60 perfiles: 60 iniciales + 120 por cambios. El costo total fue $0,0065.
- **5 perfiles terminaron con otro color**, algo que un segmento estático no habría visto, y **aparecieron 2 verdes nuevos**. Ejemplo: el día 3, un Engineering Manager pasa a Director of Operations y cambia de amarillo a verde.
- El reporte completo con el timeline y las transiciones está en `*-simulate-30d-*.md`.

## Regla de corte de las 12:00

A las 12:00 Ignacio corre `pnpm jev:smoke`, sin esperar a nadie.

| Resultado                                                                  | Qué se hace                                                                                                                                                                                                                               |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CUT-OFF CHECK: PASS` (proveedor `typesafe` con probabilidades calibradas) | Se sigue con JEV real. Se corre la evaluación completa y se actualizan los números.                                                                                                                                                       |
| `FAIL`, o error                                                            | **Se corta:** el demo y la evaluación siguen con `JEV_PROVIDER=openrouter` (emulación con un LLM) o `mock`, y en el pitch se dice explícitamente que los números **no** son de JEV calibrado. No se gastan más horas peleando con la API. |
