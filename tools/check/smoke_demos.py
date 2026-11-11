#!/usr/bin/env python3
"""Open every built chapter in headless Chrome. Report fallback boxes and JS errors.

Usage: python3 tools/check/smoke_demos.py [path-filter]
Run `make build` first. Needs Google Chrome (macOS path below).
"""
import glob, os, re, subprocess, sys, threading, http.server, socketserver, functools, tempfile
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
BOOK = os.path.join(ROOT, "mdbook", "book")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT = 3127
flt = sys.argv[1] if len(sys.argv) > 1 else ""

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass

handler = functools.partial(Quiet, directory=BOOK)
socketserver.TCPServer.allow_reuse_address = True
srv = socketserver.ThreadingTCPServer(("127.0.0.1", PORT), handler)
threading.Thread(target=srv.serve_forever, daemon=True).start()

pages = sorted(glob.glob(os.path.join(BOOK, "[0-1][0-9]-*", "*", "index.html")))
pages = [p for p in pages if flt in p]

def check(p):
    rel = os.path.relpath(p, BOOK)
    prof = tempfile.mkdtemp(prefix="cft-smoke-")
    cmd = [CHROME, "--headless=new", "--disable-gpu", "--user-data-dir=" + prof,
           "--virtual-time-budget=6000", "--enable-logging=stderr", "--v=0",
           "--dump-dom", "http://127.0.0.1:%d/%s" % (PORT, rel)]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=90)
    dom, err = r.stdout, r.stderr
    comps = len(re.findall(r'class="cft-host"', dom))
    fall = len(re.findall(r'cft-placeholder', dom))
    demos = len(re.findall(r'cft-demo', dom))
    js = [l for l in err.splitlines() if "CONSOLE" in l and ("Uncaught" in l or "Error" in l)]
    quiz_fail = "Could not load" in dom
    return rel, comps, demos, fall, js, quiz_fail

bad = 0
with ThreadPoolExecutor(max_workers=4) as ex:
    for rel, comps, demos, fall, js, qf in ex.map(check, pages):
        flag = fall or js or qf or demos == 0
        if flag:
            bad += 1
            print("%s: hosts=%d demos=%d fallback=%d quizfail=%s" % (rel, comps, demos, fall, qf))
            for l in js[:3]: print("   ", l[:200])
print("pages=%d with problems=%d" % (len(pages), bad))
