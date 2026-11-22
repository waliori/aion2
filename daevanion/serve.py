#!/usr/bin/env python3
"""Serve the planner on http://localhost:8787 and relay character lookups to the official AION 2 API.

The relay exists because NCsoft's API refuses requests that come straight from a web page
("Invalid CORS request"). It only forwards GETs to the two prefixes below.
"""
import os, urllib.error, urllib.parse, urllib.request
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ALLOWED = ("https://aion2.plaync.com/api/character/", "https://api-search.plaync.com/aion2global/search/")
PORT = 8787


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if not self.path.startswith("/api?"):
            return super().do_GET()
        url = urllib.parse.parse_qs(urllib.parse.urlsplit(self.path).query).get("url", [""])[0]
        if not url.startswith(ALLOWED):
            return self.send_error(400, "url not allowed")
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0", "Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=20) as r:
                status, body = r.status, r.read()
        except urllib.error.HTTPError as e:
            status, body = e.code, e.read()
        except OSError as e:
            return self.send_error(502, f"could not reach the AION 2 API: {e}")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    handler = partial(Handler, directory=str(Path(__file__).parent))
    print(f"Ariel planner: http://localhost:{PORT}  (Ctrl+C to stop)")
    # BIND=0.0.0.0 only inside the container, where compose.yaml publishes the port to localhost only
    ThreadingHTTPServer((os.environ.get("BIND", "127.0.0.1"), PORT), handler).serve_forever()
