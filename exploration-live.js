(() => {
  const nasa = ['nasa.gov'];
  const eventHosts = ['thespacedevs.com'];
  const eventUrl = 'https://ll.thespacedevs.com/2.3.0/events/upcoming/?limit=12&hide_recent_previous=true&ordering=date';
  const eventCacheKey = 'missionctrl-exploration-events';
  const gallery = {
    curiosity: 'https://mars.nasa.gov/msl/multimedia/raw-images/',
    perseverance: 'https://mars.nasa.gov/mars2020/multimedia/raw-images/',
  };
  const updated = new Intl.DateTimeFormat('en', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC',
  });
  const calendar = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' });

  function safeLink(value, domains) {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.username || url.password) return '';
      if (!domains || domains.some(domain => url.hostname === domain || url.hostname.endsWith('.' + domain))) return url.href;
    } catch {}
    return '';
  }

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function link(label, url) {
    const node = element('a', label);
    node.href = url;
    return node;
  }

  function markup(value) {
    const template = document.createElement('template');
    template.innerHTML = typeof value === 'string' ? value.slice(0, 8000) : '';
    return template.content;
  }

  function summary(value, limit = 240) {
    const text = markup(value).textContent.replace(/\s+/g, ' ').trim();
    if (text.length <= limit) return text;
    return text.slice(0, limit).replace(/\s+\S*$/, '') + '…';
  }

  function dateLabel(value) {
    const stamp = typeof value === 'number' ? value : Date.parse(value);
    if (!Number.isFinite(stamp)) return '';
    return /^\d{4}-\d{2}-\d{2}$/.test(value) ? calendar.format(stamp) : updated.format(stamp) + ' UTC';
  }

  function rssItems(xml) {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.querySelector('parsererror') || !doc.querySelector('rss channel')) throw new Error('Invalid NASA RSS');
    return [...doc.querySelectorAll('item')].flatMap(item => {
      const source = safeLink(item.querySelector('link')?.textContent, nasa);
      const title = summary(item.querySelector('title')?.textContent, 160);
      const description = summary(item.querySelector('description')?.textContent);
      const published = Date.parse(item.querySelector('pubDate')?.textContent);
      const media = [...item.children].find(node =>
        (node.localName === 'content' || node.localName === 'thumbnail' || node.localName === 'enclosure') &&
        node.hasAttribute('url') && (!node.hasAttribute('type') || node.getAttribute('type').startsWith('image/')));
      const encoded = [...item.children].find(node => node.localName === 'encoded');
      const embedded = markup(encoded?.textContent || item.querySelector('description')?.textContent).querySelector('img[src]');
      const image = safeLink(media?.getAttribute('url'), nasa) || safeLink(embedded?.getAttribute('src'), nasa);
      return source && title && Number.isFinite(published) ? [{ source, title, description, published, image }] : [];
    }).sort((a, b) => b.published - a.published);
  }

  function eventsFrom(data) {
    if (!Array.isArray(data.results)) throw new Error('Invalid event list');
    return data.results.flatMap(row => {
      const start = Date.parse(row.date);
      const end = Date.parse(row.date_end);
      const info = Array.isArray(row.info_urls) ? row.info_urls.map(item => safeLink(item.url)).find(Boolean) : '';
      const video = Array.isArray(row.vid_urls) ? row.vid_urls.map(item => safeLink(item.url)).find(Boolean) : '';
      const source = info || safeLink(row.info_url) || safeLink(row.url, eventHosts);
      const title = summary(row.name, 160);
      const precision = row.date_precision?.name;
      const timed = precision === 'Hour' || precision === 'Minute' || precision === 'Second';
      const day = precision === 'Day';
      if (!source || !title || !Number.isFinite(start) || (Number.isFinite(end) ? end : start + (day ? 86400000 : 3600000)) <= Date.now()) return [];
      const date = timed ? dateLabel(row.date) : day ? calendar.format(start) : 'See source for timing';
      return [{ start, timed: timed || day, title, source, date,
        description: summary(row.description), webcast: video || safeLink(row.video_url) }];
    }).sort((a, b) => a.start - b.start);
  }

  function rawImages(data) {
    const rows = Array.isArray(data) ? data : data.images ?? data.items ?? data.results;
    if (!Array.isArray(rows)) throw new Error('Invalid rover list');
    const seen = new Set();
    return rows.flatMap(row => {
      const image = safeLink(row.image_files?.medium || row.image_files?.small || row.image_files?.full_res ||
        row.url || row.image_url || row.full_res_url || row.image_url_medium, nasa);
      if (!image || seen.has(image)) return [];
      seen.add(image);
      const date = row.date_taken_utc || row.earth_date || row.date_taken || row.date_received;
      const captured = !row.date_taken_utc && !row.earth_date && !row.date_taken ? '' : dateLabel(date);
      const sol = String(row.sol ?? '');
      const camera = summary(row.camera?.instrument || row.camera?.name || row.instrument || row.instrument_name ||
        (typeof row.camera === 'string' ? row.camera : ''), 64);
      const meta = [camera, captured, /^\d{1,6}$/.test(sol) ? 'Sol ' + Number(sol).toLocaleString('en') : '', summary(row.credit, 100)].filter(Boolean).join(' · ');
      return [{ image, meta, stamp: Date.parse(date) || 0 }];
    }).sort((a, b) => b.stamp - a.stamp).slice(0, 3);
  }

  function article(title, meta, detail, links, photo = '', heading = 'h3') {
    const item = element('article', '', 'exploration-item');
    item.append(element(heading, title));
    if (photo) {
      const img = element('img');
      img.src = photo;
      img.alt = title;
      img.loading = 'lazy';
      item.append(img);
    }
    if (meta) item.append(element('p', meta, 'exploration-meta'));
    if (detail) item.append(element('p', detail));
    const actions = element('div', '', 'exploration-links');
    for (const [label, url] of links) if (url) actions.append(link(label, url));
    item.append(actions);
    return item;
  }

  async function load(feed, format) {
    const response = await fetch('/exploration-feed?feed=' + feed, { signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error('Feed unavailable');
    return response[format]();
  }

  async function loadEvents() {
    let cached;
    try { cached = JSON.parse(sessionStorage.getItem(eventCacheKey)); } catch {}
    if (Array.isArray(cached?.data?.results) && Date.now() - cached.storedAt < 900000) return eventsFrom(cached.data);
    try {
      const response = await fetch(eventUrl, { signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Event feed unavailable');
      const data = await response.json();
      const upcoming = eventsFrom(data);
      try { sessionStorage.setItem(eventCacheKey, JSON.stringify({ data, storedAt: Date.now() })); } catch {}
      return upcoming;
    } catch (error) {
      if (Array.isArray(cached?.data?.results)) return eventsFrom(cached.data);
      throw error;
    }
  }

  function replace(target, items) {
    if (!target || target.contains(document.activeElement)) return false;
    target.replaceChildren(...items);
    return true;
  }

  function updateSpotlight(target, fallback, item) {
    if (!target || !fallback || fallback.contains(document.activeElement)) return;
    if (replace(target, item ? [item] : [])) fallback.hidden = Boolean(item);
  }

  const events = document.querySelector('#live-mission-events');
  const spotlight = document.querySelector('#live-milestone');
  const research = document.querySelector('#live-rover-research');
  const photos = document.querySelector('#live-rover-photojournal');
  const dashboardPhoto = document.querySelector('#live-mars-photo');
  const raw = Object.keys(gallery).map(id => [id, document.querySelector('#live-' + id)]);

  function renderEvent(event, dashboard = false) {
    return article(event.title, event.date + ' · Launch Library 2', event.description, [
      ['Event details', event.source], ['Webcast', event.webcast], ['Full watchlist', dashboard && '/missions/#watchlist'],
    ]);
  }

  async function refresh() {
    if (document.hidden) return;
    const tasks = [];
    if (events || spotlight) tasks.push((async () => {
      const upcoming = await loadEvents();
      replace(events, upcoming.length ? upcoming.slice(0, 8).map(event => renderEvent(event)) :
        [element('p', 'The event feed has no upcoming listings.')]);
      const candidate = upcoming.find(event => event.timed);
      const fallback = document.querySelector('#milestone-spotlight');
      const curated = Date.parse(fallback?.dataset.start);
      const expired = Date.parse(fallback?.dataset.end) <= Date.now();
      updateSpotlight(spotlight, fallback,
        candidate && (!Number.isFinite(curated) || expired || candidate.start < curated) ? renderEvent(candidate, true) : null);
    })());
    const roverItem = item => /\b(?:Curiosity|Perseverance|rovers?)\b/i.test(item.title + ' ' + item.description);
    if (research) tasks.push((async () => {
      const stories = rssItems(await load('research', 'text')).filter(roverItem).slice(0, 6);
      if (stories.length) replace(research, stories.map(story =>
        article(story.title, dateLabel(story.published) + ' · NASA Science', story.description, [['Read NASA’s update', story.source]])));
    })());
    if (photos || dashboardPhoto) tasks.push((async () => {
      const stories = rssItems(await load('photos', 'text')).filter(roverItem).slice(0, 6);
      const render = (story, dashboard = false) => article(story.title,
        dateLabel(story.published) + ' · NASA Photojournal', story.description,
        [['Image details and credit', story.source], ['Explore the rover stories', dashboard && '/mars-rovers/']], story.image);
      if (stories.length) replace(photos, stories.map(story => render(story)));
      const featured = stories.find(story => story.image);
      const fallback = document.querySelector('#rover-spotlight');
      const curatedDate = Date.parse(fallback?.dataset.published);
      if (featured && Math.floor(featured.published / 86400000) * 86400000 > curatedDate) {
        const item = render(featured, true);
        item.querySelector('img').addEventListener('error', () => updateSpotlight(dashboardPhoto, fallback, null), { once: true });
        updateSpotlight(dashboardPhoto, fallback, item);
      }
    })());
    for (const [id, target] of raw) {
      if (!target) continue;
      tasks.push((async () => {
        const images = rawImages(await load(id, 'json'));
        if (images.length) replace(target, images.map((photo, index) => article(
          'Raw image ' + (index + 1), photo.meta, '', [['View image', photo.image], ['NASA raw gallery', gallery[id]]], photo.image, 'h4')));
      })());
    }
    await Promise.allSettled(tasks);
  }

  let lastRefresh = -Infinity;
  function refreshWhenVisible() {
    if (document.hidden || Date.now() - lastRefresh < 900000) return;
    lastRefresh = Date.now();
    refresh();
  }
  refreshWhenVisible();
  setInterval(refreshWhenVisible, 900000);
  document.addEventListener('visibilitychange', refreshWhenVisible);
})();
