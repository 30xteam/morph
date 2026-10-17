# Jev evaluation · consensus · 2026-10-17T16:31:09.797Z

- Provider: **typesafe** (calibrated: true) · 60 annotated profiles · 180 Jev calls
- **Segment accuracy 93.3%** · **traffic light accuracy 93.3%**
- **Decided alone (no person): 80.0%** · accuracy when deciding alone: 95.8%
- Light mix: green 28.3% · yellow 53.3% · red 18.3%
- Latency: avg 221 ms · p95 367 ms
- **Cost per 1,000 profiles: $0.13**

| Question      | Accuracy |
| ------------- | -------- |
| segment       | 93.3%    |
| companyStage  | 75.0%    |
| aiMaturity    | 78.3%    |
| urgency       | 76.7%    |
| salesReady    | 100.0%   |
| decisionPower | 90.0%    |
| fitsOffer     | 88.3%    |
| wantsLearning | 93.3%    |
| light         | 93.3%    |

| Expected \ got | green | yellow | red |
| -------------- | ----- | ------ | --- |
| green          | 17    | 3      | 0   |
| yellow         | 0     | 29     | 1   |
| red            | 0     | 0      | 10  |

## Misses (segment or light)

- Eval #05 · Managing Director: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (aiMaturity, light)
- Eval #17 · Business owner: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (light)
- Eval #20 · Managing partner: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (light)
- Eval #23 · Solo founder: expected Founder / CEO · Yellow · nurture, got Founder / CEO · Red · person reviews (decisionPower, fitsOffer, light)
- Eval #54 · Partnerships Manager: expected Individual contributor · Red · person reviews, got Team lead · Red · person reviews (segment, urgency)
- Eval #57 · Visitor: expected Other · Red · person reviews, got Founder / CEO · Red · person reviews (segment, companyStage, wantsLearning)
- Eval #58 · Guest: expected Other · Red · person reviews, got Founder / CEO · Red · person reviews (segment, companyStage, wantsLearning)
- Eval #60 · Neighbor: expected Other · Red · person reviews, got Founder / CEO · Red · person reviews (segment, companyStage)
