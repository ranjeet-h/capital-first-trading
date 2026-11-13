#!/usr/bin/env python3
"""Mark one translated page (and its quiz) as reviewed.

  python3 tools/i18n/stamp.py --lang mr --id T0.1 --reviewer "Name" --date 2026-11-13
  make i18n-stamp ID=T0.1 REVIEWER="Name"

The English hashes are recomputed at stamp time. If the English page changes later, the
build shows it as stale until it is stamped again.
"""
import argparse
import datetime
import hashlib
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
EN_ROOT = os.path.join(ROOT, 'mdbook', 'src')

def sha(path):
    with open(path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--lang', default='mr')
    p.add_argument('--id', default=None)
    p.add_argument('--path', default=None, help='source-relative path, e.g. index.md')
    p.add_argument('--reviewer', default=os.environ.get('REVIEWER'))
    p.add_argument('--date', default=datetime.date.today().isoformat())
    args = p.parse_args()
    if not args.reviewer:
        print('a reviewer name is required: --reviewer "Name" (or REVIEWER=...)')
        return 1
    try:
        datetime.date.fromisoformat(args.date)
    except ValueError:
        print('date must be YYYY-MM-DD')
        return 1

    rel = args.path
    if not rel:
        if not args.id:
            print('--id or --path is required')
            return 1
        for idx in sorted(__import__('glob').glob(os.path.join(EN_ROOT, '*', '*', 'index.md'))):
            text = open(idx, encoding='utf-8').read()
            m = re.match(r'<!-- meta\r?\n([\s\S]*?)-->', text)
            if m and re.search(r'^\s*id:\s*' + re.escape(args.id) + r'\s*$', m.group(1), re.M):
                rel = os.path.relpath(idx, EN_ROOT).replace(os.sep, '/')
                break
        if not rel:
            print(f'no English chapter with id {args.id}')
            return 1

    overlay = os.path.join(ROOT, 'mdbook', 'i18n', args.lang, 'content', rel)
    if not os.path.exists(overlay):
        print(f'no overlay file: {overlay}')
        return 1
    manifest_path = os.path.join(ROOT, 'mdbook', 'i18n', args.lang, 'manifest.json')
    manifest = json.load(open(manifest_path, encoding='utf-8'))
    entry = manifest.setdefault('pages', {}).setdefault(rel, {})
    entry['status'] = 'reviewed'
    entry['sourceSha256'] = sha(os.path.join(EN_ROOT, rel))
    entry['reviewer'] = args.reviewer
    entry['reviewedOn'] = args.date
    entry.pop('draftedOn', None)
    qrel = rel.replace('index.md', 'quiz.json')
    qoverlay = os.path.join(ROOT, 'mdbook', 'i18n', args.lang, 'content', qrel)
    if os.path.exists(qoverlay):
        quiz = entry.setdefault('quiz', {})
        quiz['status'] = 'reviewed'
        quiz['sourceSha256'] = sha(os.path.join(EN_ROOT, qrel))
        quiz['reviewer'] = args.reviewer
        quiz['reviewedOn'] = args.date
        quiz.pop('draftedOn', None)
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write('\n')
    print(f'{rel}: reviewed by {args.reviewer} on {args.date}')
    return 0

if __name__ == '__main__':
    sys.exit(main())
