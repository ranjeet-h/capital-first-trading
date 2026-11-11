"""Short, reader-facing chapter titles derived from the curriculum specs."""
import glob, os, re
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
OVERRIDES = {
 'T6.5': 'Why scalping, option buying and martingale are dangerous',
 'T9.5': 'Algo trading and why this book does not automate',
 'T7.8': 'Metrics and their limits',
 'T6.3': 'Trend following in depth',
 'T4.9': 'A complete demo walkthrough',
 'T2.17': 'Scaling and withdrawal policy',
 'T1.10': 'Market participants and misleading tips',
 'T1.6': 'Trading sessions, timings and holidays',
 'T1.5': 'Order matching, spread and liquidity',
 'T1.2': 'Exchanges, SEBI and brokers',
 'T1.4': 'How prices move: the order book',
 'T1.9': 'Corporate actions',
 'T1.3': 'Demat accounts and settlement',
 'T2.8': 'Expectancy and profit factor',
 'T2.5': 'Position sizing step by step',
 'T2.2': 'Costs on a trade',
 'T2.3': 'Taxes on trading profits',
 'T2.15': 'Capital allocation',
 'T2.11': 'Risk limits',
 'T1.7': 'Circuit limits and halts',
 'T1.8': 'Indices: Nifty and Sensex',
 'T9.4': "SEBI's F&O studies as a case study",
 'T5.8': 'Volume indicators and VWAP',
 'T8.6': 'Living through a losing streak',
 'T8.7': 'When to stop trading altogether',
 'T8.5': 'The journal as a tool',
 'T7.10': 'Paper trading and forward testing',
 'T2.12': 'Overtrading',
 'T6.1': 'Investing and trading styles',
 'T1.1': 'Companies, shares and listings',
}
def spec_titles():
    out = {}
    for f in glob.glob(os.path.join(ROOT, 'curriculum', 'tracks-*.md')):
        for line in open(f):
            m = re.match(r'### (T\d+\.\d+)\s+(.*)$', line.rstrip())
            if m: out[m.group(1)] = m.group(2)
    return out
def short(cid, full):
    if cid in OVERRIDES: return OVERRIDES[cid]
    t = re.sub(r'\s*\((?:[a-z-]+|Lab \d+|[^()]*gate[^()]*|illustrative[^()]*)\)\s*$', '', full)
    t = re.split(r'[:;]', t)[0].strip()
    if ',' in t and len(t) > 40: t = t.split(',')[0].strip()
    return t[0].upper() + t[1:]
def short_titles():
    return {cid: short(cid, full) for cid, full in spec_titles().items()}
if __name__ == '__main__':
    for k, v in sorted(short_titles().items(), key=lambda kv: [int(x) for x in kv[0][1:].split('.')]):
        print(k, '|', v)
