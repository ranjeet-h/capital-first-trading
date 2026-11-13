#!/usr/bin/env python3
"""Check the English book, or a translated overlay assembled into .build/<lang>/src.

English: the existing structure, component, disclaimer and quiz checks.
A translated book: those checks plus parity with English (ids, headings, components,
numbers, URLs, quiz structure), completeness counts and glossary consistency.

Run:
  python3 tools/check/check_chapters.py
  python3 tools/check/check_chapters.py --lang mr --root .build/mr/src
"""
import argparse
import glob
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
EN_ROOT = os.path.join(ROOT, 'mdbook', 'src')
H = ['## Hook', '## The idea', '## See it', '## Worked example', '## Try it',
     '### Guided exercise', '### Independent exercise', '## Quiz', '## Paper task',
     '## Limits and common mistakes', '## Remember', '## Sources and verification']
BANNED_EN = re.compile(r'guaranteed|sure profit|easy money|good trade|risk-free', re.I)
BANNED_MR = ('हमी', 'जोखीममुक्त', 'निश्चित नफा', 'खात्रीशीर नफा', 'सोपे पैसे',
             'चांगला व्यापार', 'निश्चित परतावा')
DEVANAGARI = re.compile(r'[\u0900-\u097F]')
NEG_MR = re.compile(r'^\s*(नाही|नाहीत|नसते|नसतो|नसणे)')
NEG_END_MR = re.compile(r'(नाही|नाहीत|नसते|नसतो|नसणे)\s*$')

def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument('--lang', default='en')
    p.add_argument('--root', default=None)
    p.add_argument('--english-root', default=EN_ROOT)
    p.add_argument('--manifest', default=None)
    p.add_argument('--glossary', default=os.path.join(ROOT, 'docs', 'i18n', 'glossary-mr.md'))
    args = p.parse_args()
    args.root = args.root or (EN_ROOT if args.lang == 'en' else os.path.join(ROOT, '.build', args.lang, 'src'))
    args.manifest = args.manifest or (os.path.join(ROOT, 'mdbook', 'i18n', args.lang, 'manifest.json')
                                      if args.lang != 'en' else None)
    return args

def allowed_components():
    allowed = {'quiz-block', 'kite-flow', 'kite-illustration'}
    for f in glob.glob(os.path.join(ROOT, 'mdbook', 'theme', 'demos*.js')):
        text = open(f, encoding='utf-8').read()
        allowed |= set(re.findall(r'D\[["\']([a-z0-9-]+)["\']\]\s*=', text))
        allowed |= set(re.findall(r'^\s*D\.([a-zA-Z0-9]+)\s*=', text, re.M))
    allowed |= set('order-flow-sim order-book-sim candle-builder sl-trigger-sim leverage-demo '
                   'position-size-viz drawdown-compounding streak-sim indicator-playground '
                   'pattern-quiz predict-next spot-the-mistake exercise-block gate-check '
                   'lab-position-size lab-costs lab-journal capital-allocation-planner '
                   'risk-limit-simulator strategy-simulator'.split())
    return allowed

def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()

def meta(text):
    m = re.match(r'<!-- meta\r?\n([\s\S]*?)-->', text)
    if not m:
        return {}
    out = {}
    for line in m.group(1).splitlines():
        if ':' in line:
            k, v = line.split(':', 1)
            out[k.strip()] = v.strip()
    return out

def h1(text):
    m = re.search(r'^# (.+)$', text, re.M)
    return m.group(1).strip() if m else None

def without_fences(text):
    return re.sub(r'```[^\n]*\n[\s\S]*?```', lambda m: '\n' * m.group(0).count('\n'), text)

def headings(text):
    return [(len(m.group(1)), m.group(2).strip())
            for m in re.finditer(r'^(#{2,3}) +(.+)$', without_fences(text), re.M)]

def components(text):
    out = []
    for m in re.finditer(r'<!--\s*component:\s*([^>]*?)-->', text):
        parts = m.group(1).split('|')
        name = parts[0].strip()
        params = []
        for p in parts[1:]:
            if ':' in p:
                k, v = p.split(':', 1)
                params.append((k.strip(), v.strip()))
        out.append((name, params))
    return out

def nums(text):
    text = re.sub(r'<!--.*?-->', '', text, flags=re.S)
    # Keep the number, not the sentence punctuation that follows it. Both books may put a
    # comma or full stop after a figure in a different place.
    return sorted(re.findall(r'\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?', text))

def urls(text):
    return sorted(re.findall(r'https?://[^\s<>)\]]+', text))

def paragraphs(text):
    text = without_fences(text)
    text = re.sub(r'<!--.*?-->', '', text, flags=re.S)
    lines = []
    for line in text.splitlines():
        s = line.strip()
        if not s:
            lines.append('')
        elif s.startswith('#') or s.startswith('|') or s.startswith('>') or s.startswith('<'):
            lines.append('')
        elif re.match(r'^([-*+]|\d+\.)\s+', s):
            lines.append('')
        else:
            lines.append('X')
    n, prev = 0, False
    for x in lines:
        if x == 'X' and not prev:
            n += 1
        prev = x == 'X'
    return n

def list_items(text):
    text = without_fences(text)
    return len(re.findall(r'^\s*(?:[-*+]|\d+\.)\s+', text, re.M))

def table_rows(text):
    return len(re.findall(r'^\s*\|.*\|\s*$', without_fences(text), re.M))

def blockquotes(text):
    return len(re.findall(r'^\s*>\s?', without_fences(text), re.M))

def fenced(text):
    return [(m.group(1).strip(), m.group(2)) for m in re.finditer(r'```([^\n]*)\n([\s\S]*?)```', text)]

def mermaid_structure(code):
    # Pie chart titles and quoted slice labels are reader text.
    code = re.sub(r'^(\s*title)\s+.*$', r'\1', code, flags=re.M)
    code = re.sub(r'"[^"\n]*"', '""', code)
    # Edge labels (|text|) are reader text too; only the arrows and node ids must match.
    code = re.sub(r'\|[^|\n]*\|', '||', code)
    code = re.sub(r'([A-Za-z0-9_]+)\[[^\]]*\]', r'\1[]', code)
    code = re.sub(r'([A-Za-z0-9_]+)\([^\)]*\)', r'\1()', code)
    code = re.sub(r'([A-Za-z0-9_]+)\{[^\}]*\}', r'\1{}', code)
    return re.sub(r'\s+', ' ', code).strip()

def section_list_counts(text):
    """Number of list items under each heading, in order.

    Headings are translated, so the names cannot be matched. The order and level are the
    same in both books (checked separately), which makes the position a safe key.
    """
    text = without_fences(text)
    marks = list(re.finditer(r'^(#{2,3}) +(.+)$', text, re.M))
    counts = []
    for i, m in enumerate(marks):
        end = marks[i + 1].start() if i + 1 < len(marks) else len(text)
        body = text[m.end():end]
        counts.append(len(re.findall(r'^\s*(?:[-*+]|\d+\.)\s+', body, re.M)))
    return counts

def banned_english(text):
    out = []
    for m in BANNED_EN.finditer(text):
        before = text[max(0, m.start() - 20):m.start()].lower()
        if re.search(r"(not|cannot|never|no|nor|neither|n't)\s+(be\s+|a\s+|really\s+)?$", before):
            continue
        out.append(text[max(0, m.start() - 40):m.end() + 20].replace('\n', ' '))
    return out

def banned_marathi(text):
    out = []
    for phrase in BANNED_MR:
        for m in re.finditer(re.escape(phrase), text):
            # "हमी" is a word of its own; "नेहमीच्या" contains the same letters but is a
            # different word. A match glued to another Devanagari letter is not the word.
            before_char = text[m.start() - 1] if m.start() else ''
            after_char = text[m.end()] if m.end() < len(text) else ''
            if DEVANAGARI.match(before_char) or DEVANAGARI.match(after_char):
                continue
            after = text[m.end():m.end() + 20]
            before = text[max(0, m.start() - 20):m.start()]
            if NEG_MR.match(after) or NEG_END_MR.search(before):
                continue
            out.append(text[max(0, m.start() - 40):m.end() + 20].replace('\n', ' '))
    return out

def quiz_problems(en, mr):
    probs = []
    if not isinstance(mr, list):
        return ['quiz is not a list']
    if len(en) != len(mr):
        probs.append(f'quiz length {len(mr)} != {len(en)}')
    for i, (a, b) in enumerate(zip(en, mr)):
        if a.get('id') != b.get('id'):
            probs.append(f'quiz {i}: id {b.get("id")} != {a.get("id")}')
        for k in ('type', 'answer', 'tolerance', 'concepts', 'difficulty', 'reviewAfterDays'):
            if a.get(k) != b.get(k):
                probs.append(f'quiz {a.get("id")}: {k} differs')
        # The unit is shown to the reader, so it is translated. It only has to be present.
        if bool(a.get('unit')) != bool(b.get('unit')):
            probs.append(f'quiz {a.get("id")}: unit missing or extra')
        ao = [o.get('id') for o in a.get('options', [])]
        bo = [o.get('id') for o in b.get('options', [])]
        if ao != bo:
            probs.append(f'quiz {a.get("id")}: option ids/order differ')
        ae = set(a.get('explanations', {}))
        be = set(b.get('explanations', {}))
        if ae != be:
            probs.append(f'quiz {a.get("id")}: explanation keys differ')
    return probs

def glossary_terms(path):
    if not os.path.exists(path):
        return []
    terms = []
    for line in read(path).splitlines():
        if not line.strip().startswith('|'):
            continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        if len(cells) < 2 or cells[0].lower() in ('english', '---') or set(cells[0]) <= set('-: '):
            continue
        english, marathi = cells[0], cells[1]
        if not english or not marathi or marathi in ('—', '-'):
            continue
        terms.append((english, marathi, cells[2] if len(cells) > 2 else '',
                      cells[3] if len(cells) > 3 else ''))
    return terms

def marathi_has(term, text):
    if term in text:
        return True
    # Marathi inflects the end of a word: नफा becomes नफ्याचे, तोटा becomes तोट्याचा.
    # For a term that ends in a vowel, the part before that vowel is a safe stem.
    if term and term[-1] in 'ाईीुूृेोा':
        stem = term[:-1]
        if len(stem) >= 2 and stem in text:
            return True
    return False

def glossary_problems(en_text, mr_text, terms):
    # Code, URLs, inline code and build comments are not prose and are allowlisted.
    strip = r'<!--.*?-->|`[^`]*`|https?://\S+'
    en = re.sub(strip, ' ', en_text, flags=re.S)
    mr = re.sub(strip, ' ', mr_text, flags=re.S)
    # "A share of savings" is a portion, not a stock share. The glossary term is about
    # company shares, so those phrases must not demand शेअर (the Marathi word for a portion
    # is वाटा).
    en_terms = re.sub(r'\b(?:trading\s+shares?\b|shares?\s+of\s+(?:the\s+|a\s+)?(?:total\s+|smaller\s+|growing\s+)?(?:savings|peak|balance|HWM)\b)', ' ', en, flags=re.I)
    # "In the same order" is a sequence and "SEBI order" is a regulator's ruling. Neither is
    # a buy or sell order, so they must not demand ऑर्डर.
    en_terms = re.sub(r'\b(?:in\s+(?:the\s+)?(?:same\s+|reverse\s+|reversed\s+|random\s+|different\s+)?order|(?:reversed?|random|shuffled|different|same)\s+order|order\s+of\s+the\s+(?:moves|results)|(?:SEBI|regulator(?:\'s)?(?:\s+own)?|regulatory)\s+orders?)\b', ' ', en_terms, flags=re.I)
    # Plain-word uses: a gap between two numbers is a difference, "time order" is a sequence,
    # and the top or bottom edge of a zone is a boundary, not a trading edge.
    en_terms = re.sub(r'\b(?:gap\s+between\s+(?:them|(?:the\s+)?(?:best\s+)?(?:bid|ask|open|high|low|close))|capital\s+letters|hard\s+to\s+live\s+with|kite\.trade|small\s+gap|in\s+time\s+order|(?:top|bottom|upper|lower)\s+edges?|edges?\s+of\s+(?:a|the|your)\s+zone|on\s+(?:the|its)\s+edge)\b', ' ', en_terms, flags=re.I)
    out = []
    for english, marathi, keep, avoid in terms:
        stem = re.escape(english)
        if ' ' in english:
            pattern = r'\b' + stem + r'\b'
        else:
            pattern = r'\b' + stem + r'(?:s|es|ed|ing)?\b'
        if not re.search(pattern, en_terms, re.I):
            continue
        if not marathi_has(marathi, mr) and not (keep.lower() == 'yes' and english.lower() in mr.lower()):
            out.append(f'glossary: "{english}" should use "{marathi}"')
        if avoid:
            for bad in [x.strip() for x in avoid.split(';') if x.strip()]:
                if bad in mr:
                    out.append(f'glossary: avoid "{bad}" for "{english}"')
    return out

def structural(text, qtext, allow, english_h=None):
    probs = []
    if not text.startswith('<!-- meta\nid:'):
        probs.append('front matter')
    m = meta(text)
    if not m.get('id'):
        probs.append('no meta id')
    if h1(text) != m.get('title'):
        probs.append('H1 does not match meta title')
    if english_h:
        for h in english_h:
            # Exact English headings are only expected on English pages. A translated
            # page is checked by sequence and count in compare_page().
            if h not in text and not any(h.startswith(x) for x in []):
                probs.append('missing ' + h)
    if '<!-- standing-disclaimer -->' not in text:
        probs.append('no disclaimer marker')
    for name, _params in components(text):
        if name not in allow:
            probs.append('bad component ' + name)
    return probs

def compare_page(en_text, mr_text, en_quiz, mr_quiz, terms, args):
    probs, flags = [], []
    em, mm = meta(en_text), meta(mr_text)
    if em or mm:
        if em.get('id') != mm.get('id'):
            probs.append(f'id {mm.get("id")} != {em.get("id")}')
        for k in ('page_type', 'prerequisites', 'labs', 'estimated_minutes'):
            if em.get(k) != mm.get(k):
                probs.append(f'meta {k} differs')
        if h1(mr_text) != mm.get('title'):
            probs.append('H1 does not match translated meta title')

    eh, mh = headings(en_text), headings(mr_text)
    if [x[0] for x in eh] != [x[0] for x in mh]:
        probs.append(f'heading levels/count differ ({len(mh)} != {len(eh)})')
    if len(eh) != len(mh):
        probs.append(f'heading count {len(mh)} != {len(eh)}')

    ec, mc = components(en_text), components(mr_text)
    if [x[0] for x in ec] != [x[0] for x in mc]:
        probs.append('component sequence differs')
    for (an, ap), (bn, bp) in zip(ec, mc):
        if an != bn:
            continue
        if [k for k, _ in ap] != [k for k, _ in bp]:
            probs.append(f'component {an}: parameter names differ')
        for (ak, av), (bk, bv) in zip(ap, bp):
            if ak == 'caption':
                continue
            if av != bv:
                probs.append(f'component {an}: {ak} differs')

    if nums(en_text) != nums(mr_text):
        missing = [x for x in nums(en_text) if x not in nums(mr_text)]
        extra = [x for x in nums(mr_text) if x not in nums(en_text)]
        probs.append(f'numbers differ (missing {missing[:8]}, extra {extra[:8]})')
    if urls(en_text) != urls(mr_text):
        probs.append('URLs differ')

    ep, mp = paragraphs(en_text), paragraphs(mr_text)
    if abs(ep - mp) > 1:
        probs.append(f'paragraph count {mp} != {ep}')
    el, ml = list_items(en_text), list_items(mr_text)
    if el != ml:
        probs.append(f'list items {ml} != {el}')
    et, mt = table_rows(en_text), table_rows(mr_text)
    if et != mt:
        probs.append(f'table rows {mt} != {et}')
    eq, mq = blockquotes(en_text), blockquotes(mr_text)
    if eq != mq:
        probs.append(f'blockquotes {mq} != {eq}')

    ef, mf = fenced(en_text), fenced(mr_text)
    if len(ef) != len(mf):
        probs.append(f'code blocks {len(mf)} != {len(ef)}')
    for (al, ac), (bl, bc) in zip(ef, mf):
        if al != bl:
            probs.append('code fence language differs')
        if al == 'mermaid':
            if mermaid_structure(ac) != mermaid_structure(bc):
                probs.append('mermaid structure differs')
        elif ac != bc:
            probs.append('code block text differs')

    if section_list_counts(en_text) != section_list_counts(mr_text):
        probs.append(f'section list items {section_list_counts(mr_text)} != {section_list_counts(en_text)}')

    if len(re.findall(r'\[VERIFY', mr_text)) < len(re.findall(r'\[VERIFY', en_text)):
        probs.append('[VERIFY count is lower than English')

    ratio = len(mr_text.split()) / max(1, len(en_text.split()))
    if ratio < 0.65 or ratio > 1.8:
        flags.append(f'word ratio {ratio:.2f} outside 0.65-1.8')

    if en_quiz is not None:
        probs += quiz_problems(en_quiz, mr_quiz)
    probs += glossary_problems(en_text, mr_text, terms)
    return probs, flags

def check_file(rel, args, allow, terms, manifest):
    en_path = os.path.join(args.english_root, rel)
    mr_path = os.path.join(args.root, rel)
    if not os.path.exists(mr_path):
        return [f'missing {rel}'], [], 0, 0, 0, 'missing'
    en_text, mr_text = read(en_path), read(mr_path)
    status = 'english' if args.lang == 'en' else 'fallback'
    entry = (manifest or {}).get('pages', {}).get(rel)
    if entry and entry.get('status') not in (None, 'fallback'):
        status = entry.get('status')
    if args.lang != 'en' and entry and entry.get('sourceSha256') and entry['sourceSha256'] != __import__('hashlib').sha256(open(en_path, 'rb').read()).hexdigest():
        status = 'stale'
    if rel == 'index.md':
        probs = []
    else:
        allow_h = H if args.lang == 'en' else None
        probs = structural(mr_text, None, allow, allow_h)
    probs += banned_english(mr_text)
    if args.lang != 'en':
        probs += banned_marathi(mr_text)
    flags = []
    if args.lang != 'en' and status != 'fallback' and rel != 'index.md':
        qrel = rel.replace('index.md', 'quiz.json')
        enq = json.loads(read(os.path.join(args.english_root, qrel))) if os.path.exists(os.path.join(args.english_root, qrel)) else None
        mrq = json.loads(read(os.path.join(args.root, qrel))) if os.path.exists(os.path.join(args.root, qrel)) else None
        p, f = compare_page(en_text, mr_text, enq, mrq, terms, args)
        probs += p
        flags += f
    if args.lang != 'en' and rel == 'index.md' and status != 'fallback':
        p, f = compare_page(en_text, mr_text, None, None, terms, args)
        probs += p
        flags += f
    nq = 0
    qpath = os.path.join(args.root, rel.replace('index.md', 'quiz.json'))
    if os.path.exists(qpath):
        try:
            nq = len(json.loads(read(qpath)))
        except Exception:
            probs.append('quiz json error')
    return probs, flags, len(mr_text.split()), len(re.findall(r'\[VERIFY', mr_text)), nq, status

def main():
    args = parse_args()
    allow = allowed_components()
    terms = glossary_terms(args.glossary) if args.lang == 'mr' else []
    manifest = json.loads(read(args.manifest)) if args.manifest and os.path.exists(args.manifest) else {'pages': {}}
    total_probs = 0

    # Front page, when translated, is a first-class page.
    if os.path.exists(os.path.join(args.root, 'index.md')):
        probs, flags, words, nver, nq, status = check_file('index.md', args, allow, terms, manifest)
        total_probs += len(probs)
        extra = [f'status={status}'] + (['flags=' + '; '.join(flags)] if flags else [])
        print(f"index: words={words} verify={nver} q={nq}", probs if probs else ('OK ' + ' '.join(extra)))

    for d in sorted(x for x in glob.glob(args.root + '/*/*/') if not x[len(args.root)+1:].startswith('labs/')):
        rel = os.path.relpath(d + 'index.md', args.root).replace(os.sep, '/')
        probs, flags, words, nver, nq, status = check_file(rel, args, allow, terms, manifest)
        total_probs += len(probs)
        extra = []
        if args.lang != 'en':
            extra.append('status=' + status)
        if flags:
            extra.append('flags=' + '; '.join(flags))
        print(f"{rel[:-len('/index.md')]}: words={words} verify={nver} q={nq}",
              probs if probs else ('OK ' + ' '.join(extra)).strip())
    if total_probs:
        print(f'{total_probs} problem(s)')
        return 1
    return 0

if __name__ == '__main__':
    sys.exit(main())
