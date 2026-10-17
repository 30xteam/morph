# Jev vs 30X labels · consensus · 2026-10-17T16:45:11.425Z

- Provider: **mock** (calibrated: false) · 697 profiles from 30X's anonymized sample · 2091 Jev calls
- **Same program as 30X: 49.9%** · affinity band exact 31.7% · **within one band 77.2%**
- Role: taken from the CRM for the 188 profiles that have it (not asked to Jev); Jev only infers it for the rest
- **Decided without a person: 38.7%** · program accuracy when deciding alone: 66.3%
- Light mix: green 0.0% · yellow 68.7% · red 31.3%
- Latency: avg 2 ms · p95 5 ms · **cost per 1,000 profiles: $0.07**

## Program accuracy by how much 30X knows about the person

| Info level | Profiles | Same program |
| ---------- | -------- | ------------ |
| Alta       | 145      | 47.6%        |
| Media      | 189      | 59.8%        |
| Baja       | 363      | 45.7%        |

## Program confusion (rows: 30X label, columns: Jev)

| 30X / Jev           | ai_sales | inmersion_ejecutiva | sales_machine | hardcore_ai | achievers | none |
| ------------------- | -------- | ------------------- | ------------- | ----------- | --------- | ---- |
| ai_sales            | 208      | 0                   | 3             | 0           | 0         | 0    |
| inmersion_ejecutiva | 65       | 34                  | 6             | 1           | 6         | 21   |
| sales_machine       | 51       | 0                   | 48            | 0           | 1         | 0    |
| hardcore_ai         | 25       | 0                   | 0             | 10          | 0         | 0    |
| achievers           | 12       | 2                   | 4             | 1           | 2         | 0    |
| none                | 133      | 2                   | 7             | 8           | 1         | 46   |

## First misses

- P-297 · Desarrollar liderazgo y equipo: 30X said Inmersión Ejecutiva (affinity 10), Jev said Achievers (32%) (info Alta · topics leadership, ops, sales, marketing, pricing, gtm)
- P-300 · Automatizar con IA: 30X said Inmersión Ejecutiva (affinity 10), Jev said AI Sales (56%) (info Alta · topics ai, leadership, ops)
- P-259 · Vender más: 30X said Inmersión Ejecutiva (affinity 9), Jev said AI Sales (36%) (info Alta · topics leadership, gtm, sales)
- P-266 · Automatizar con IA: 30X said Inmersión Ejecutiva (affinity 9), Jev said AI Sales (94%) (info Alta · topics sales, gtm, ai, product, leadership, ops, finance, pricing)
- P-274 · Formarse (sobre todo en IA): 30X said Sales Machine (affinity 9), Jev said AI Sales (95%) (info Alta · topics sales, gtm, ai)
- P-275 · Automatizar con IA: 30X said Inmersión Ejecutiva (affinity 9), Jev said AI Sales (60%) (info Alta · topics ai, leadership, gtm)
- P-277 · Automatizar con IA: 30X said Inmersión Ejecutiva (affinity 9), Jev said AI Sales (99%) (info Alta · topics leadership, ai, sales, ops, gtm, product)
- P-278 · Delegar y pasar a un rol estratégico: 30X said Inmersión Ejecutiva (affinity 9), Jev said Sales Machine (39%) (info Alta · topics leadership, hiring, ops, fundraising, gtm, sales)
- P-280 · Transformar el modelo de negocio: 30X said Inmersión Ejecutiva (affinity 9), Jev said Achievers (33%) (info Alta · topics gtm, ops, leadership, sales, product)
- P-263 · Vender más: 30X said Sales Machine (affinity 9), Jev said AI Sales (43%) (info Media · topics sales, ops, leadership)
- P-264 · Entrar a una red de pares: 30X said Inmersión Ejecutiva (affinity 9), Jev said AI Sales (82%) (info Alta · topics sales, gtm, leadership, ai, marketing)
- P-289 · Automatizar con IA: 30X said Sales Machine (affinity 9), Jev said AI Sales (67%) (info Alta · topics sales, ops, ai, gtm)
- P-291 · Vender más: 30X said Sales Machine (affinity 9), Jev said AI Sales (67%) (info Alta · topics sales, marketing, gtm, ops, ai)
- P-231 · Vender más: 30X said Inmersión Ejecutiva (affinity 8), Jev said AI Sales (61%) (info Media · topics ai, leadership)
- P-234 · Formarse (sobre todo en IA): 30X said Hardcore AI (affinity 8), Jev said AI Sales (100%) (info Media · topics ai, sales, leadership, gtm)
- P-229 · Vender más: 30X said Inmersión Ejecutiva (affinity 8), Jev said Sales Machine (49%) (info Media · topics leadership, gtm, sales, ops)
- P-232 · Automatizar con IA: 30X said Hardcore AI (affinity 8), Jev said AI Sales (65%) (info Media · topics ai, leadership)
- P-241 · Formarse (sobre todo en IA): 30X said Inmersión Ejecutiva (affinity 8), Jev said No program yet (56%) (info Media · topics —)
- P-242 · Automatizar con IA: 30X said Inmersión Ejecutiva (affinity 8), Jev said AI Sales (65%) (info Alta · topics ai, leadership)
- P-245 · Vender más: 30X said Inmersión Ejecutiva (affinity 8), Jev said AI Sales (54%) (info Baja · topics sales, leadership)
- P-254 · Automatizar con IA: 30X said Hardcore AI (affinity 8), Jev said AI Sales (100%) (info Media · topics ai, sales)
- P-193 · Formarse (sobre todo en IA): 30X said Inmersión Ejecutiva (affinity 7), Jev said No program yet (56%) (info Baja · topics —)
- P-209 · Vender más: 30X said Sales Machine (affinity 7), Jev said AI Sales (50%) (info Baja · topics sales)
- P-210 · Automatizar con IA: 30X said Inmersión Ejecutiva (affinity 7), Jev said AI Sales (100%) (info Baja · topics gtm, sales, ai, leadership)
- P-213 · Vender más: 30X said Sales Machine (affinity 7), Jev said AI Sales (61%) (info Media · topics sales, marketing, leadership)
