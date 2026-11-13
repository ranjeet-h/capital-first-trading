#!/usr/bin/env python3
"""Register translated overlay pages as drafts in the manifest.

  python3 tools/i18n/draft.py --lang mr 01-market-foundations/01-companies-shares-and-listings
  python3 tools/i18n/draft.py --lang mr --all-unregistered

Takes chapter folders relative to mdbook/src. Records the English hashes and sets
status "draft". Pages already reviewed are left alone. A maintainer stamps them later
with tools/i18n/stamp.py.
"""
import argparse
import datetime
import hashlib
import json
import os
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
    p.add_argument('--all-unregistered', action='store_true')
    p.add_argument('chapters', nargs='*')
    args = p.parse_args()
    content = os.path.join(ROOT, 'mdbook', 'i18n', args.lang, 'content')
    manifest_path = os.path.join(ROOT, 'mdbook', 'i18n', args.lang, 'manifest.json')
    manifest = json.load(open(manifest_path, encoding='utf-8'))
    pages = manifest.setdefault('pages', {})
    chapters = list(args.chapters)
    if args.all_unregistered:
        for track in sorted(os.listdir(content)):
            tdir = os.path.join(content, track)
            if not os.path.isdir(tdir):
                continue
            for ch in sorted(os.listdir(tdir)):
                rel = f'{track}/{ch}/index.md'
                if os.path.exists(os.path.join(content, rel)) and rel not in pages:
                    chapters.append(f'{track}/{ch}')
    today = datetime.date.today().isoformat()
    for ch in chapters:
        rel = ch.strip('/').removesuffix('/index.md') + '/index.md'
        if not os.path.exists(os.path.join(content, rel)):
            print(f'no overlay file: {rel}')
            return 1
        entry = pages.setdefault(rel, {})
        if entry.get('status') == 'reviewed':
            print(f'{rel}: already reviewed, skipped')
            continue
        entry.update({'status': 'draft', 'sourceSha256': sha(os.path.join(EN_ROOT, rel)),
                      'reviewer': None, 'reviewedOn': None, 'draftedOn': today})
        qrel = rel.replace('index.md', 'quiz.json')
        if os.path.exists(os.path.join(content, qrel)):
            entry['quiz'] = {'status': 'draft', 'sourceSha256': sha(os.path.join(EN_ROOT, qrel)),
                             'reviewer': None, 'reviewedOn': None, 'draftedOn': today}
        print(f'{rel}: draft registered')
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
        f.write('\n')
    return 0

if __name__ == '__main__':
    sys.exit(main())
