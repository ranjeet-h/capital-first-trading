#!/usr/bin/env python3
"""After a wording-only rewrite: confirm numbers, comments and quiz answers are unchanged vs git HEAD."""
import glob, json, re, subprocess, sys
def head(p):
    return subprocess.run(['git','show','HEAD:'+p],capture_output=True,text=True).stdout
def nums(t):
    t = re.sub(r'<!--.*?-->', '', t, flags=re.S)
    return sorted(set(re.sub(r'[.,]+$','',x) for x in re.findall(r'\d[\d,.]*', t)))
bad = 0
for p in sorted(glob.glob('mdbook/src/*/*/index.md')):
    old, new = head(p), open(p).read()
    if not old or old == new: continue
    oc = re.findall(r'<!--.*?-->', old, re.S); nc = re.findall(r'<!--.*?-->', new, re.S)
    msgs = []
    if oc != nc: msgs.append('comments differ')
    a, b = set(nums(old)), set(nums(new))
    if a - b: msgs.append('numbers removed: ' + ' '.join(sorted(a - b)[:12]))
    if b - a: msgs.append('numbers added: ' + ' '.join(sorted(b - a)[:12]))
    qo, qn = head(p.replace('index.md','quiz.json')), open(p.replace('index.md','quiz.json')).read()
    try:
        jo, jn = json.loads(qo), json.loads(qn)
        for x, y in zip(jo, jn):
            for k in ('id','type','answer','tolerance','unit','concepts','difficulty','reviewAfterDays'):
                if x.get(k) != y.get(k): msgs.append(f"quiz {x['id']} {k} changed")
            if [o['id'] for o in x.get('options',[])] != [o['id'] for o in y.get('options',[])]: msgs.append(f"quiz {x['id']} option ids changed")
        if len(jo) != len(jn): msgs.append('quiz length changed')
    except Exception as e: msgs.append('quiz json error ' + str(e))
    words = len(new.split()); sents = [s for s in re.split(r'(?<=[.!?])\s+', re.sub(r'<!--.*?-->|\|.*\||[#*`]', ' ', new, flags=re.S)) if len(s.split())>2]
    avg = sum(len(s.split()) for s in sents)/max(1,len(sents))
    print(p.split('/',2)[2].rsplit('/',1)[0], f'avg_sentence={avg:.1f}', msgs or 'ok'); bad += bool(msgs)
print('chapters with issues:', bad)
