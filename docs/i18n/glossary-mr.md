# Marathi glossary (v1, pilot)

One term, one translation. This file is the reference for `make check BOOK_LANG=mr`.
Changes go through a pull request, and the pages that use the term are re-checked.

Rules:

- Keep `Rs`, paise amounts and Western digits as written. Never write Devanagari digits in
  the book text.
- Keep `NSE`, `BSE`, `SEBI`, `Kite`, `ETF`, `F&O` and ticker names in Latin script.
- Keep lab button and field names in English, with a short Marathi explanation in brackets
  on first use.
- Use short, plain sentences. If traders say the English word, keep it as this table says.
- Never write assured-return or risk-free wording.

| English | Marathi | Keep English? | Avoid | Note |
|---|---|---|---|---|
| trading | ट्रेडिंग | yes |  | The everyday market word. |
| trade | व्यापार | no |  | One buy or sell, or the act. |
| trader | ट्रेडर | yes |  | A person who trades. |
| investing | गुंतवणूक | no |  | Holding a business for years. |
| speculation | सट्टा | no | सट्टेबाजी | A short, uncertain bet on price. सट्टेबाजी suggests illegal betting, so avoid it. |
| share | शेअर | yes |  | A piece of a company. In "a share of savings" it means a portion; write वाटा. |
| market | बाजार | no |  |  |
| exchange | एक्सचेंज | yes |  | NSE or BSE. |
| broker | ब्रोकर | yes |  |  |
| brokerage | ब्रोकरेज | yes |  | The charge, not the person. |
| order | ऑर्डर | yes |  | A buy or sell instruction. |
| settlement | सेटलमेंट | yes |  |  |
| capital | भांडवल | no |  | Money set aside and protected first. |
| price | भाव | no |  |  |
| value | मूल्य | no |  |  |
| company | कंपनी | no |  |  |
| companies | कंपन्या | no |  | Plural form used in the text. |
| business | व्यवसाय | no |  |  |
| dividend | लाभांश | no |  |  |
| return | परतावा | no |  |  |
| risk | जोखीम | no |  |  |
| loss | तोटा | no |  |  |
| profit | नफा | no |  |  |
| cost | खर्च | no |  |  |
| tax | कर | no |  |  |
| win rate | विजय दर | no |  | The share of trades that win. |
| break-even | तोटा टाळण्याचा | no |  | As in "तोटा टाळण्याचा विजय दर". |
| position sizing | पोझिशन साइजिंग | yes |  |  |
| drawdown | ड्रॉडाउन | yes |  |  |
| expectancy | अपेक्षित परतावा | no |  | Average result per trade. |
| strategy | रणनीती | no |  |  |
| edge | एज | yes |  |  |
| indicator | निर्देशक | no |  |  |
| moving average | मूव्हिंग ॲव्हरेज | yes |  |  |
| trend | ट्रेंड | yes |  |  |
| breakout | ब्रेकआउट | yes |  |  |
| gap | गॅप | yes |  |  |
| circuit | सर्किट | yes |  |  |
| indices | निर्देशांक | no |  |  |
| derivatives | डेरिव्हेटिव्ह्ज | yes |  |  |
| equity | इक्विटी | yes |  |  |
| F&O | F&O | yes |  | Keep the short form. |
| SEBI | SEBI | yes |  |  |
| NSE | NSE | yes |  |  |
| BSE | BSE | yes |  |  |
| Kite | Kite | yes |  |  |
| backtest | बॅकटेस्ट | yes |  |  |
| live | लाइव्ह | yes |  | Real money and real orders. |
| journal | जर्नल | yes |  |  |
| psychology | मानसशास्त्र | no |  |  |
| discipline | शिस्त | no |  |  |
| losing streak | सततचे तोटे | no |  |  |
| paper task | कागदी काम | no |  | Practice with no live order. |
| chapter | प्रकरण | no |  |  |
| quiz | क्विझ | yes |  |  |
| question | प्रश्न | no |  |  |
| answer | उत्तर | no |  |  |
| exercise | सराव | no |  |  |
| example | उदाहरण | no |  |  |
| fact | तथ्य | no |  |  |
| source | स्रोत | no |  |  |
| stop-loss | स्टॉप-लॉस | yes |  |  |
| margin | मार्जिन | yes |  |  |
| demat | डिमॅट | yes |  |  |
| leverage | लीव्हरेज | yes |  | Borrowed buying power. |
| averaging down | सरासरी कमी करणे | no |  | Buying more of a position that has fallen. |
| emergency fund | इमर्जन्सी फंड | yes |  | Household money. Never trading money. |
| savings | बचत | no |  |  |
| household money | घरचे पैसे | no |  | Money for bills, rent and emergencies. |
| overtrading | ओव्हरट्रेडिंग | yes |  |  |
| exposure | एक्सपोजर | yes |  | Money at risk in one idea. |
| concentration | एकाग्रता | no |  |  |
| position | पोझिशन | yes |  | The amount you hold, not a place. |
| recovery | रिकव्हरी | yes |  |  |
| compounding | कंपाउंडिंग | yes |  |  |
| slippage | स्लिपेज | yes |  |  |
| liquidity | लिक्विडिटी | yes |  |  |
| volatility | अस्थिरता | no |  |  |

## Meaning first

The English is the source. Translate the **idea**, not the dictionary word. A sentence that
keeps the English shape but loses the meaning is a wrong translation, even when every word
is correct.

- If the Marathi word is narrower than the English, use the word readers already say, or keep
  the English word in Latin script. Add a short Marathi explanation in brackets on first use.
- Do not coin long Sanskrit words for market ideas. Readers learn from traders, not from
  official forms.
- Keep the book's own definitions. When a chapter defines a term, use the same Marathi
  phrase every time it returns.

Examples of meaning kept:

- **Speculation** is a short, uncertain bet, not a crime. Use "सट्टा". "सट्टेबाजी" reads as
  illegal betting and changes the meaning.
- **Position** is the amount you hold, not a place. Use "पोझिशन".
- **Exposure** is money at risk in one idea. Use "एक्सपोजर", not a literal "उघडकी".
- **Expectancy** is the average result per trade. Write "प्रति व्यापार सरासरी निकाल", not a
  literal coinage.
- **Edge** is a small, repeatable advantage. Keep "एज".
- **Slippage** is the gap between the price you expected and the price you got. Keep
  "स्लिपेज".
