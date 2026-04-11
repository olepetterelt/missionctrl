// Cloudflare Pages Function — proxies N2YO satellite tracking API
// N2YO_API_KEY is set in Cloudflare dashboard, never in repo

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const apiKey = env.N2YO_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'N2YO_API_KEY not configured' }), {
      status: 500, headers: corsHeaders(),
    });
  }

  // /functions/n2yo?type=positions&id=25544&lat=59.9&lon=10.7&alt=100&seconds=1
  const type = url.searchParams.get('type');
  const id   = url.searchParams.get('id') || '25544'; // default to ISS
  const lat  = url.searchParams.get('lat') || '59.9';
  const lon  = url.searchParams.get('lon') || '10.7';
  const alt  = url.searchParams.get('alt') || '100';
  const seconds  = url.searchParams.get('seconds') || '1';
  const days     = url.searchParams.get('days') || '10';
  const minEl    = url.searchParams.get('minEl') || '10';

  const BASE = 'https://api.n2yo.com/rest/v1/satellite';

  const routes = {
    // Live position
    positions: `${BASE}/positions/${id}/${lat}/${lon}/${alt}/${seconds}/&apiKey=${apiKey}`,
    // Visual passes (ISS visible from ground)
    passes:    `${BASE}/visualpasses/${id}/${lat}/${lon}/${alt}/${days}/${minEl}/&apiKey=${apiKey}`,
    // Above — satellites above observer
    above:     `${BASE}/above/${lat}/${lon}/${alt}/70/18/&apiKey=${apiKey}`,
    // TLE data
    tle:       `${BASE}/tle/${id}&apiKey=${apiKey}`,
  };

  if (!type || !routes[type]) {
    return new Response(JSON.stringify({ error: 'Unknown type. Use: positions, passes, above, tle' }), {
      status: 400, headers: corsHeaders(),
    });
  }

  try {
    const res = await fetch(routes[type], {
      headers: { 'User-Agent': 'missionctrl.no/1.0' },
    });
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: corsHeaders(),
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'N2YO API error', detail: e.message }), {
      status: 502, headers: corsHeaders(),
    });
  }
}

function corsHeaders() {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=30',
  };
}
