#!/usr/bin/env python3
"""Scaffold mdbook/i18n/<lang>/ so a translator can start without copying files by hand.

  python3 tools/i18n/new_language.py --lang hi
"""
import argparse
import json
import os
import shutil

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
I18N = os.path.join(ROOT, 'mdbook', 'i18n')

def main():
    p = argparse.ArgumentParser()
    p.add_argument('--lang', required=True)
    args = p.parse_args()
    code = args.lang.strip().lower()
    if not code.isalpha() or len(code) < 2:
        print('language code must be letters, for example hi or ta')
        return 1
    dest = os.path.join(I18N, code)
    if os.path.exists(dest):
        print(f'already exists: {dest}')
        return 1
    os.makedirs(os.path.join(dest, 'content'), exist_ok=True)
    strings = json.load(open(os.path.join(I18N, 'strings.en.json'), encoding='utf-8'))
    strings.setdefault('meta', {})
    strings['meta']['language'] = code
    strings['meta']['name'] = code.upper()
    strings['meta']['root'] = code + '/'
    with open(os.path.join(dest, 'strings.json'), 'w', encoding='utf-8') as f:
        json.dump(strings, f, ensure_ascii=False, indent=2)
        f.write('\n')
    with open(os.path.join(dest, 'manifest.json'), 'w', encoding='utf-8') as f:
        json.dump({'meta': {'language': code, 'name': code.upper()}, 'pages': {}}, f, ensure_ascii=False, indent=2)
        f.write('\n')
    toml = open(os.path.join(I18N, 'mr', 'book.toml'), encoding='utf-8').read()
    toml = toml.replace('language = "mr"', f'language = "{code}"')
    toml = toml.replace('title = "भांडवल-प्रथम ट्रेडिंग"', f'title = "Capital-First Trading ({code})"')
    toml = toml.replace('description = "भांडवलाचे संरक्षण प्रथम ठेवून भारतीय बाजारात ट्रेडिंग शिकण्यासाठी ऑफलाइन, संवादी अभ्यास पुस्तक."',
                        'description = "An offline, interactive study book for learning Indian-market trading with capital protection first."')
    with open(os.path.join(dest, 'book.toml'), 'w', encoding='utf-8') as f:
        f.write(toml)
    shutil.copyfile(os.path.join(ROOT, 'mdbook', 'src', 'manifest.webmanifest'),
                    os.path.join(dest, 'manifest.webmanifest'))
    print(f'created {dest}/')
    print('Next: translate content/index.md and one chapter, add manifest entries,')
    print(f'run make check BOOK_LANG={code}, then make e2e BOOK_LANG={code}.')
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
