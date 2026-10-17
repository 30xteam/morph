# Jev evaluation · single · 2026-10-17T15:31:49.199Z

- Provider: **mock** (calibrated: false) · 60 annotated profiles · 60 Jev calls
- **Segment accuracy 80.0%** · **traffic light accuracy 83.3%**
- **Decided alone (no person): 70.0%** · accuracy when deciding alone: 88.1%
- Light mix: green 30.0% · yellow 46.7% · red 23.3%
- Latency: avg 1 ms · p95 2 ms
- **Cost per 1,000 profiles: $0.04**

| Question      | Accuracy |
| ------------- | -------- |
| segment       | 80.0%    |
| companyStage  | 53.3%    |
| aiMaturity    | 70.0%    |
| urgency       | 78.3%    |
| salesReady    | 75.0%    |
| decisionPower | 85.0%    |
| fitsOffer     | 80.0%    |
| wantsLearning | 78.3%    |
| light         | 83.3%    |

| Expected \ got | green | yellow | red |
| -------------- | ----- | ------ | --- |
| green          | 17    | 3      | 0   |
| yellow         | 1     | 24     | 5   |
| red            | 0     | 1      | 9   |

## Misses (segment or light)

- Eval #05 · Managing Director: expected Founder / CEO · Green · seller, got Team lead · Green · seller (segment, aiMaturity)
- Eval #12 · Director of Marketing: expected Team lead · Green · seller, got Team lead · Yellow · nurture (companyStage, aiMaturity, urgency, light)
- Eval #13 · Engineering Manager: expected Team lead · Green · seller, got Team lead · Yellow · nurture (companyStage, decisionPower, wantsLearning, light)
- Eval #18 · General Manager and owner: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (companyStage, urgency, wantsLearning, light)
- Eval #20 · Managing partner: expected Founder / CEO · Green · seller, got Investor · Green · seller (segment, companyStage, wantsLearning)
- Eval #26 · Marketing Manager: expected Team lead · Yellow · nurture, got Founder / CEO · Red · person reviews (segment, companyStage, salesReady, light)
- Eval #29 · Product Director: expected Team lead · Yellow · nurture, got Founder / CEO · Red · person reviews (segment, companyStage, aiMaturity, salesReady, light)
- Eval #30 · Head of Sales: expected Team lead · Yellow · nurture, got Team lead · Green · seller (salesReady, light)
- Eval #35 · Content Writer: expected Individual contributor · Yellow · nurture, got Other · Red · person reviews (segment, salesReady, light)
- Eval #39 · Data Scientist: expected Individual contributor · Yellow · nurture, got Student / early career · Red · person reviews (segment, light)
- Eval #43 · Intern: expected Student / early career · Yellow · nurture, got Student / early career · Red · person reviews (urgency, fitsOffer, light)
- Eval #51 · Sales Executive: expected Individual contributor · Red · person reviews, got Student / early career · Red · person reviews (segment, companyStage, urgency)
- Eval #52 · Business Development Rep: expected Individual contributor · Red · person reviews, got Founder / CEO · Red · person reviews (segment, urgency)
- Eval #53 · Account Executive: expected Individual contributor · Red · person reviews, got Team lead · Red · person reviews (segment, companyStage, aiMaturity, decisionPower)
- Eval #54 · Partnerships Manager: expected Individual contributor · Red · person reviews, got Investor · Yellow · nurture (segment, urgency, decisionPower, light)
- Eval #55 · Sales Representative: expected Individual contributor · Red · person reviews, got Founder / CEO · Red · person reviews (segment, companyStage, urgency)
- Eval #58 · Guest: expected Other · Red · person reviews, got Individual contributor · Red · person reviews (segment, companyStage, fitsOffer)
