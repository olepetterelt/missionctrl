const NAV_PAGES = [
  {id:'dashboard',   label:'Dashboard',    href:'/'},
  {id:'solar-system',label:'3D Solar System',href:'/solar-system/'},
  {id:'missions',    label:'Missions',     href:'/missions/'},
  {id:'launches',    label:'Launches',     href:'/launches/'},
  {id:'starship',    label:'Starship',     href:'/starship/'},
  {id:'aurora',      label:'Aurora',       href:'/aurora/'},
  {id:'eclipses',    label:'Eclipses',     href:'/eclipses/'},
  {id:'planets',     label:'Planets',      href:'/planets/'},
  {id:'comets',      label:'Comets',       href:'/comets/'},
  {id:'exoplanets',  label:'Exoplanets',   href:'/exoplanets/'},
  {id:'satellites',  label:'Satellites',   href:'/satellites/'},
  {id:'reentry',     label:'Reentry',      href:'/reentry/'},
  {id:'sky',         label:'Night Sky',    href:'/sky/'},
  {id:'mars',        label:'Mars Weather', href:'/mars/'},
  {id:'astronauts',  label:'Astronauts',   href:'/astronauts/'},
  {id:'rockets',     label:'Rockets',      href:'/rockets/'},
  {id:'agencies',    label:'Agencies',     href:'/agencies/'},
  {id:'timeline',    label:'Timeline',     href:'/timeline/'},
  {id:'history',     label:'This Day',     href:'/history/'},
  {id:'news',        label:'News',         href:'/news/'},
];

const NAV_CSS = `
#site-nav {
  position: sticky; top: 0; z-index: 1000;
  background: rgba(11,13,18,0.97);
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.nav-inner {
  max-width: 1600px; margin: 0 auto;
  display: flex; align-items: center;
  padding: 0 16px; height: 48px; gap: 0;
}
.nav-logo {
  display: flex; align-items: center; gap: 6px;
  text-decoration: none; margin-right: 16px; flex-shrink: 0;
}
.nav-logo-icon { color: #4a9eff; font-size: 16px; }
.nav-logo-text { color: #dde1ed; font-size: 13px; font-weight: 600; letter-spacing: .1em; }
.nav-logo-sub  { color: #4a9eff; font-size: 13px; font-weight: 600; letter-spacing: .1em; }
.nav-links {
  display: flex; gap: 1px; flex: 1;
  overflow-x: auto; scrollbar-width: none;
}
.nav-links::-webkit-scrollbar { display: none; }
.nav-link {
  color: #6b7080; font-size: 11px; font-weight: 500;
  text-decoration: none; padding: 5px 9px; border-radius: 5px;
  letter-spacing: .04em; white-space: nowrap;
  transition: color .15s, background .15s;
}
.nav-link:hover  { color: #dde1ed; background: rgba(255,255,255,0.05); }
.nav-link.active { color: #4a9eff; background: rgba(74,158,255,0.1); }
.nav-right {
  display: flex; align-items: center; gap: 8px;
  flex-shrink: 0; margin-left: 10px;
}
.nav-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: #2ed47a; box-shadow: 0 0 5px #2ed47a;
  animation: npulse 2s infinite;
}
@keyframes npulse { 0%,100%{opacity:1} 50%{opacity:.3} }
.nav-clock { font-family: 'Courier New',monospace; font-size: 11px; color: #5a5f72; }
.nav-loc-btn {
  font-size: 10px; color: #5a5f72; cursor: pointer;
  padding: 3px 8px; border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.06);
  transition: all .15s; white-space: nowrap; max-width: 140px;
  overflow: hidden; text-overflow: ellipsis;
}
.nav-loc-btn:hover { color: #dde1ed; border-color: rgba(255,255,255,0.14); }

/* Space weather alert banner */
#sw-alert {
  display: none; background: rgba(232,64,64,0.12);
  border-bottom: 1px solid rgba(232,64,64,0.3);
  padding: 6px 16px; text-align: center; font-size: 12px;
  color: #e84040; cursor: pointer;
}
#sw-alert.visible { display: block; }
#sw-alert:hover { background: rgba(232,64,64,0.18); }

/* Location overlay */
#loc-overlay {
  display: none; position: fixed; inset: 0;
  background: rgba(0,0,0,0.7); z-index: 2000;
  align-items: center; justify-content: center;
}
#loc-overlay.open { display: flex; }
#loc-box {
  background: #111318; border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px; padding: 24px; width: 380px; max-width: 90vw;
}
#loc-title { font-size: 15px; font-weight: 500; margin-bottom: 4px; color: #dde1ed; }
#loc-sub { font-size: 12px; color: #8890a4; margin-bottom: 16px; line-height: 1.5; }
#loc-input {
  width: 100%; background: #0b0d12; border: 1px solid rgba(255,255,255,0.1);
  border-radius: 7px; padding: 10px 12px; color: #dde1ed; font-size: 13px;
  outline: none; margin-bottom: 8px; box-sizing: border-box;
  transition: border-color .15s;
}
#loc-input:focus { border-color: #4a9eff; }
#loc-input::placeholder { color: #5a5f72; }
#loc-error { font-size: 11px; color: #e84040; margin-bottom: 8px; min-height: 14px; }
#loc-buttons { display: flex; gap: 8px; }
#loc-search-btn {
  flex: 1; background: #4a9eff; border: none; border-radius: 7px;
  padding: 9px; color: #fff; font-size: 13px; font-weight: 500;
  cursor: pointer; transition: background .15s;
}
#loc-search-btn:hover { background: #3a8eef; }
#loc-search-btn:disabled { background: #2a3a5a; color: #5a5f72; cursor: default; }
#loc-gps-btn {
  background: #1e2230; border: 1px solid rgba(255,255,255,0.08);
  border-radius: 7px; padding: 9px 12px; color: #8890a4; font-size: 12px;
  cursor: pointer; transition: all .15s; white-space: nowrap;
}
#loc-gps-btn:hover { color: #dde1ed; border-color: rgba(255,255,255,0.16); }
#loc-suggestions {
  margin-top: 4px; background: #0b0d12;
  border: 1px solid rgba(255,255,255,0.08); border-radius: 7px;
  overflow: hidden; display: none;
}
.loc-suggestion {
  padding: 9px 12px; font-size: 12px; color: #8890a4;
  cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.05);
  transition: background .1s;
}
.loc-suggestion:last-child { border-bottom: none; }
.loc-suggestion:hover { background: rgba(255,255,255,0.04); color: #dde1ed; }
`;

const MOBILE_CSS = `
@media (max-width: 768px) {
  .nav-links { display: none; }
  .nav-links.mob-open {
    display: flex; flex-direction: column;
    position: fixed; top: 48px; left: 0; right: 0;
    background: rgba(11,13,18,0.98);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 8px 0; z-index: 999;
    max-height: calc(100vh - 48px); overflow-y: auto;
  }
  .nav-links.mob-open .nav-link {
    padding: 11px 20px; border-radius: 0;
    font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .nav-hamburger {
    display: flex; flex-direction: column; justify-content: center;
    gap: 4px; cursor: pointer; padding: 8px; margin-right: 4px;
    background: none; border: none;
  }
  .nav-hamburger span {
    display: block; width: 18px; height: 2px;
    background: #8890a4; border-radius: 1px; transition: all .2s;
  }
  .nav-hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(4px,4px); }
  .nav-hamburger.open span:nth-child(2) { opacity: 0; }
  .nav-hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(4px,-4px); }
  .nav-clock { display: none; }
  .nav-loc-btn { max-width: 100px; font-size: 9px; }
}
@media (min-width: 769px) { .nav-hamburger { display: none; } }
`;

window.SITE_LOC = null;

function openLocOverlay() {
  document.getElementById('loc-overlay').classList.add('open');
  setTimeout(() => document.getElementById('loc-input').focus(), 100);
}
function closeLocOverlay() {
  document.getElementById('loc-overlay').classList.remove('open');
}

function setLocation(lat, lon, name) {
  window.SITE_LOC = { lat, lon, name };
  localStorage.setItem('mc_location', JSON.stringify(window.SITE_LOC));
  document.getElementById('nav-loc-btn').textContent = '📍 ' + name;
  closeLocOverlay();
  if (window.onLocationReady) window.onLocationReady(window.SITE_LOC);
}

async function searchLocation() {
  const query = document.getElementById('loc-input').value.trim();
  if (!query) return;
  const btn = document.getElementById('loc-search-btn');
  const err = document.getElementById('loc-error');
  const sug = document.getElementById('loc-suggestions');
  btn.disabled = true; btn.textContent = 'Searching...';
  err.textContent = ''; sug.style.display = 'none';
  try {
    const r = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=4&addressdetails=1`, {headers:{'Accept-Language':'en'}});
    const results = await r.json();
    if (!results.length) {
      err.textContent = 'No results found. Try a different search.';
    } else if (results.length === 1) {
      const res = results[0];
      const name = res.address?.city || res.address?.town || res.address?.village || res.display_name.split(',')[0];
      setLocation(parseFloat(res.lat), parseFloat(res.lon), name);
    } else {
      sug.style.display = 'block'; sug.innerHTML = '';
      results.forEach(res => {
        const name = res.address?.city || res.address?.town || res.address?.village || res.display_name.split(',')[0];
        const country = res.address?.country || '';
        const div = document.createElement('div');
        div.className = 'loc-suggestion';
        div.textContent = res.display_name.split(',').slice(0,3).join(', ');
        div.onclick = () => setLocation(parseFloat(res.lat), parseFloat(res.lon), name + (country ? ', ' + country : ''));
        sug.appendChild(div);
      });
    }
  } catch(e) { err.textContent = 'Search failed. Check your connection.'; }
  btn.disabled = false; btn.textContent = 'Search';
}

function tryGPS() {
  if (!navigator.geolocation) { document.getElementById('loc-error').textContent = 'GPS not available.'; return; }
  const btn = document.getElementById('loc-gps-btn');
  btn.textContent = 'Locating...';
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude: lat, longitude: lon } = pos.coords;
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        .then(r => r.json())
        .then(d => {
          const name = d.address?.city || d.address?.town || d.address?.village || 'Your location';
          setLocation(lat, lon, name);
        }).catch(() => setLocation(lat, lon, `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`));
      btn.textContent = 'Use GPS';
    },
    () => { document.getElementById('loc-error').textContent = 'GPS access denied.'; btn.textContent = 'Use GPS'; }
  );
}

function resetLocation() { localStorage.removeItem('mc_location'); window.SITE_LOC = null; location.reload(); }

function toggleMobNav() {
  const links = document.querySelector('.nav-links');
  const btn = document.getElementById('nav-hamburger');
  links.classList.toggle('mob-open');
  btn.classList.toggle('open');
  if (links.classList.contains('mob-open')) {
    links.querySelectorAll('.nav-link').forEach(a => {
      a.addEventListener('click', () => { links.classList.remove('mob-open'); btn.classList.remove('open'); }, { once: true });
    });
  }
}

// Space weather alert check
async function checkSpaceWeather() {
  try {
    const r = await fetch('https://services.swpc.noaa.gov/json/planetary_k_index_1m.json');
    const d = await r.json();
    const kp = parseFloat(d[d.length-1]?.kp_index || 0);
    const banner = document.getElementById('sw-alert');
    if (!banner) return;
    if (kp >= 6) {
      banner.textContent = `⚠ Space weather alert — Kp ${kp.toFixed(1)} detected. Geomagnetic storm in progress. Aurora may be visible at low latitudes. Click for details.`;
      banner.classList.add('visible');
      banner.onclick = () => window.location.href = '/aurora/';
    } else if (kp >= 5) {
      banner.textContent = `🌌 Minor geomagnetic storm — Kp ${kp.toFixed(1)}. Aurora possible at high latitudes. Click for aurora forecast.`;
      banner.classList.add('visible');
      banner.onclick = () => window.location.href = '/aurora/';
    } else {
      banner.classList.remove('visible');
    }
  } catch(e) {}
}

function injectNav() {
  const style = document.createElement('style');
  style.textContent = NAV_CSS + MOBILE_CSS;
  document.head.appendChild(style);

  const page = document.body.dataset.page || '';

  // Alert banner
  const alert = document.createElement('div');
  alert.id = 'sw-alert';
  document.body.insertBefore(alert, document.body.firstChild);

  // Nav
  const nav = document.createElement('nav');
  nav.id = 'site-nav';
  nav.innerHTML = `<div class="nav-inner">
    <a class="nav-logo" href="/">
      <span class="nav-logo-icon">⬡</span>
      <span class="nav-logo-text">MISSION</span><span class="nav-logo-sub">CTRL.NO</span>
    </a>
    <button class="nav-hamburger" id="nav-hamburger" aria-label="Menu" onclick="toggleMobNav()">
      <span></span><span></span><span></span>
    </button>
    <div class="nav-links">
      ${NAV_PAGES.map(p => `<a href="${p.href}" class="nav-link${p.id === page ? ' active' : ''}">${p.label}</a>`).join('')}
    </div>
    <div class="nav-right">
      <span class="nav-dot"></span>
      <span class="nav-clock" id="nav-clock">--:--:-- UTC</span>
      <span class="nav-loc-btn" id="nav-loc-btn" onclick="openLocOverlay()">📍 Set location</span>
    </div>
  </div>`;
  alert.after(nav);

  // Location overlay
  const overlay = document.createElement('div');
  overlay.id = 'loc-overlay';
  overlay.innerHTML = `<div id="loc-box">
    <div id="loc-title">Set your location</div>
    <div id="loc-sub">Enter a city, address or postal code. Used for ISS passes, aurora visibility, night sky and comet tracking.</div>
    <input id="loc-input" type="text" placeholder="e.g. Jessheim, Oslo, 2050..." autocomplete="off" onkeydown="if(event.key==='Enter')searchLocation()">
    <div id="loc-error"></div>
    <div id="loc-suggestions"></div>
    <div id="loc-buttons">
      <button id="loc-search-btn" onclick="searchLocation()">Search</button>
      <button id="loc-gps-btn" onclick="tryGPS()">Use GPS</button>
      <button onclick="closeLocOverlay()" style="background:#1e2230;border:1px solid rgba(255,255,255,0.08);border-radius:7px;padding:9px 12px;color:#8890a4;font-size:12px;cursor:pointer;">Cancel</button>
    </div>
  </div>`;
  document.body.appendChild(overlay);

  // Clock
  function tickNav() {
    const n = new Date(), p = x => String(x).padStart(2, '0');
    document.getElementById('nav-clock').textContent = `${p(n.getUTCHours())}:${p(n.getUTCMinutes())}:${p(n.getUTCSeconds())} UTC`;
  }
  setInterval(tickNav, 1000); tickNav();

  // Space weather check every 5 min
  checkSpaceWeather();
  setInterval(checkSpaceWeather, 300000);

  // Restore saved location
  const stored = localStorage.getItem('mc_location');
  if (stored) {
    try {
      window.SITE_LOC = JSON.parse(stored);
      document.getElementById('nav-loc-btn').textContent = '📍 ' + (window.SITE_LOC.name || 'Saved location');
      if (window.onLocationReady) setTimeout(() => window.onLocationReady(window.SITE_LOC), 0);
    } catch(e) { localStorage.removeItem('mc_location'); }
  } else {
    setTimeout(openLocOverlay, 600);
  }
}

document.addEventListener('DOMContentLoaded', injectNav);
