"""Tell IndexNow (Bing, Yandex, Seznam, Naver...) which pages changed in this push.
Runs in GitHub Actions after every push to main. First run / manual run sends every URL in the sitemap."""
import json, os, re, subprocess, sys, urllib.request

SITE = "https://soft2cloud.com"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
keys = [f[:-4] for f in os.listdir(ROOT) if re.fullmatch(r"[0-9a-f]{32}\.txt", f)]
if not keys:
    sys.exit("No IndexNow key file found")
KEY = keys[0]

def all_urls():
    xml = open(os.path.join(ROOT, "sitemap.xml"), encoding="utf-8").read()
    return re.findall(r"<loc>([^<]+)</loc>", xml)

def changed_urls(before, after):
    out = subprocess.run(["git", "diff", "--name-only", before, after], capture_output=True, text=True, cwd=ROOT)
    if out.returncode:
        return None
    urls = []
    for f in out.stdout.split():
        if not f.endswith("index.html") or f.startswith("."):
            continue
        urls.append(SITE + "/" + f[: -len("index.html")])
    return urls

before, after = os.environ.get("BEFORE", ""), os.environ.get("AFTER", "HEAD")
urls = None
if before and not set(before) <= {"0"} and os.environ.get("EVENT") != "workflow_dispatch":
    urls = changed_urls(before, after)
if urls is None:
    urls = all_urls()
known = set(all_urls())
urls = sorted(u for u in set(urls) if u in known)
if not urls:
    print("No page changes — nothing to submit.")
    sys.exit(0)

body = json.dumps({"host": "soft2cloud.com", "key": KEY, "keyLocation": f"{SITE}/{KEY}.txt", "urlList": urls[:10000]}).encode()
req = urllib.request.Request("https://api.indexnow.org/indexnow", data=body, headers={"Content-Type": "application/json; charset=utf-8"})
try:
    with urllib.request.urlopen(req, timeout=30) as r:
        print(f"IndexNow: HTTP {r.status} — submitted {len(urls)} URL(s)")
except urllib.error.HTTPError as e:
    print(f"IndexNow: HTTP {e.code} {e.read()[:300]!r}")
    # 202 = accepted/pending key check; 403 = key not yet live; 422 = URLs not matching host
    if e.code not in (202,):
        sys.exit(1)
for u in urls:
    print(" ", u)
