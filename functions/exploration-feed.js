const sources = {
  research: ['https://science.nasa.gov/blogs/mars/feed/', 'application/rss+xml', 1800],
  photos: ['https://science.nasa.gov/feed/photojournal/gallery/mars/', 'application/rss+xml', 1800],
  curiosity: ['https://mars.nasa.gov/api/v1/raw_image_items/?order=sol+desc&per_page=6&page=0&mission=msl', 'application/json', 1800],
  perseverance: ['https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&ver=1.2&num=12&page=0&order=sol+desc', 'application/json', 1800],
};

export async function onRequestGet({ request }) {
  const feed = new URL(request.url).searchParams.get('feed');
  if (!Object.hasOwn(sources, feed)) return new Response('Unknown feed', { status: 404 });
  const [url, type, ttl] = sources[feed];
  const headers = {
    'Content-Type': type,
    'Cache-Control': 'no-store',
    'Content-Security-Policy': "default-src 'none'; sandbox",
    'X-Content-Type-Options': 'nosniff',
  };
  try {
    const response = await fetch(url, {
      headers: { Accept: type },
      signal: AbortSignal.timeout(8000),
      cf: { cacheEverything: true, cacheTtlByStatus: { '200': ttl, '201-599': -1 } },
    });
    if (!response.ok) return new Response('Feed unavailable', { status: 502, headers });
    const body = await response.text();
    if (type === 'application/json') JSON.parse(body);
    else if (!/<rss[\s>]/i.test(body)) throw new Error('Invalid RSS feed');
    headers['Cache-Control'] = `public, max-age=${ttl}, stale-if-error=86400`;
    return new Response(body, { headers });
  } catch {
    return new Response('Feed unavailable', { status: 502, headers });
  }
}
