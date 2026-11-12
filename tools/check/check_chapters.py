import json, re, sys, glob, os
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'mdbook', 'src')
H = ['## Hook','## The idea','## See it','## Worked example','## Try it','### Guided exercise','### Independent exercise','## Quiz','## Paper task','## Limits and common mistakes','## Remember','## Sources and verification']
ALLOWED = {'quiz-block', 'kite-flow', 'kite-illustration'}
for _f in glob.glob(os.path.join(root, '..', 'theme', 'demos*.js')):
    _t = open(_f).read()
    ALLOWED |= set(re.findall(r'D\[["\']([a-z0-9-]+)["\']\]\s*=', _t))
    ALLOWED |= set(re.findall(r'^\s*D\.([a-zA-Z0-9]+)\s*=', _t, re.M))
ALLOWED |= set('order-flow-sim order-book-sim candle-builder sl-trigger-sim leverage-demo position-size-viz drawdown-compounding streak-sim indicator-playground pattern-quiz predict-next spot-the-mistake exercise-block gate-check lab-position-size lab-costs lab-journal capital-allocation-planner risk-limit-simulator strategy-simulator'.split())
BANNED = re.compile(r'guaranteed|sure profit|easy money|good trade|risk-free', re.I)
for d in sorted([x for x in glob.glob(root + '/*/*/') if not x[len(root)+1:].startswith('labs/')]):
    name = d[len(root)+1:]
    probs = []
    ip = d + 'index.md'; qp = d + 'quiz.json'
    if not os.path.exists(ip): probs.append('no index.md'); print(name, probs); continue
    t = open(ip).read()
    if not t.startswith('<!-- meta\nid:'): probs.append('front matter')
    for h in H:
        if h not in t: probs.append('missing ' + h)
    if '<!-- standing-disclaimer -->' not in t: probs.append('no disclaimer marker')
    for m in re.findall(r'<!-- component: ([a-z-]+)', t):
        if m not in ALLOWED: probs.append('bad component ' + m)
    for m in BANNED.finditer(t):
        if re.search(r"(not|cannot|never|no|nor|neither|n't)\s+(be\s+|a\s+|really\s+)?$", t[max(0,m.start()-14):m.start()].lower()): continue
        probs.append('banned: ' + t[max(0,m.start()-40):m.end()+20].replace('\n',' '))
    words = len(t.split())
    nver = len(re.findall(r'\[VERIFY', t))
    nq = 0
    if not os.path.exists(qp): probs.append('no quiz.json')
    else:
        try:
            q = json.load(open(qp)); nq = len(q)
            types = {x.get('type') for x in q}
            if nq < 5: probs.append('few questions')
            if 'numeric' not in types: probs.append('no numeric')
            if 'scenario' not in types: probs.append('no scenario')
            if 'spot-the-mistake' not in types: probs.append('no spot-the-mistake')
            for x in q:
                for k in ('id','type','prompt','answer','concepts','difficulty','reviewAfterDays'):
                    if k not in x: probs.append(f"{x.get('id')} missing {k}")
                if x.get('type') != 'numeric':
                    opts = {o['id'] for o in x.get('options', [])}
                    ans = x['answer'] if isinstance(x['answer'], list) else [x['answer']]
                    if not set(ans) <= opts: probs.append(f"{x['id']} answer not in options")
                    wrong = opts - set(ans) if x['type'] not in ('order',) else opts - set()
                    ex = set(x.get('explanations', {}))
                    if x['type'] != 'order' and not wrong <= ex: probs.append(f"{x['id']} missing explanations {sorted(wrong-ex)}")
                else:
                    if 'solution' not in x or 'unit' not in x: probs.append(f"{x['id']} numeric lacks solution/unit")
        except Exception as e:
            probs.append('json error ' + str(e))
    print(f"{name}: words={words} verify={nver} q={nq}", probs if probs else 'OK')
