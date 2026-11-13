#!/usr/bin/env python3
"""List repeated bold terms, heading words and phrases from the English book. Use the
output as the seed for docs/i18n/glossary-mr.md; do not publish it as the glossary.

  python3 tools/i18n/extract_terms.py > /tmp/terms.md
"""
import collections
import glob
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
SRC = os.path.join(ROOT, 'mdbook', 'src')

def main():
    terms = collections.Counter()
    where = collections.defaultdict(set)
    for path in glob.glob(os.path.join(SRC, '*', '*', 'index.md')):
        rel = os.path.relpath(path, SRC)
        text = open(path, encoding='utf-8').read()
        for m in re.finditer(r'\*\*([^*]{2,60})\*\*', text):
            term = m.group(1).strip().rstrip('.').lower()
            if term and not term[0].isdigit():
                terms[term] += 1
                where[term].add(rel.split(os.sep)[0])
        for m in re.finditer(r'^#{2,3} +(.+)$', text, re.M):
            for word in re.findall(r'[A-Za-z][A-Za-z-]{3,}', m.group(1)):
                terms[word.lower()] += 1
                where[word.lower()].add(rel.split(os.sep)[0])
    print('| English | Marathi | Keep English? | Note |')
    print('|---|---|---|---|')
    for term, count in terms.most_common(250):
        if count < 2:
            continue
        print(f'| {term} |  |  | appears {count} times in {", ".join(sorted(where[term]))} |')

if __name__ == '__main__':
    main()
