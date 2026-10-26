"""Build project-bc-itch.zip for uploading to itch.io as an HTML5 game.

Run from the repo root: python3 make-itch-zip.py
index.html sits at the root of the ZIP, as itch.io requires.
"""
import os, zipfile

SKIP_DIRS = {'.git', '.claude', '__pycache__'}
SKIP_EXT = {'.md', '.txt', '.py', '.zip'}
KEEP = {'prologue.txt', 'THREE-LICENSE.txt'}
OUT = 'project-bc-itch.zip'

files = []
for root, dirs, names in os.walk('.'):
    dirs[:] = [d for d in dirs if d not in SKIP_DIRS]
    for n in names:
        if n == 'Project BC.html' or (os.path.splitext(n)[1] in SKIP_EXT and n not in KEEP) or n.startswith('.'):
            continue
        files.append(os.path.relpath(os.path.join(root, n), '.'))

if len(files) > 1000:
    raise SystemExit(f'{len(files)} files: itch.io allows at most 1000')
with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED) as z:
    for f in sorted(files):
        z.write(f, f.replace(os.sep, '/'))
print(f'{OUT}: {len(files)} files, {os.path.getsize(OUT) / 1e6:.0f} MB')
