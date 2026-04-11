// Cloudflare Pages Function — proxies NASA APIs
// NASA_API_KEY is set in Cloudflare dashboard, never in repo

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const endpoint = url.searchParams.get('endpoint');
  const apiKey = env.NASA_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'NASA_API_KEY not configured' }), {
      status: 500, headers: corsHeaders('application/json'),
    });
  }

  const endpoints = {
    apod:      `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`,
    asteroids: `https://api.nasa.gov/neo/rest/v1/feed?api_key=${apiKey}&${forwardParams(url, ['start_date','end_date'])}`,
    neo:       `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${apiKey}`,
    mars:      `https://api.nasa.gov/insight_weather/?api_key=${apiKey}&feedtype=json&ver=1.0`,
    epic:      `https://api.nasa.gov/EPIC/api/natural?api_key=${apiKey}`,
  };

  if (!endpoint || !endpoints[endpoint]) {
    return new Response(JSON.stringify({ error: 'Unknown endpoint. Use: apod, asteroids, neo, mars, epic' }), {
      status: 400, headers: corsHeaders('application/json'),
    });
  }

  try {
    const res = await fetch(endpoints[endpoint], {
      headers: { 'User-Agent': 'missionctrl.no/1.0' },
    });
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: corsHeaders(res.headers.get('content-type') || 'application/json'),
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Upstream NASA API error', detail: e.message }), {
      status: 502, headers: corsHeaders('application/json'),
    });
  }
}

function forwardParams(url, keys) {
  return keys
    .filter(k => url.searchParams.has(k))
    .map(k => `${k}=${url.searchParams.get(k)}`)
    .join('&');
}

function corsHeaders(contentType) {
  return {
    'Content-Type': contentType,
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=300',
  };
}
