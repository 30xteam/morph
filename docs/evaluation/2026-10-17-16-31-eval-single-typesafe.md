# Jev evaluation · single · 2026-10-17T16:31:03.231Z

- Provider: **typesafe** (calibrated: true) · 60 annotated profiles · 60 Jev calls
- **Segment accuracy 96.7%** · **traffic light accuracy 85.0%**
- **Decided alone (no person): 71.7%** · accuracy when deciding alone: 95.3%
- Light mix: green 30.0% · yellow 41.7% · red 28.3%
- Latency: avg 188 ms · p95 357 ms
- **Cost per 1,000 profiles: $0.05**

| Question      | Accuracy |
| ------------- | -------- |
| segment       | 96.7%    |
| companyStage  | 75.0%    |
| aiMaturity    | 76.7%    |
| urgency       | 73.3%    |
| salesReady    | 100.0%   |
| decisionPower | 91.7%    |
| fitsOffer     | 85.0%    |
| wantsLearning | 95.0%    |
| light         | 85.0%    |

| Expected \ got | green | yellow | red |
| -------------- | ----- | ------ | --- |
| green          | 18    | 2      | 0   |
| yellow         | 0     | 23     | 7   |
| red            | 0     | 0      | 10  |

## Misses (segment or light)

- Eval #17 · Business owner: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (light)
- Eval #20 · Managing partner: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (light)
- Eval #21 · Founder: expected Founder / CEO · Yellow · nurture, got Founder / CEO · Red · person reviews (fitsOffer, light)
- Eval #22 · Co-founder: expected Founder / CEO · Yellow · nurture, got Founder / CEO · Red · person reviews (fitsOffer, light)
- Eval #23 · Solo founder: expected Founder / CEO · Yellow · nurture, got Founder / CEO · Red · person reviews (fitsOffer, light)
- Eval #25 · Founder (side project): expected Founder / CEO · Yellow · nurture, got Founder / CEO · Red · person reviews (fitsOffer, light)
- Eval #41 · Computer Science Student: expected Student / early career · Yellow · nurture, got Student / early career · Red · person reviews (companyStage, urgency, fitsOffer, light)
- Eval #43 · Intern: expected Student / early career · Yellow · nurture, got Student / early career · Red · person reviews (companyStage, fitsOffer, light)
- Eval #44 · Bootcamp student: expected Student / early career · Yellow · nurture, got Student / early career · Red · person reviews (companyStage, urgency, fitsOffer, light)
- Eval #54 · Partnerships Manager: expected Individual contributor · Red · person reviews, got Team lead · Red · person reviews (segment, urgency, decisionPower)
- Eval #57 · Visitor: expected Other · Red · person reviews, got Founder / CEO · Red · person reviews (segment, companyStage, wantsLearning)
