// Cloudflare Worker (see ../wrangler.toml): serves the planner's files and relays character lookups to the official AION 2 API.
// Same job as serve.py. The relay exists because NCsoft's API refuses requests that come straight from a web page.
const ALLOWED = ['https://aion2.plaync.com/api/character/', 'https://api-search.plaync.com/aion2global/search/'];

export default {
  async fetch(request, env) {
    const here = new URL(request.url);
    if (here.pathname !== '/api') return env.ASSETS.fetch(request);
    const url = here.searchParams.get('url') || '';
    if (request.method !== 'GET' || !ALLOWED.some(p => url.startsWith(p))) return new Response('url not allowed', { status: 400 });
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0', Accept: 'application/json' } });
      return new Response(r.body, { status: r.status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
    } catch (e) {
      return new Response('could not reach the AION 2 API', { status: 502 });
    }
  },
};
