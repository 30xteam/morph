# Jev evaluation · consensus · 2026-10-17T15:31:50.238Z

- Provider: **mock** (calibrated: false) · 60 annotated profiles · 180 Jev calls
- **Segment accuracy 85.0%** · **traffic light accuracy 38.3%**
- **Decided alone (no person): 35.0%** · accuracy when deciding alone: 23.8%
- Light mix: green 0.0% · yellow 53.3% · red 46.7%
- Latency: avg 3 ms · p95 7 ms
- **Cost per 1,000 profiles: $0.08**

| Question      | Accuracy |
| ------------- | -------- |
| segment       | 85.0%    |
| companyStage  | 46.7%    |
| aiMaturity    | 70.0%    |
| urgency       | 73.3%    |
| salesReady    | 80.0%    |
| decisionPower | 88.3%    |
| fitsOffer     | 66.7%    |
| wantsLearning | 56.7%    |
| light         | 38.3%    |

| Expected \ got | green | yellow | red |
| -------------- | ----- | ------ | --- |
| green          | 0     | 19     | 1   |
| yellow         | 0     | 13     | 17  |
| red            | 0     | 0      | 10  |

## Misses (segment or light)

- Eval #01 · Founder & CEO: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (companyStage, aiMaturity, wantsLearning, light)
- Eval #02 · Co-founder: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (companyStage, aiMaturity, wantsLearning, light)
- Eval #03 · CEO: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (aiMaturity, decisionPower, wantsLearning, light)
- Eval #04 · Founder: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (companyStage, aiMaturity, wantsLearning, light)
- Eval #05 · Managing Director: expected Founder / CEO · Green · seller, got Team lead · Yellow · nurture (segment, aiMaturity, light)
- Eval #06 · CEO: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (fitsOffer, wantsLearning, light)
- Eval #07 · Co-founder & CEO: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (fitsOffer, wantsLearning, light)
- Eval #08 · Founder: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (aiMaturity, wantsLearning, light)
- Eval #09 · Founder & CTO: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (fitsOffer, wantsLearning, light)
- Eval #10 · Co-founder: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (fitsOffer, wantsLearning, light)
- Eval #11 · Head of Operations: expected Team lead · Green · seller, got Team lead · Yellow · nurture (wantsLearning, light)
- Eval #12 · Director of Marketing: expected Team lead · Green · seller, got Team lead · Yellow · nurture (aiMaturity, urgency, light)
- Eval #13 · Engineering Manager: expected Team lead · Green · seller, got Team lead · Yellow · nurture (companyStage, decisionPower, wantsLearning, light)
- Eval #14 · Head of Data: expected Team lead · Green · seller, got Team lead · Yellow · nurture (wantsLearning, light)
- Eval #15 · HR Director: expected Team lead · Green · seller, got Team lead · Yellow · nurture (aiMaturity, urgency, light)
- Eval #16 · Owner: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (salesReady, light)
- Eval #17 · Business owner: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (light)
- Eval #18 · General Manager and owner: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (companyStage, urgency, fitsOffer, wantsLearning, light)
- Eval #19 · Owner and director: expected Founder / CEO · Green · seller, got Founder / CEO · Yellow · nurture (salesReady, light)
- Eval #20 · Managing partner: expected Founder / CEO · Green · seller, got Founder / CEO · Red · person reviews (companyStage, wantsLearning, light)
- Eval #21 · Founder: expected Founder / CEO · Yellow · nurture, got Founder / CEO · Red · person reviews (fitsOffer, light)
- Eval #22 · Co-founder: expected Founder / CEO · Yellow · nurture, got Founder / CEO · Red · person reviews (fitsOffer, light)
- Eval #23 · Solo founder: expected Founder / CEO · Yellow · nurture, got Founder / CEO · Red · person reviews (aiMaturity, fitsOffer, light)
- Eval #24 · Indie maker and founder: expected Founder / CEO · Yellow · nurture, got Founder / CEO · Red · person reviews (fitsOffer, light)
- Eval #25 · Founder (side project): expected Founder / CEO · Yellow · nurture, got Founder / CEO · Red · person reviews (fitsOffer, light)
- Eval #29 · Product Director: expected Team lead · Yellow · nurture, got Team lead · Red · person reviews (companyStage, aiMaturity, salesReady, wantsLearning, light)
- Eval #34 · Business Analyst: expected Individual contributor · Yellow · nurture, got Founder / CEO · Red · person reviews (segment, companyStage, urgency, light)
- Eval #35 · Content Writer: expected Individual contributor · Yellow · nurture, got Other · Red · person reviews (segment, salesReady, light)
- Eval #37 · Machine Learning Engineer: expected Individual contributor · Yellow · nurture, got Student / early career · Yellow · nurture (segment)
- Eval #39 · Data Scientist: expected Individual contributor · Yellow · nurture, got Student / early career · Red · person reviews (segment, companyStage, wantsLearning, light)
- Eval #40 · Platform Engineer: expected Individual contributor · Yellow · nurture, got Individual contributor · Red · person reviews (companyStage, fitsOffer, wantsLearning, light)
- Eval #42 · Recent graduate: expected Student / early career · Yellow · nurture, got Student / early career · Red · person reviews (fitsOffer, wantsLearning, light)
- Eval #43 · Intern: expected Student / early career · Yellow · nurture, got Student / early career · Red · person reviews (urgency, fitsOffer, wantsLearning, light)
- Eval #45 · Engineering Student: expected Student / early career · Yellow · nurture, got Student / early career · Red · person reviews (fitsOffer, wantsLearning, light)
- Eval #46 · Partner at a venture fund: expected Investor · Yellow · nurture, got Investor · Red · person reviews (companyStage, aiMaturity, fitsOffer, light)
- Eval #47 · Angel investor: expected Investor · Yellow · nurture, got Investor · Red · person reviews (companyStage, aiMaturity, fitsOffer, light)
- Eval #49 · Investment Associate: expected Investor · Yellow · nurture, got Investor · Red · person reviews (companyStage, aiMaturity, fitsOffer, light)
- Eval #50 · General Partner: expected Investor · Yellow · nurture, got Investor · Red · person reviews (companyStage, aiMaturity, fitsOffer, light)
- Eval #52 · Business Development Rep: expected Individual contributor · Red · person reviews, got Founder / CEO · Red · person reviews (segment, companyStage, urgency)
- Eval #53 · Account Executive: expected Individual contributor · Red · person reviews, got Investor · Red · person reviews (segment, companyStage, aiMaturity, decisionPower)
- Eval #54 · Partnerships Manager: expected Individual contributor · Red · person reviews, got Investor · Red · person reviews (segment, urgency, decisionPower)
- Eval #58 · Guest: expected Other · Red · person reviews, got Investor · Red · person reviews (segment, companyStage, urgency)
