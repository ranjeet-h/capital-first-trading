<!-- meta
id: T1.1
title: Companies, shares and listings
page_type: Concept
prerequisites: [T0.1]
labs: []
estimated_minutes: 25
-->

# Companies, shares and listings

## Hook

A hypothetical trader hears that a company is "about to list" and buys shares at its first public offer, thinking the company will receive the money from the next trade. A week later, they buy more on the exchange from another investor, believing the company is funded again. Both beliefs mix up two different markets, and the difference decides where the money goes.

## The idea

**A share is a unit of ownership.** A company with a fixed number of shares outstanding is divided into equal parts. Each part gives its holder a proportional claim on the business.

**Ownership percentage** is the number of shares you hold divided by the total shares outstanding. In words: your share of the company is your shares, divided by all the shares. In symbols:

Ownership % = (shares held / total shares outstanding) x 100

**Value of a holding** is the number of shares multiplied by the price per share. In symbols: holding value = shares x price.

**Why companies raise money through shares.** A company can raise money from new shareholders instead of borrowing it. Existing owners also gain a route to sell part of their stake. These are general reasons; the specific reasons for a given company are in its own filings.

**Primary market.** The company issues new shares. The money goes to the company.

**Secondary market.** Investors trade shares that already exist. The money goes to the seller, not to the company. Everyday buying and selling on the exchange is in the secondary market.

**IPO (initial public offer).** A company's first public offer of shares. The price-setting method and the allotment process are described here only at concept level [VERIFY: SEBI ICDR regulations; book-building method].

**An IPO is not automatically profitable.** The listing-day price, the first price at which the shares trade on the exchange, can be above or below the issue price.

**Dilution.** When new shares are issued, the total number of shares rises. Each existing share is then a smaller fraction of the company, so an existing holder's percentage falls, unless they buy some of the new shares.

## See it

```mermaid
flowchart LR
  subgraph Primary
    I1[Investor] -->|money for new shares| C[Company]
    C -->|new shares| I1
  end
  subgraph Secondary
    B[Buyer] -->|money, matched on exchange| S[Seller]
    S -->|existing shares| B
  end
```

Look at the company box. It appears only in the primary flow. In the secondary flow, the money passes between buyer and seller, and the company receives nothing. Change nothing here; the diagram is static.

## Worked example

**Hypothetical company:** 10,00,000 shares outstanding, trading at Rs 200 each.

| Step | Working | Result |
|---|---|---|
| 1. Company value | 10,00,000 x Rs 200 | Rs 20,00,00,000 (Rs 20 crore) |
| 2. Holder's ownership | 1,000 / 10,00,000 | 0.1% |
| 3. Holder's value | 1,000 x Rs 200 | Rs 2,00,000 |
| 4. Secondary trade, 100 shares | 100 x Rs 200 | Rs 20,000 paid to the seller; the company receives nothing |
| 5. Dilution: company issues 5,00,000 new shares | Total becomes 10,00,000 + 5,00,000 = 15,00,000; holder's 1,000 / 15,00,000 | 0.0667% |

**Check on step 5:** 1,000 / 15,00,000 = 1 / 1,500 = 0.000667, which is 0.0667%.

The holder's ownership fell from 0.1% to 0.0667% because the share count rose. Their 1,000 shares are unchanged. Whether their value falls depends on the price after the new issue, which the arithmetic above does not decide.

## Try it

### Guided exercise

**Task:** A holder owns 250 shares in a company with 20,00,000 shares outstanding. The share price is Rs 150. Compute the holder's ownership percentage and the value of the holding.

**Hints:**

1. Divide the holder's shares by the total shares to get the fraction.
2. Multiply the fraction by 100 to get the percentage.
3. Multiply the shares by the price to get the value.

**Answer:** Ownership = 250 / 20,00,000 = 0.000125, which is 0.0125%. Value = 250 x Rs 150 = Rs 37,500.

### Independent exercise

**Task:** The company in the worked example issues 10,00,000 new shares. Compute the holder's new ownership percentage. Explain why the holder's value is not automatically lower. Use no hints.

<details><summary>Check your answer</summary>

New total = 10,00,000 + 10,00,000 = 20,00,000 shares. Holder's ownership = 1,000 / 20,00,000 = 0.005%.

The holder's value is shares x price. The number of shares they hold did not change. If the price stayed at Rs 200, their holding would still be worth Rs 2,00,000. The price is set by trading, and the new money raised may change the company's prospects, so the price could move either way. The percentage falls for certain; the value does not fall automatically.

</details>

## Quiz

<!-- component: quiz-block | src: quiz.json -->

Five questions check ownership arithmetic, the money flow in each market, and the claims about IPOs and dilution.

## Paper task

**Mode:** learning note. Log it in your journal, or on paper until the journal app is ready. No purchase.

1. Find a public offer document for any past IPO, on the exchange or SEBI website.
2. Locate the "objects of the issue" section.
3. Write, in your own words, what the company said it would use the money for.
4. Record the source, the date you accessed it, and the company name. Do not buy anything.

## Limits and common mistakes

- It does not tell you whether any IPO is worth buying. An IPO gets no exemption from the capital-first rules.
- An IPO hype story and allotment excitement are common causes of impulsive buying.
- Listing-day price can be above or below the issue price. Neither is predicted here.
- The percentage and value arithmetic is a snapshot. The price moves, and so does the value.

## Remember

- A share is a unit of ownership. Ownership % = shares held / total shares, times 100.
- Primary market: money goes to the company. Secondary market: money goes to the seller.
- An IPO is a company's first public offer. It is not automatically profitable.
- Dilution: new shares lower each existing holder's percentage, unless they buy into the issue.
- For 1,000 of 10,00,000 shares, ownership is 0.1%. After 5,00,000 new shares, it is 0.0667%.

## Sources and verification

**Sources (names only):**

- SEBI ICDR regulations.
- SEBI investor education pages on IPOs.
- NSE and BSE IPO education pages.

**Facts to verify:**

- IPO process, timelines, book-building and allotment rules. [VERIFY: SEBI ICDR regulations]
- Any current IPO figures are out of scope for this chapter.

<!-- facts-needed: SEBI ICDR regulations (IPO process, timelines, book-building, allotment) -->

<!-- standing-disclaimer -->
