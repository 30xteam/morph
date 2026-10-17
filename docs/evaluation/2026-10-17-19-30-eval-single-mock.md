# Jev vs 30X labels · single · 2026-10-17T19:30:00.650Z

- Provider: **mock** (calibrated: false) · 150 profiles from 30X's anonymized sample · 150 Jev calls
- **Same program as 30X: 57.3%** (baseline: always ai_sales, 44.0%) · affinity band exact 39.3% · **within one band 86.7%**
- Role: taken from the CRM for the 106 profiles that have it (not asked to Jev); Jev only infers it for the rest
- **Decided without a person: 84.7%** · program accuracy when deciding alone: 63.0% · sent to a person: 18 low confidence, 5 low info (0 of them low affinity for 30X)
- Light mix: green 14.7% · yellow 72.7% · red 12.7%
- Latency: median 1 ms · avg 1 ms · p95 1 ms · **cost per 1,000 profiles: $0.04**

## When Jev decides alone (program confidence threshold)

| Threshold      | Decides alone | Accuracy when alone |
| -------------- | ------------- | ------------------- |
| 0.50           | 87.3%         | 61.1%               |
| 0.60           | 87.3%         | 61.1%               |
| 0.70           | 87.3%         | 61.1%               |
| 0.80 (current) | 84.7%         | 63.0%               |
| 0.90           | 68.7%         | 68.9%               |

## Program accuracy by how much 30X knows about the person

| Info level | Profiles | Same program |
| ---------- | -------- | ------------ |
| Alta       | 37       | 45.9%        |
| Media      | 69       | 55.1%        |
| Baja       | 44       | 70.5%        |

## Program confusion (rows: 30X label, columns: Jev)

| 30X / Jev           | ai_sales | inmersion_ejecutiva | sales_machine | hardcore_ai | achievers | none |
| ------------------- | -------- | ------------------- | ------------- | ----------- | --------- | ---- |
| ai_sales            | 52       | 0                   | 12            | 0           | 2         | 0    |
| inmersion_ejecutiva | 16       | 8                   | 1             | 0           | 8         | 5    |
| sales_machine       | 11       | 0                   | 19            | 0           | 0         | 0    |
| hardcore_ai         | 7        | 0                   | 0             | 4           | 0         | 0    |
| achievers           | 1        | 0                   | 1             | 0           | 3         | 0    |
| none                | 0        | 0                   | 0             | 0           | 0         | 0    |

## First misses

- P-297 · Desarrollar liderazgo y equipo: 30X said Inmersión Ejecutiva (affinity 10), Jev said Achievers (97%) (info Alta · topics leadership, ops, sales, marketing, pricing, gtm)
- P-300 · Automatizar con IA: 30X said Inmersión Ejecutiva (affinity 10), Jev said AI Sales (86%) (info Alta · topics ai, leadership, ops)
- P-259 · Vender más: 30X said Inmersión Ejecutiva (affinity 9), Jev said AI Sales (46%) (info Alta · topics leadership, gtm, sales)
- P-266 · Automatizar con IA: 30X said Inmersión Ejecutiva (affinity 9), Jev said AI Sales (82%) (info Alta · topics sales, gtm, ai, product, leadership, ops, finance, pricing)
- P-268 · Expandirse a otros países: 30X said AI Sales (affinity 9), Jev said Sales Machine (100%) (info Alta · topics sales, ai, gtm, marketing, ops)
- P-269 · Vender más: 30X said Inmersión Ejecutiva (affinity 9), Jev said Achievers (85%) (info Alta · topics leadership, gtm, ops, finance)
- P-274 · Formarse (sobre todo en IA): 30X said Sales Machine (affinity 9), Jev said AI Sales (86%) (info Alta · topics sales, gtm, ai)
- P-275 · Automatizar con IA: 30X said Inmersión Ejecutiva (affinity 9), Jev said AI Sales (84%) (info Alta · topics ai, leadership, gtm)
- P-277 · Automatizar con IA: 30X said Inmersión Ejecutiva (affinity 9), Jev said AI Sales (97%) (info Alta · topics leadership, ai, sales, ops, gtm, product)
- P-280 · Transformar el modelo de negocio: 30X said Inmersión Ejecutiva (affinity 9), Jev said Achievers (100%) (info Alta · topics gtm, ops, leadership, sales, product)
- P-260 · Vender más: 30X said AI Sales (affinity 9), Jev said Sales Machine (86%) (info Alta · topics sales, ai, marketing, gtm)
- P-263 · Vender más: 30X said Sales Machine (affinity 9), Jev said AI Sales (46%) (info Media · topics sales, ops, leadership)
- P-264 · Entrar a una red de pares: 30X said Inmersión Ejecutiva (affinity 9), Jev said AI Sales (49%) (info Alta · topics sales, gtm, leadership, ai, marketing)
- P-272 · Automatizar con IA: 30X said AI Sales (affinity 9), Jev said Sales Machine (97%) (info Alta · topics sales, ai, ops, gtm)
- P-281 · Expandirse a otros países: 30X said AI Sales (affinity 9), Jev said Sales Machine (99%) (info Alta · topics sales, ai, fundraising, gtm, ops)
- P-231 · Vender más: 30X said Inmersión Ejecutiva (affinity 8), Jev said AI Sales (100%) (info Media · topics ai, leadership)
- P-234 · Formarse (sobre todo en IA): 30X said Hardcore AI (affinity 8), Jev said AI Sales (100%) (info Media · topics ai, sales, leadership, gtm)
- P-251 · Automatizar con IA: 30X said AI Sales (affinity 8), Jev said Sales Machine (95%) (info Alta · topics sales, ai, gtm, marketing, product, ops)
- P-229 · Vender más: 30X said Inmersión Ejecutiva (affinity 8), Jev said Sales Machine (86%) (info Media · topics leadership, gtm, sales, ops)
- P-232 · Automatizar con IA: 30X said Hardcore AI (affinity 8), Jev said AI Sales (100%) (info Media · topics ai, leadership)
- P-235 · Desarrollar liderazgo y equipo: 30X said AI Sales (affinity 8), Jev said Achievers (95%) (info Alta · topics sales, ai, ops, gtm, leadership)
- P-241 · Formarse (sobre todo en IA): 30X said Inmersión Ejecutiva (affinity 8), Jev said No program yet (97%) (info Media · topics —)
- P-242 · Automatizar con IA: 30X said Inmersión Ejecutiva (affinity 8), Jev said AI Sales (100%) (info Alta · topics ai, leadership)
- P-243 · Vender más: 30X said Inmersión Ejecutiva (affinity 8), Jev said Achievers (100%) (info Media · topics leadership, ops, gtm)
- P-245 · Vender más: 30X said Inmersión Ejecutiva (affinity 8), Jev said AI Sales (100%) (info Baja · topics sales, leadership)
