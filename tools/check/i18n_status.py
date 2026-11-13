#!/usr/bin/env python3
"""Report translation status, recomputing source hashes so a changed English page shows
as stale even when the manifest still says reviewed.

  python3 tools/check/i18n_status.py --lang mr
  python3 tools/check/i18n_status.py --lang mr --check-stale
"""
import argparse
import hashlib
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))

def sha(path):
    with open(path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()

def effective(entry, english_path):
    status = entry.get('status', 'fallback')
    if entry.get('sourceSha256') and os.path.exists(english_path):
        if entry['sourceSha256'] != sha(english_path):
            return 'stale'
    return status

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--lang', default='mr')
    p.add_argument('--manifest', default=None)
    p.add_argument('--english-root', default=os.path.join(ROOT, 'mdbook', 'src'))
    p.add_argument('--check-stale', action='store_true')
    args = p.parse_args()
    manifest_path = args.manifest or os.path.join(ROOT, 'mdbook', 'i18n', args.lang, 'manifest.json')
    if not os.path.exists(manifest_path):
        print(f'no manifest: {manifest_path}')
        return 1
    manifest = json.load(open(manifest_path, encoding='utf-8'))
    pages = manifest.get('pages', {})
    counts = {}
    stale_reviewed = []
    for rel, entry in sorted(pages.items()):
        en = os.path.join(args.english_root, rel)
        status = effective(entry, en)
        counts[status] = counts.get(status, 0) + 1
        quiz_status = None
        if entry.get('quiz'):
            qrel = rel.replace('index.md', 'quiz.json')
            quiz_status = effective(entry['quiz'], os.path.join(args.english_root, qrel))
            counts['quiz:' + quiz_status] = counts.get('quiz:' + quiz_status, 0) + 1
        print(f'{rel}: {status}' + (f' quiz={quiz_status}' if quiz_status else ''))
        if status == 'stale' and entry.get('status') in ('reviewed', 'confirmed'):
            stale_reviewed.append(rel)
    # Every chapter has a fallback page, so the count above is only the pages with a
    # manifest entry. Add a rough total from the English tree.
    total = len([d for d in os.listdir(args.english_root)
                 if os.path.isdir(os.path.join(args.english_root, d)) and d[:2].isdigit()])
    print('---')
    print('manifest pages:', len(pages))
    print('status counts:', ', '.join(f'{k}={v}' for k, v in sorted(counts.items())))
    print('tracks:', total, '(pages without an overlay fall back to English)')
    if stale_reviewed:
        print('stale reviewed pages:', ', '.join(stale_reviewed))
        if args.check_stale:
            return 1
    return 0

if __name__ == '__main__':
    sys.exit(main())
