<!-- meta
id: T4.10
title: Kite readiness assessment
page_type: Assessment
prerequisites: [T4.1, T4.2, T4.3, T4.4, T4.5, T4.6, T4.7, T4.8, T4.9]
labs: [Lab 3]
estimated_minutes: 20
-->

# Kite readiness assessment

## Hook

Picture a learner who has read every Kite chapter and feels ready. She asks herself one question: what does her stop order do if the price jumps down overnight? She cannot answer it clearly. This chapter is a check on the basics of order mechanics. It asks you to show what you know, in writing and in a short quiz. It does not give you permission to trade real money.

## The idea

This is the third checkpoint in the book, called **gate G3**. A gate is a check you pass before you move on. G3 checks two things. The first is that you understand how orders work. The second is that you have done the demo steps from the Kite chapters.

A pass means you understand order mechanics and your demo checklist. It does not mean you can trade profitably.

G3 has three parts. You must pass all three.

- **Checklist.** You tick each item from the demo checklist in the nine Kite chapters before this one. You write one line of reflection for each item.
- **Quiz.** You answer a set of questions about common execution mistakes. You need 90 percent or more correct.
- **Paper trade statement.** For one paper trade from the walkthrough chapter, you state three things. These are the planned loss, the binding constraint and the stop order type, with how that stop behaves on a gap.

Some words in this chapter:

- **Binding constraint.** The sizing limit that gives the smallest number of shares. It sets your size.
- **Gap.** A jump in price with no trading in between. A stop can fill far from its trigger after a gap.

You may retake the quiz as often as you like. Wrong answers show their explanation before you retake. There is no timer.

The screen states this notice, and the pass screen shows it too:

> This checks that you understand order mechanics and your demo checklist. It is not proof that you can trade profitably, and it is not a recommendation to place live orders. There is no pressure to go live.

Your checklist ticks, reflections, quiz answers, times and gate status stay on your device. Nothing is sent anywhere. They are included in your backup file.

## See it

| Part | What you do | What counts as a pass |
|---|---|---|
| Checklist | Tick every demo item from the nine Kite chapters. Write one line for each. | Every item ticked, each with a reflection. You tick the items yourself. |
| Quiz | Answer all the quiz questions. | 90 percent or more correct. With 8 questions, that means all 8. With 10 questions, it means 9. |
| Paper trade statement | State the planned loss, the binding constraint and the stop order type with its gap behaviour. | All three stated correctly, for one paper trade. |

Read the last column first. Each part has a clear pass rule. The checklist depends on your honesty, because the book cannot see what you did in the demo.

<!-- component: gate-check | gate: G3 | statement: yes | caption: Tick each criterion only when it is true for you. This is a self-check, not a test the book can mark. -->

## Worked example

**Hypothetical.** This example uses the paper trade from *A complete demo walkthrough*. Capital Rs 50,000. Risk 1 percent. Entry Rs 250. Stop trigger Rs 240.

| Step | Calculation | Result |
|---|---|---|
| 1. Risk budget | 50,000 x 1% | Rs 500 |
| 2. Risk per share | 250 - 240 | Rs 10 |
| 3. Raw shares | floor(500 / 10) | 50 |
| 4. Cash cap | floor(50,000 / 250) | 200 |
| 5. Concentration cap | floor(12,500 / 250) | 50 |
| **Shares** | minimum of 50, 200, 50 | **50** |

For part 3 of G3, a full answer has three lines:

- Planned loss: 50 x Rs 10 = **Rs 500**.
- Binding constraint: the risk budget and the concentration cap tie at 50 shares. Say so.
- Stop order: a GTT (Sell, Single) with trigger Rs 240 and limit Rs 238. A normal stop-loss order lasts one trading day only, and this holding is for weeks. If the price gaps down below Rs 238, the order may not fill at all. The loss can then be bigger than Rs 500.

For the quiz, count the score this way. Ten questions with 9 correct is 9 divided by 10, which is 90 percent. That is a pass. Ten questions with 8 correct is 80 percent. That is not a pass, so you retake.

## Try it

### Guided exercise

**Task.** Using the worked example above, write the three lines for part 3 of G3. State the planned loss, the binding constraint, and the stop order type with its gap behaviour.

Hints:

1. Multiply the shares by the risk per share, not by the entry price.
2. Check the risk limit and the concentration cap. Do they tie, or does one give fewer shares?
3. Ask what happens to the order if the price opens below the limit price.

**Answer:**

- Planned loss: Rs 500 (50 x Rs 10).
- Binding constraint: the risk budget and the concentration cap tie at 50 shares.
- Stop order: a GTT (Sell, Single), trigger Rs 240, limit Rs 238. A gap below Rs 238 can leave the order unfilled, so the loss can be larger than Rs 500.

### Independent exercise

**Task.** Entry Rs 300. Stop Rs 290. Capital Rs 50,000. Risk 1 percent. Work out the final shares, the planned loss and the binding constraint.

<details><summary>Check your answer</summary>

- Risk budget: 50,000 x 1% = Rs 500.
- Risk per share: 300 - 290 = Rs 10.
- Raw shares: floor(500 / 10) = 50.
- Cash cap: floor(50,000 / 300) = floor(166.67) = 166.
- Concentration cap: floor(12,500 / 300) = floor(41.67) = 41.
- Shares: minimum of 50, 166, 41 = **41**.
- Planned loss: 41 x Rs 10 = **Rs 410**.
- Binding constraint: **concentration cap**.

All figures are hypothetical.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

The quiz checks order mechanics. It covers sizing, stop fills after a gap, order types, product types and GTT limits. It uses the same numbers and rules you met in the earlier Kite chapters.

## Paper task

Mode: **learning note**. Log it in your journal (or on paper until the journal app is ready).

1. Copy the nine Kite chapters into a list. Use their titles, from *Kite web and mobile tour* to *A complete demo walkthrough*.
2. For each chapter, tick the item only if you did the demo step. Do not tick an item you skipped.
3. Write one line of reflection under each tick.
4. Write the three lines for one paper trade from *A complete demo walkthrough*. Include the planned loss, the binding constraint and the stop order type with its gap behaviour.
5. Take the quiz until you reach 90 percent. Write down each question you missed, and the rule it tested.

## Limits and common mistakes

- A pass shows that you know the mechanics. It does not show that you can make money. The quiz tests understanding, not skill with real prices.
- The checklist is marked by you. The book cannot check whether you did a demo step.
- The demo uses dummy money and dummy prices. A good demo result says nothing about real results.
- Do not rush the quiz to pass. You can retake it as often as you like, so a fast pass teaches little.
- Passing G3 does not mean you are ready for real money. The final review in *Gate G7 live-readiness review and the one-page trading plan* decides that.

## Remember

- G3 has three parts: the checklist, the quiz at 90 percent or more, and the paper trade statement.
- A stop order can fill far from its trigger after a gap.
- Name the binding constraint every time. If two limits tie, say so.
- A demo pass is not a live result. Do not treat it as one.

## Sources and verification

- Zerodha support pages on orders, product types and GTT orders, as used in the nine Kite chapters. Zerodha changes its rules, so confirm them on its support pages.
- Kite demo help: the demo is at kite-demo.zerodha.com/dashboard. It is view-only.
- NSE India trading rules on price bands and order rejection. Search the NSE website for the current circular.

Facts to check before you use this chapter:

- The checklist items. These come from your own demo steps, not from Zerodha.
- The product and GTT labels shown in the demo, if they differ from this book.

<!-- facts-needed: Kite demo checklist wording; stop-loss order support and gap behaviour in the demo; quiz bank rules. -->

<!-- standing-disclaimer -->
