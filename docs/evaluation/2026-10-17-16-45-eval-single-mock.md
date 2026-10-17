# Jev vs 30X labels · single · 2026-10-17T16:45:09.957Z

- Provider: **mock** (calibrated: false) · 697 profiles from 30X's anonymized sample · 697 Jev calls
- **Same program as 30X: 47.9%** · affinity band exact 31.7% · **within one band 77.2%**
- Role: taken from the CRM for the 188 profiles that have it (not asked to Jev); Jev only infers it for the rest
- **Decided without a person: 71.6%** · program accuracy when deciding alone: 52.5%
- Light mix: green 4.3% · yellow 68.6% · red 27.1%
- Latency: avg 1 ms · p95 3 ms · **cost per 1,000 profiles: $0.04**

## Program accuracy by how much 30X knows about the person

| Info level | Profiles | Same program |
| ---------- | -------- | ------------ |
| Alta       | 145      | 44.8%        |
| Media      | 189      | 54.0%        |
| Baja       | 363      | 46.0%        |

## Program confusion (rows: 30X label, columns: Jev)

| 30X / Jev           | ai_sales | inmersion_ejecutiva | sales_machine | hardcore_ai | achievers | none |
| ------------------- | -------- | ------------------- | ------------- | ----------- | --------- | ---- |
| ai_sales            | 182      | 0                   | 26            | 0           | 3         | 0    |
| inmersion_ejecutiva | 52       | 26                  | 5             | 0           | 29        | 21   |
| sales_machine       | 38       | 0                   | 61            | 0           | 1         | 0    |
| hardcore_ai         | 23       | 0                   | 1             | 9           | 0         | 2    |
| achievers           | 7        | 0                   | 6             | 1           | 7         | 0    |
| none                | 127      | 3                   | 11            | 3           | 4         | 49   |

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
