#!/usr/bin/env python3
"""Generate mdbook/src/SUMMARY.md from the chapter folders (meta comment holds id + title)."""
import glob, os, re
SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'mdbook', 'src')
TRACKS = {
 '00-start-here': 'Track 0: Start here',
 '01-market-foundations': 'Track 1: Market foundations',
 '02-money-and-math': 'Track 2: Money and math',
 '03-chart-reading': 'Track 3: Chart reading',
 '04-kite-and-execution': 'Track 4: Kite and execution (demo only)',
 '05-indicators': 'Track 5: Indicators',
 '06-strategy': 'Track 6: Strategy',
 '07-testing-and-validation': 'Track 7: Testing and validation',
 '08-psychology-and-journaling': 'Track 8: Psychology and journaling',
 '09-advanced': 'Track 9: Advanced (theory only)',
 '10-graduation-gates': 'Track 10: Graduation gates',
}
out = ['# Summary', '', '[Capital-First Trading](index.md)', '']
for tdir in sorted(d for d in os.listdir(SRC) if os.path.isdir(os.path.join(SRC, d)) and re.match(r'\d\d-', d)):
    out.append('# ' + TRACKS.get(tdir, tdir))
    out.append('')
    for idx in sorted(glob.glob(os.path.join(SRC, tdir, '*', 'index.md'))):
        t = open(idx).read()
        cid = re.search(r'^id:\s*(\S+)', t, re.M).group(1)
        title = re.search(r'^title:\s*(.+)$', t, re.M).group(1).strip()
        rel = os.path.relpath(idx, SRC)
        out.append(f'- [{cid} {title}]({rel})')
    out.append('')
open(os.path.join(SRC, 'SUMMARY.md'), 'w').write('\n'.join(out))
print('SUMMARY.md written')
