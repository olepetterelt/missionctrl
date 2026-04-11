export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const apiKey = env.N2YO_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'N2YO_API_KEY not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  const type    = url.searchParams.get('type');
  const id      = url.searchParams.get('id') || '25544';
  const lat     = url.searchParams.get('lat') || '59.9';
  const lon     = url.searchParams.get('lon') || '10.7';
  const alt     = url.searchParams.get('alt') || '100';
  const seconds = url.searchParams.get('seconds') || '1';
  const days    = url.searchParams.get('days') || '10';
  const minEl   = url.searchParams.get('minEl') || '10';

  const BASE = 'https://api.n2yo.com/rest/v1/satellite';
  const routes = {
    positions: `${BASE}/positions/${id}/${lat}/${lon}/${alt}/${seconds}/&apiKey=${apiKey}`,
    passes:    `${BASE}/visualpasses/${id}/${lat}/${lon}/${alt}/${days}/${minEl}/&apiKey=${apiKey}`,
    above:     `${BASE}/above/${lat}/${lon}/${alt}/70/18/&apiKey=${apiKey}`,
    tle:       `${BASE}/tle/${id}&apiKey=${apiKey}`,
  };

  if (!type || !routes[type]) {
    return new Response(JSON.stringify({ error: 'Unknown type' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const res = await fetch(routes[type]);
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=30',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
}
